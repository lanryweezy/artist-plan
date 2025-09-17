from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
from bson import ObjectId
from .base import BaseDocument, PyObjectId

class SubscriptionTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class UserType(str, Enum):
    SOLO_ARTIST = "solo_artist"
    BAND = "band"
    MANAGER = "manager"
    PRODUCER = "producer"
    LABEL = "label"

class NotificationSettings(BaseModel):
    email: bool = True
    push: bool = True
    marketing: bool = False
    task_reminders: bool = True
    project_updates: bool = True
    financial_alerts: bool = True
    ai_suggestions: bool = True

class DashboardWidget(BaseModel):
    widget_type: str
    position: Dict[str, int]  # x, y, width, height
    settings: Dict[str, Any] = {}
    is_visible: bool = True

class UserPreferences(BaseModel):
    theme: str = "light"
    language: str = "en"
    timezone: str = "UTC"
    currency: str = "USD"
    notifications: NotificationSettings = NotificationSettings()
    dashboard_layout: List[DashboardWidget] = []
    ai_automation_level: str = "medium"  # low, medium, high
    onboarding_completed: bool = False

class UserProfile(BaseModel):
    bio: Optional[str] = None
    website: Optional[str] = None
    social_links: Dict[str, str] = {}
    genres: List[str] = []
    instruments: List[str] = []
    location: Optional[str] = None
    career_stage: Optional[str] = None  # emerging, developing, established, etc.

class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    user_type: Optional[UserType] = None
    subscription: SubscriptionTier = SubscriptionTier.FREE
    profile: Optional[UserProfile] = None
    preferences: UserPreferences = UserPreferences()

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    user_type: Optional[UserType] = None
    profile: Optional[UserProfile] = None
    preferences: Optional[UserPreferences] = None

class UserInDB(BaseDocument, UserBase):
    hashed_password: str
    is_active: bool = True
    email_verified: bool = False
    last_login: Optional[datetime] = None
    login_count: int = 0
    subscription_expires_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    oauth_providers: List[str] = []  # google, apple, spotify, etc.
    two_factor_enabled: bool = False
    api_key: Optional[str] = None

class User(UserBase):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: PyObjectId = Field(alias="_id")
    is_active: bool = True
    email_verified: bool = False
    last_login: Optional[datetime] = None
    login_count: int = 0
    subscription_expires_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    oauth_providers: List[str] = []
    two_factor_enabled: bool = False
    created_at: datetime
    updated_at: datetime