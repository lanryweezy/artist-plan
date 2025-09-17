from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId

from ..models.calendar import (
    Event, EventCreate, EventUpdate, EventInDB,
    CalendarIntegration, CalendarIntegrationCreate, CalendarIntegrationUpdate
)
from ..models.user import User
from ..services.base_crud import BaseCRUDService
from ..database import get_database
from .base import get_current_user

router = APIRouter(prefix="/calendar", tags=["calendar"])

class CalendarService(BaseCRUDService[EventInDB, EventCreate, EventUpdate]):
    def __init__(self, db):
        super().__init__(db, "events", EventInDB)
    
    async def get_events_by_date_range(
        self, 
        user_id: str, 
        start_date: datetime, 
        end_date: datetime,
        event_types: Optional[List[str]] = None
    ) -> List[EventInDB]:
        """Get events within a date range for a user"""
        query = {
            "creator_id": ObjectId(user_id),
            "$or": [
                {
                    "start_time": {"$gte": start_date, "$lte": end_date}
                },
                {
                    "end_time": {"$gte": start_date, "$lte": end_date}
                },
                {
                    "$and": [
                        {"start_time": {"$lte": start_date}},
                        {"end_time": {"$gte": end_date}}
                    ]
                }
            ]
        }
        
        if event_types:
            query["type"] = {"$in": event_types}
        
        cursor = self.collection.find(query).sort("start_time", 1)
        return [EventInDB(**doc) async for doc in cursor]
    
    async def get_upcoming_deadlines(
        self, 
        user_id: str, 
        days_ahead: int = 7
    ) -> List[EventInDB]:
        """Get upcoming deadlines for a user"""
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=days_ahead)
        
        query = {
            "creator_id": ObjectId(user_id),
            "type": {"$in": ["task_deadline", "project_milestone", "release_date"]},
            "start_time": {"$gte": start_date, "$lte": end_date},
            "status": {"$ne": "completed"}
        }
        
        cursor = self.collection.find(query).sort("start_time", 1)
        return [EventInDB(**doc) async for doc in cursor]
    
    async def detect_conflicts(
        self, 
        user_id: str, 
        start_time: datetime, 
        end_time: datetime,
        exclude_event_id: Optional[str] = None
    ) -> List[EventInDB]:
        """Detect scheduling conflicts for a user"""
        query = {
            "creator_id": ObjectId(user_id),
            "$or": [
                {
                    "$and": [
                        {"start_time": {"$lt": end_time}},
                        {"end_time": {"$gt": start_time}}
                    ]
                }
            ],
            "status": {"$nin": ["cancelled", "completed"]}
        }
        
        if exclude_event_id:
            query["_id"] = {"$ne": ObjectId(exclude_event_id)}
        
        cursor = self.collection.find(query)
        return [EventInDB(**doc) async for doc in cursor]

@router.get("/events", response_model=List[Event])
async def get_events(
    start_date: datetime = Query(..., description="Start date for event range"),
    end_date: datetime = Query(..., description="End date for event range"),
    event_types: Optional[List[str]] = Query(None, description="Filter by event types"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get events within a date range"""
    service = CalendarService(db)
    events = await service.get_events_by_date_range(
        str(current_user.id), start_date, end_date, event_types
    )
    return [Event(**event.dict()) for event in events]

@router.get("/events/{event_id}", response_model=Event)
async def get_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get a specific event"""
    service = CalendarService(db)
    event = await service.get_by_id(event_id)
    
    if not event or str(event.creator_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Event not found")
    
    return Event(**event.dict())

@router.post("/events", response_model=Event)
async def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new event"""
    service = CalendarService(db)
    
    # Check for conflicts if requested
    conflicts = await service.detect_conflicts(
        str(current_user.id), 
        event_data.start_time, 
        event_data.end_time
    )
    
    # Create event with conflict detection
    event_in_db = EventInDB(
        **event_data.dict(),
        creator_id=current_user.id,
        conflict_detected=len(conflicts) > 0
    )
    
    created_event = await service.create(event_in_db)
    return Event(**created_event.dict())

@router.put("/events/{event_id}", response_model=Event)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Update an existing event"""
    service = CalendarService(db)
    
    # Verify ownership
    existing_event = await service.get_by_id(event_id)
    if not existing_event or str(existing_event.creator_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check for conflicts if time is being updated
    if event_data.start_time or event_data.end_time:
        start_time = event_data.start_time or existing_event.start_time
        end_time = event_data.end_time or existing_event.end_time
        
        conflicts = await service.detect_conflicts(
            str(current_user.id), start_time, end_time, event_id
        )
        
        # Update conflict detection status
        if event_data.dict(exclude_unset=True):
            event_data.conflict_detected = len(conflicts) > 0
    
    updated_event = await service.update(event_id, event_data)
    return Event(**updated_event.dict())

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Delete an event"""
    service = CalendarService(db)
    
    # Verify ownership
    existing_event = await service.get_by_id(event_id)
    if not existing_event or str(existing_event.creator_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Event not found")
    
    await service.delete(event_id)
    return {"message": "Event deleted successfully"}

@router.get("/deadlines", response_model=List[Event])
async def get_upcoming_deadlines(
    days_ahead: int = Query(7, description="Number of days to look ahead"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get upcoming deadlines"""
    service = CalendarService(db)
    deadlines = await service.get_upcoming_deadlines(str(current_user.id), days_ahead)
    return [Event(**deadline.dict()) for deadline in deadlines]

@router.get("/conflicts", response_model=List[Event])
async def check_conflicts(
    start_time: datetime = Query(..., description="Start time to check"),
    end_time: datetime = Query(..., description="End time to check"),
    exclude_event_id: Optional[str] = Query(None, description="Event ID to exclude from conflict check"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Check for scheduling conflicts"""
    service = CalendarService(db)
    conflicts = await service.detect_conflicts(
        str(current_user.id), start_time, end_time, exclude_event_id
    )
    return [Event(**conflict.dict()) for conflict in conflicts]

# Calendar Integration endpoints
class CalendarIntegrationService(BaseCRUDService[CalendarIntegration, CalendarIntegrationCreate, CalendarIntegrationUpdate]):
    def __init__(self, db):
        super().__init__(db, "calendar_integrations", CalendarIntegration)

@router.get("/integrations", response_model=List[CalendarIntegration])
async def get_calendar_integrations(
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get user's calendar integrations"""
    service = CalendarIntegrationService(db)
    query = {"user_id": current_user.id}
    cursor = service.collection.find(query)
    integrations = [CalendarIntegration(**doc) async for doc in cursor]
    return integrations

@router.post("/integrations", response_model=CalendarIntegration)
async def create_calendar_integration(
    integration_data: CalendarIntegrationCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new calendar integration"""
    service = CalendarIntegrationService(db)
    
    integration_in_db = CalendarIntegration(
        **integration_data.dict(),
        user_id=current_user.id
    )
    
    created_integration = await service.create(integration_in_db)
    return created_integration