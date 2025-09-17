from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId
from .base import BaseDocument, PyObjectId

class ProjectType(str, Enum):
    ALBUM = "album"
    SINGLE = "single"
    EP = "ep"
    TOUR = "tour"
    MARKETING_CAMPAIGN = "marketing_campaign"
    COLLABORATION = "collaboration"
    CUSTOM = "custom"

class ProjectStatus(str, Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"

class ProjectBudget(BaseModel):
    total_budget: Optional[float] = None
    allocated_budget: float = 0.0
    spent_budget: float = 0.0
    currency: str = "USD"
    budget_categories: Dict[str, float] = {}

class ProjectTimeline(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    milestones: List[Dict[str, Any]] = []
    estimated_duration_days: Optional[int] = None

class ProjectCollaborator(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    user_id: PyObjectId
    role: str
    permissions: List[str] = []
    added_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: ProjectType
    status: ProjectStatus = ProjectStatus.PLANNING
    priority: int = Field(default=3, ge=1, le=5)  # 1=highest, 5=lowest
    tags: List[str] = []
    budget: Optional[ProjectBudget] = None
    timeline: Optional[ProjectTimeline] = None

class ProjectCreate(ProjectBase):
    owner_id: PyObjectId

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    tags: Optional[List[str]] = None
    budget: Optional[ProjectBudget] = None
    timeline: Optional[ProjectTimeline] = None

class ProjectInDB(BaseDocument, ProjectBase):
    owner_id: PyObjectId
    collaborators: List[ProjectCollaborator] = []
    task_count: int = 0
    completed_task_count: int = 0
    progress_percentage: float = 0.0
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    archived: bool = False

class Project(ProjectBase):
    id: PyObjectId = Field(alias="_id")
    owner_id: PyObjectId
    collaborators: List[ProjectCollaborator] = []
    task_count: int = 0
    completed_task_count: int = 0
    progress_percentage: float = 0.0
    last_activity: datetime
    created_at: datetime
    updated_at: datetime
    archived: bool = False