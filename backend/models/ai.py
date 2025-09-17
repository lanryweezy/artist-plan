from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum
from .base import BaseDocument, PyObjectId

class AIModule(str, Enum):
    MARKETING = "marketing"
    FINANCIAL = "financial"
    PROJECT = "project"
    CONTENT = "content"
    CALENDAR = "calendar"
    TOUR = "tour"

class SuggestionStatus(str, Enum):
    PENDING = "pending"
    APPLIED = "applied"
    DISMISSED = "dismissed"
    FAILED = "failed"

class AutomationActionType(str, Enum):
    CREATE_TASK = "create_task"
    UPDATE_BUDGET = "update_budget"
    SCHEDULE_EVENT = "schedule_event"
    GENERATE_CONTENT = "generate_content"
    SEND_EMAIL = "send_email"
    POST_SOCIAL = "post_social"
    CREATE_PROJECT = "create_project"
    UPDATE_PROJECT = "update_project"
    CATEGORIZE_EXPENSE = "categorize_expense"
    SET_REMINDER = "set_reminder"

class AutomationAction(BaseModel):
    type: AutomationActionType
    parameters: Dict[str, Any]
    description: str
    estimated_time_saved: Optional[int] = None  # in minutes

class AISuggestionBase(BaseModel):
    module: AIModule
    type: str
    title: str
    description: str
    confidence: float = Field(ge=0.0, le=1.0)
    priority: int = Field(default=3, ge=1, le=5)  # 1=highest, 5=lowest
    actions: List[AutomationAction] = []
    context: Dict[str, Any] = {}

class AISuggestionCreate(AISuggestionBase):
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None

class AISuggestionUpdate(BaseModel):
    status: Optional[SuggestionStatus] = None
    user_feedback: Optional[str] = None
    effectiveness_rating: Optional[int] = Field(None, ge=1, le=5)

class AISuggestionInDB(BaseDocument, AISuggestionBase):
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    status: SuggestionStatus = SuggestionStatus.PENDING
    applied_at: Optional[datetime] = None
    dismissed_at: Optional[datetime] = None
    user_feedback: Optional[str] = None
    effectiveness_rating: Optional[int] = None
    execution_results: List[Dict[str, Any]] = []
    expires_at: Optional[datetime] = None

class AISuggestion(AISuggestionBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    status: SuggestionStatus = SuggestionStatus.PENDING
    applied_at: Optional[datetime] = None
    dismissed_at: Optional[datetime] = None
    user_feedback: Optional[str] = None
    effectiveness_rating: Optional[int] = None
    execution_results: List[Dict[str, Any]] = []
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# AI Context and Learning Models
class AIContextBase(BaseModel):
    user_id: PyObjectId
    context_type: str  # user_preferences, project_context, historical_data
    data: Dict[str, Any]
    relevance_score: float = Field(default=1.0, ge=0.0, le=1.0)

class AIContextInDB(BaseDocument, AIContextBase):
    last_used: Optional[datetime] = None
    usage_count: int = 0
    expires_at: Optional[datetime] = None

class AIContext(AIContextBase):
    id: PyObjectId = Field(alias="_id")
    last_used: Optional[datetime] = None
    usage_count: int = 0
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# AI Learning and Feedback Models
class AIFeedbackBase(BaseModel):
    user_id: PyObjectId
    suggestion_id: Optional[PyObjectId] = None
    feedback_type: str  # positive, negative, suggestion_improvement
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None
    context: Dict[str, Any] = {}

class AIFeedbackInDB(BaseDocument, AIFeedbackBase):
    processed: bool = False
    processed_at: Optional[datetime] = None

class AIFeedback(AIFeedbackBase):
    id: PyObjectId = Field(alias="_id")
    processed: bool = False
    processed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# AI Automation Rules
class AutomationRuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_conditions: Dict[str, Any]
    actions: List[AutomationAction]
    is_active: bool = True

class AutomationRuleCreate(AutomationRuleBase):
    user_id: PyObjectId

class AutomationRuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger_conditions: Optional[Dict[str, Any]] = None
    actions: Optional[List[AutomationAction]] = None
    is_active: Optional[bool] = None

class AutomationRuleInDB(BaseDocument, AutomationRuleBase):
    user_id: PyObjectId
    execution_count: int = 0
    last_executed: Optional[datetime] = None
    success_rate: float = 0.0

class AutomationRule(AutomationRuleBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    execution_count: int = 0
    last_executed: Optional[datetime] = None
    success_rate: float = 0.0
    created_at: datetime
    updated_at: datetime