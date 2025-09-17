from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from .base import BaseDocument, PyObjectId

class IntegrationType(str, Enum):
    STREAMING = "streaming"
    SOCIAL_MEDIA = "social_media"
    DISTRIBUTION = "distribution"
    EMAIL_MARKETING = "email_marketing"
    PAYMENT = "payment"
    CALENDAR = "calendar"
    CLOUD_STORAGE = "cloud_storage"
    ANALYTICS = "analytics"
    OTHER = "other"

class IntegrationStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    SYNCING = "syncing"
    EXPIRED = "expired"
    PENDING = "pending"

class SyncConfiguration(BaseModel):
    auto_sync: bool = True
    sync_interval_minutes: int = 60
    sync_direction: str = "bidirectional"  # import_only, export_only, bidirectional
    data_types: List[str] = []  # streaming_data, financial_data, social_metrics, etc.
    filters: Dict[str, Any] = {}
    last_sync_cursor: Optional[str] = None

class IntegrationCredentials(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    api_key: Optional[str] = None
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    expires_at: Optional[datetime] = None
    additional_data: Dict[str, Any] = {}

class IntegrationBase(BaseModel):
    platform: str  # spotify, apple_music, instagram, distrokid, etc.
    platform_display_name: str
    type: IntegrationType
    description: Optional[str] = None
    is_active: bool = True

class IntegrationCreate(IntegrationBase):
    credentials: IntegrationCredentials
    sync_settings: Optional[SyncConfiguration] = None

class IntegrationUpdate(BaseModel):
    is_active: Optional[bool] = None
    sync_settings: Optional[SyncConfiguration] = None
    credentials: Optional[IntegrationCredentials] = None

class IntegrationInDB(BaseDocument, IntegrationBase):
    user_id: PyObjectId
    status: IntegrationStatus = IntegrationStatus.PENDING
    credentials: IntegrationCredentials
    sync_settings: SyncConfiguration = SyncConfiguration()
    last_sync: Optional[datetime] = None
    last_successful_sync: Optional[datetime] = None
    sync_error: Optional[str] = None
    sync_error_count: int = 0
    data_imported_count: int = 0
    webhook_url: Optional[str] = None
    webhook_secret: Optional[str] = None

class Integration(IntegrationBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    status: IntegrationStatus = IntegrationStatus.PENDING
    sync_settings: SyncConfiguration = SyncConfiguration()
    last_sync: Optional[datetime] = None
    last_successful_sync: Optional[datetime] = None
    sync_error: Optional[str] = None
    sync_error_count: int = 0
    data_imported_count: int = 0
    webhook_url: Optional[str] = None
    webhook_secret: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Streaming Platform Data Models
class StreamingDataBase(BaseModel):
    platform: str
    song_title: str
    artist_name: str
    album_name: Optional[str] = None
    isrc: Optional[str] = None
    date: datetime
    streams: int
    revenue: Optional[float] = None
    currency: Optional[str] = "USD"

class StreamingDataInDB(BaseDocument, StreamingDataBase):
    user_id: PyObjectId
    integration_id: PyObjectId
    country: Optional[str] = None
    playlist_adds: Optional[int] = None
    playlist_removes: Optional[int] = None
    listener_count: Optional[int] = None
    raw_data: Dict[str, Any] = {}

class StreamingData(StreamingDataBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    integration_id: PyObjectId
    country: Optional[str] = None
    playlist_adds: Optional[int] = None
    playlist_removes: Optional[int] = None
    listener_count: Optional[int] = None
    raw_data: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

# Social Media Data Models
class SocialMediaDataBase(BaseModel):
    platform: str
    post_id: str
    post_type: str  # photo, video, story, reel, etc.
    content: Optional[str] = None
    posted_at: datetime
    likes: int = 0
    comments: int = 0
    shares: int = 0
    views: Optional[int] = None
    reach: Optional[int] = None
    impressions: Optional[int] = None

class SocialMediaDataInDB(BaseDocument, SocialMediaDataBase):
    user_id: PyObjectId
    integration_id: PyObjectId
    engagement_rate: Optional[float] = None
    hashtags: List[str] = []
    mentions: List[str] = []
    raw_data: Dict[str, Any] = {}

class SocialMediaData(SocialMediaDataBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    integration_id: PyObjectId
    engagement_rate: Optional[float] = None
    hashtags: List[str] = []
    mentions: List[str] = []
    raw_data: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

# Webhook Models for real-time data
class WebhookEventBase(BaseModel):
    integration_id: PyObjectId
    event_type: str
    event_data: Dict[str, Any]
    processed: bool = False

class WebhookEventInDB(BaseDocument, WebhookEventBase):
    user_id: PyObjectId
    processed_at: Optional[datetime] = None
    processing_error: Optional[str] = None
    retry_count: int = 0

class WebhookEvent(WebhookEventBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    processed_at: Optional[datetime] = None
    processing_error: Optional[str] = None
    retry_count: int = 0
    created_at: datetime
    updated_at: datetime