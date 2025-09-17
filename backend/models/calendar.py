from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
from .base import BaseDocument, PyObjectId

class EventType(str, Enum):
    TASK_DEADLINE = "task_deadline"
    PROJECT_MILESTONE = "project_milestone"
    MEETING = "meeting"
    RECORDING_SESSION = "recording_session"
    PERFORMANCE = "performance"
    REHEARSAL = "rehearsal"
    MARKETING_CAMPAIGN = "marketing_campaign"
    RELEASE_DATE = "release_date"
    TOUR_DATE = "tour_date"
    PERSONAL = "personal"
    OTHER = "other"

class EventStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"

class EventPriority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class RecurrencePattern(BaseModel):
    frequency: str  # daily, weekly, monthly, yearly
    interval: int = 1  # every N frequency units
    days_of_week: Optional[List[int]] = None  # 0=Monday, 6=Sunday
    day_of_month: Optional[int] = None
    end_date: Optional[datetime] = None
    occurrence_count: Optional[int] = None

class EventReminder(BaseModel):
    minutes_before: int
    method: str = "notification"  # notification, email, sms
    sent: bool = False

class EventAttendee(BaseModel):
    user_id: Optional[PyObjectId] = None
    email: Optional[str] = None
    name: str
    status: str = "pending"  # pending, accepted, declined, tentative
    role: Optional[str] = None

class EventLocation(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    venue_type: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None  # lat, lng

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: EventType
    status: EventStatus = EventStatus.SCHEDULED
    priority: EventPriority = EventPriority.MEDIUM
    start_time: datetime
    end_time: datetime
    all_day: bool = False
    location: Optional[EventLocation] = None
    tags: List[str] = []

class EventCreate(EventBase):
    project_id: Optional[PyObjectId] = None
    task_id: Optional[PyObjectId] = None
    attendees: List[EventAttendee] = []
    reminders: List[EventReminder] = []
    recurrence: Optional[RecurrencePattern] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[EventStatus] = None
    priority: Optional[EventPriority] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    all_day: Optional[bool] = None
    location: Optional[EventLocation] = None
    tags: Optional[List[str]] = None

class EventInDB(BaseDocument, EventBase):
    creator_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    task_id: Optional[PyObjectId] = None
    attendees: List[EventAttendee] = []
    reminders: List[EventReminder] = []
    recurrence: Optional[RecurrencePattern] = None
    parent_event_id: Optional[PyObjectId] = None  # For recurring events
    is_recurring: bool = False
    external_calendar_id: Optional[str] = None
    external_event_id: Optional[str] = None
    ai_generated: bool = False
    conflict_detected: bool = False
    travel_time_minutes: Optional[int] = None

class Event(EventBase):
    id: PyObjectId = Field(alias="_id")
    creator_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    task_id: Optional[PyObjectId] = None
    attendees: List[EventAttendee] = []
    reminders: List[EventReminder] = []
    recurrence: Optional[RecurrencePattern] = None
    parent_event_id: Optional[PyObjectId] = None
    is_recurring: bool = False
    external_calendar_id: Optional[str] = None
    external_event_id: Optional[str] = None
    ai_generated: bool = False
    conflict_detected: bool = False
    travel_time_minutes: Optional[int] = None
    created_at: datetime
    updated_at: datetime

# Calendar Integration Models
class CalendarIntegrationBase(BaseModel):
    provider: str  # google, outlook, apple, etc.
    calendar_id: str
    calendar_name: str
    is_primary: bool = False
    sync_enabled: bool = True
    sync_direction: str = "bidirectional"  # import_only, export_only, bidirectional

class CalendarIntegrationCreate(CalendarIntegrationBase):
    access_token: str
    refresh_token: Optional[str] = None

class CalendarIntegrationUpdate(BaseModel):
    calendar_name: Optional[str] = None
    is_primary: Optional[bool] = None
    sync_enabled: Optional[bool] = None
    sync_direction: Optional[str] = None

class CalendarIntegrationInDB(BaseDocument, CalendarIntegrationBase):
    user_id: PyObjectId
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    last_sync: Optional[datetime] = None
    sync_status: str = "active"  # active, error, disabled
    sync_error: Optional[str] = None

class CalendarIntegration(CalendarIntegrationBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    token_expires_at: Optional[datetime] = None
    last_sync: Optional[datetime] = None
    sync_status: str = "active"
    sync_error: Optional[str] = None
    created_at: datetime
    updated_at: datetime