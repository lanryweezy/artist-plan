from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from .base import BaseDocument, PyObjectId

class ContentType(str, Enum):
    AUDIO = "audio"
    VIDEO = "video"
    IMAGE = "image"
    DOCUMENT = "document"
    ARCHIVE = "archive"
    OTHER = "other"

class ContentStatus(str, Enum):
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ContentVersion(BaseModel):
    version_number: int
    file_url: str
    file_size: int
    mime_type: str
    checksum: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: PyObjectId
    change_notes: Optional[str] = None

class ContentMetadata(BaseModel):
    duration: Optional[float] = None  # For audio/video in seconds
    dimensions: Optional[Dict[str, int]] = None  # width, height for images/videos
    bitrate: Optional[int] = None
    sample_rate: Optional[int] = None
    format_info: Dict[str, Any] = {}

class ContentTag(BaseModel):
    name: str
    color: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: ContentType
    status: ContentStatus = ContentStatus.DRAFT
    tags: List[str] = []
    categories: List[str] = []
    is_public: bool = False

class ContentCreate(ContentBase):
    file_url: str
    file_size: int
    mime_type: str
    original_filename: str
    project_id: Optional[PyObjectId] = None

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ContentStatus] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    is_public: Optional[bool] = None

class ContentInDB(BaseDocument, ContentBase):
    owner_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    current_version: int = 1
    versions: List[ContentVersion] = []
    metadata: Optional[ContentMetadata] = None
    ai_generated_tags: List[str] = []
    ai_description: Optional[str] = None
    download_count: int = 0
    view_count: int = 0
    last_accessed: Optional[datetime] = None
    shared_with: List[PyObjectId] = []
    share_settings: Dict[str, Any] = {}

class Content(ContentBase):
    id: PyObjectId = Field(alias="_id")
    owner_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    current_version: int = 1
    versions: List[ContentVersion] = []
    metadata: Optional[ContentMetadata] = None
    ai_generated_tags: List[str] = []
    ai_description: Optional[str] = None
    download_count: int = 0
    view_count: int = 0
    last_accessed: Optional[datetime] = None
    shared_with: List[PyObjectId] = []
    share_settings: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

# Content Collection Model for organizing content
class ContentCollectionBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False
    tags: List[str] = []

class ContentCollectionCreate(ContentCollectionBase):
    content_ids: List[PyObjectId] = []

class ContentCollectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None

class ContentCollectionInDB(BaseDocument, ContentCollectionBase):
    owner_id: PyObjectId
    content_ids: List[PyObjectId] = []
    collaborators: List[PyObjectId] = []
    view_count: int = 0
    last_accessed: Optional[datetime] = None

class ContentCollection(ContentCollectionBase):
    id: PyObjectId = Field(alias="_id")
    owner_id: PyObjectId
    content_ids: List[PyObjectId] = []
    collaborators: List[PyObjectId] = []
    view_count: int = 0
    last_accessed: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime