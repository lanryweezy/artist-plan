from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId

from database import get_database
from models.user import UserInDB, UserUpdate, UserPreferences, UserType, NotificationSettings
from routers.auth import get_current_user

router = APIRouter()

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    subscription: str
    preferences: dict
    created_at: str
    is_active: bool

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    preferences: Optional[UserPreferences] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class OnboardingRequest(BaseModel):
    userType: UserType
    goals: List[str]
    preferences: Dict[str, Any]
    selectedFeatures: List[str]

def user_to_profile(user: UserInDB) -> UserProfile:
    """Convert UserInDB to UserProfile"""
    return UserProfile(
        id=str(user.id),
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        subscription=user.subscription,
        preferences=user.preferences.dict(),
        created_at=user.created_at.isoformat(),
        is_active=user.is_active
    )

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: UserInDB = Depends(get_current_user)):
    """Get user profile"""
    return user_to_profile(current_user)

@router.put("/profile", response_model=UserProfile)
async def update_profile(
    request: UpdateProfileRequest, 
    current_user: UserInDB = Depends(get_current_user)
):
    """Update user profile"""
    db = get_database()
    
    # Prepare update data
    update_data = {}
    if request.name is not None:
        update_data["name"] = request.name
    if request.avatar is not None:
        update_data["avatar"] = request.avatar
    if request.preferences is not None:
        update_data["preferences"] = request.preferences.dict()
    
    if not update_data:
        return user_to_profile(current_user)
    
    update_data["updated_at"] = datetime.utcnow()
    
    # Update user in database
    result = await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile update failed"
        )
    
    # Get updated user
    updated_user_data = await db.users.find_one({"_id": ObjectId(current_user.id)})
    if not updated_user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    updated_user = UserInDB(**updated_user_data)
    return user_to_profile(updated_user)

@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """Change user password"""
    from routers.auth import verify_password, get_password_hash
    
    # Verify current password
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    new_hashed_password = get_password_hash(request.new_password)
    
    # Update password in database
    db = get_database()
    result = await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {
            "$set": {
                "hashed_password": new_hashed_password,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password change failed"
        )
    
    return {"message": "Password changed successfully"}

@router.delete("/account")
async def delete_account(current_user: UserInDB = Depends(get_current_user)):
    """Deactivate user account (soft delete)"""
    db = get_database()
    
    # Soft delete by setting is_active to False
    result = await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {
            "$set": {
                "is_active": False,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account deactivation failed"
        )
    
    return {"message": "Account deactivated successfully"}

@router.post("/onboarding")
async def complete_onboarding(
    request: OnboardingRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """Complete user onboarding process"""
    db = get_database()
    
    try:
        # Create updated preferences with onboarding data
        notifications = NotificationSettings(
            email=request.preferences.get("notifications", {}).get("email", True),
            push=request.preferences.get("notifications", {}).get("push", True),
            marketing=False,
            task_reminders=request.preferences.get("notifications", {}).get("task_reminders", True),
            project_updates=request.preferences.get("notifications", {}).get("project_updates", True),
            financial_alerts=request.preferences.get("notifications", {}).get("financial_alerts", True),
            ai_suggestions=request.preferences.get("notifications", {}).get("ai_suggestions", True)
        )
        
        updated_preferences = UserPreferences(
            theme=request.preferences.get("theme", "light"),
            language="en",
            timezone=request.preferences.get("timezone", "UTC"),
            currency=request.preferences.get("currency", "USD"),
            notifications=notifications,
            dashboard_layout=[],
            ai_automation_level=request.preferences.get("ai_automation_level", "medium"),
            onboarding_completed=True
        )
        
        # Update user with onboarding data
        update_data = {
            "user_type": request.userType,
            "preferences": updated_preferences.dict(),
            "updated_at": datetime.utcnow()
        }
        
        # Store goals and selected features in user profile or preferences
        # For now, we'll store them as metadata in the preferences
        update_data["preferences"]["onboarding_goals"] = request.goals
        update_data["preferences"]["selected_features"] = request.selectedFeatures
        
        result = await db.users.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Onboarding completion failed"
            )
        
        # Get updated user
        updated_user_data = await db.users.find_one({"_id": ObjectId(current_user.id)})
        if not updated_user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        updated_user = UserInDB(**updated_user_data)
        return {
            "message": "Onboarding completed successfully",
            "user": user_to_profile(updated_user)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Onboarding completion failed: {str(e)}"
        )