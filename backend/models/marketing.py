from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from .base import BaseDocument, PyObjectId

class CampaignType(str, Enum):
    RELEASE_PROMOTION = "release_promotion"
    TOUR_PROMOTION = "tour_promotion"
    BRAND_AWARENESS = "brand_awareness"
    ENGAGEMENT = "engagement"
    PLAYLIST_PITCHING = "playlist_pitching"
    SOCIAL_MEDIA = "social_media"
    EMAIL_MARKETING = "email_marketing"
    INFLUENCER = "influencer"
    PAID_ADVERTISING = "paid_advertising"
    PR = "pr"

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    PLANNED = "planned"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Platform(str, Enum):
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    FACEBOOK = "facebook"
    YOUTUBE = "youtube"
    SPOTIFY = "spotify"
    APPLE_MUSIC = "apple_music"
    EMAIL = "email"
    WEBSITE = "website"
    BLOG = "blog"
    PODCAST = "podcast"
    RADIO = "radio"
    PRESS = "press"

class CampaignObjective(BaseModel):
    type: str  # reach, engagement, conversions, streams, followers
    target_value: Optional[float] = None
    current_value: float = 0.0
    unit: str = "count"  # count, percentage, currency

class CampaignContent(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: PyObjectId())
    title: str
    content_type: str  # post, story, video, image, email, etc.
    platform: Platform
    content: Optional[str] = None
    media_urls: List[str] = []
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, published, failed
    performance_metrics: Dict[str, Any] = {}

class CampaignBudget(BaseModel):
    total_budget: float
    spent_budget: float = 0.0
    currency: str = "USD"
    platform_budgets: Dict[str, float] = {}

class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: CampaignType
    status: CampaignStatus = CampaignStatus.DRAFT
    start_date: datetime
    end_date: datetime
    platforms: List[Platform] = []
    objectives: List[CampaignObjective] = []
    target_audience: Dict[str, Any] = {}
    tags: List[str] = []

class CampaignCreate(CampaignBase):
    project_id: Optional[PyObjectId] = None
    budget: Optional[CampaignBudget] = None

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[CampaignStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    platforms: Optional[List[Platform]] = None
    objectives: Optional[List[CampaignObjective]] = None
    target_audience: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None

class CampaignInDB(BaseDocument, CampaignBase):
    creator_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    budget: Optional[CampaignBudget] = None
    content: List[CampaignContent] = []
    performance_summary: Dict[str, Any] = {}
    ai_generated: bool = False
    ai_suggestions: List[Dict[str, Any]] = []
    collaborators: List[PyObjectId] = []

class Campaign(CampaignBase):
    id: PyObjectId = Field(alias="_id")
    creator_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    budget: Optional[CampaignBudget] = None
    content: List[CampaignContent] = []
    performance_summary: Dict[str, Any] = {}
    ai_generated: bool = False
    ai_suggestions: List[Dict[str, Any]] = []
    collaborators: List[PyObjectId] = []
    created_at: datetime
    updated_at: datetime

# Content Templates for AI generation
class ContentTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    template_type: str  # social_post, email, press_release, etc.
    platform: Optional[Platform] = None
    template_content: str
    variables: List[str] = []  # placeholders like {artist_name}, {song_title}
    tags: List[str] = []

class ContentTemplateInDB(BaseDocument, ContentTemplateBase):
    creator_id: PyObjectId
    is_public: bool = False
    usage_count: int = 0
    rating: float = 0.0

class ContentTemplate(ContentTemplateBase):
    id: PyObjectId = Field(alias="_id")
    creator_id: PyObjectId
    is_public: bool = False
    usage_count: int = 0
    rating: float = 0.0
    created_at: datetime
    updated_at: datetime