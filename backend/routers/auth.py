from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from bson import ObjectId
import os

from database import get_database
from models.user import UserCreate, UserInDB, User
from redis_client import redis_client

router = APIRouter()
security = HTTPBearer()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class OAuthRequest(BaseModel):
    provider: str  # 'google' or 'apple'
    token: str
    name: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Get user by email from database"""
    db = get_database()
    user_data = await db.users.find_one({"email": email})
    if user_data:
        return UserInDB(**user_data)
    return None

async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    """Get user by ID from database"""
    db = get_database()
    try:
        user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return UserInDB(**user_data)
    except Exception:
        pass
    return None

async def create_user(user_data: UserCreate) -> UserInDB:
    """Create new user in database"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict["password"]
    user_dict["hashed_password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    return UserInDB(**user_dict)

async def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    """Authenticate user with email and password"""
    user = await get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInDB:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "access":
            raise credentials_exception
            
        # Check if token is blacklisted
        is_blacklisted = await redis_client.get(f"blacklist:{credentials.credentials}")
        if is_blacklisted:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user

def user_to_dict(user: UserInDB) -> dict:
    """Convert user object to dictionary for response"""
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "avatar": user.avatar,
        "subscription": user.subscription,
        "preferences": user.preferences.dict(),
        "created_at": user.created_at.isoformat(),
        "is_active": user.is_active
    }

@router.post("/register", response_model=LoginResponse)
async def register(request: RegisterRequest):
    """User registration endpoint"""
    try:
        # Create user
        user_create = UserCreate(
            email=request.email,
            password=request.password,
            name=request.name
        )
        user = await create_user(user_create)
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Store refresh token in Redis
        await redis_client.setex(
            f"refresh_token:{str(user.id)}", 
            REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            refresh_token
        )
        
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_to_dict(user)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """User login endpoint"""
    user = await authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Store refresh token in Redis
    await redis_client.setex(
        f"refresh_token:{str(user.id)}", 
        REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        refresh_token
    )
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_dict(user)
    )

@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
    )
    
    try:
        payload = jwt.decode(request.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise credentials_exception
            
        # Check if refresh token exists in Redis
        stored_token = await redis_client.get(f"refresh_token:{user_id}")
        if not stored_token or stored_token.decode() != request.refresh_token:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    # Create new access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(current_user: UserInDB = Depends(get_current_user), credentials: HTTPAuthorizationCredentials = Depends(security)):
    """User logout endpoint"""
    # Add token to blacklist
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp:
            # Calculate remaining time until token expires
            remaining_time = exp - datetime.utcnow().timestamp()
            if remaining_time > 0:
                await redis_client.setex(
                    f"blacklist:{credentials.credentials}",
                    int(remaining_time),
                    "blacklisted"
                )
    except JWTError:
        pass
    
    # Remove refresh token
    await redis_client.delete(f"refresh_token:{str(current_user.id)}")
    
    return {"message": "Successfully logged out"}

@router.get("/me")
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    """Get current user information"""
    return user_to_dict(current_user)

@router.post("/oauth", response_model=LoginResponse)
async def oauth_login(request: OAuthRequest):
    """OAuth login endpoint for Google/Apple sign-in"""
    from services.oauth import oauth_service
    
    # Verify OAuth token based on provider
    user_info = None
    if request.provider == "google":
        user_info = await oauth_service.verify_google_token(request.token)
    elif request.provider == "apple":
        user_info = await oauth_service.verify_apple_token(request.token)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider"
        )
    
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OAuth token"
        )
    
    # Check if user exists
    user = await get_user_by_email(user_info["email"])
    
    if not user:
        # Create new user from OAuth info
        user_create = UserCreate(
            email=user_info["email"],
            password="oauth_user",  # OAuth users don't have passwords
            name=request.name or user_info.get("name", "OAuth User"),
            avatar=user_info.get("avatar")
        )
        user = await create_user(user_create)
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Store refresh token in Redis
    await redis_client.setex(
        f"refresh_token:{str(user.id)}", 
        REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        refresh_token
    )
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_dict(user)
    )