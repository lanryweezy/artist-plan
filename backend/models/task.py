from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from .base import BaseDocument, PyObjectId

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"

class TaskPriority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class TaskType(str, Enum):
    CREATIVE = "creative"
    ADMINISTRATIVE = "administrative"
    MARKETING = "marketing"
    FINANCIAL = "financial"
    TECHNICAL = "technical"
    COLLABORATION = "collaboration"

class TaskDependency(BaseModel):
    task_id: PyObjectId
    dependency_type: str = "finish_to_start"  # finish_to_start, start_to_start, etc.

class TaskAssignee(BaseModel):
    user_id: PyObjectId
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    role: Optional[str] = None

class TaskComment(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: PyObjectId())
    user_id: PyObjectId
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskAttachment(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: PyObjectId())
    filename: str
    file_url: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    uploaded_by: PyObjectId
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    type: TaskType = TaskType.ADMINISTRATIVE
    tags: List[str] = []
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None

class TaskCreate(TaskBase):
    project_id: Optional[PyObjectId] = None
    parent_task_id: Optional[PyObjectId] = None
    assignees: List[PyObjectId] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    type: Optional[TaskType] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None

class TaskInDB(BaseDocument, TaskBase):
    project_id: Optional[PyObjectId] = None
    parent_task_id: Optional[PyObjectId] = None
    creator_id: PyObjectId
    assignees: List[TaskAssignee] = []
    dependencies: List[TaskDependency] = []
    subtasks: List[PyObjectId] = []
    comments: List[TaskComment] = []
    attachments: List[TaskAttachment] = []
    completed_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    progress_percentage: float = 0.0
    ai_generated: bool = False
    ai_suggestions: List[Dict[str, Any]] = []

class Task(TaskBase):
    id: PyObjectId = Field(alias="_id")
    project_id: Optional[PyObjectId] = None
    parent_task_id: Optional[PyObjectId] = None
    creator_id: PyObjectId
    assignees: List[TaskAssignee] = []
    dependencies: List[TaskDependency] = []
    subtasks: List[PyObjectId] = []
    comments: List[TaskComment] = []
    attachments: List[TaskAttachment] = []
    completed_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    progress_percentage: float = 0.0
    ai_generated: bool = False
    ai_suggestions: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime