from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    project_id: Optional[str] = None
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class CreateTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    project_id: Optional[str] = None
    due_date: Optional[datetime] = None

@router.get("/", response_model=List[Task])
async def get_tasks(token = Depends(security)):
    """Get user tasks"""
    # Retrieve tasks for the authenticated user
    return []

@router.post("/", response_model=Task)
async def create_task(request: CreateTaskRequest, token = Depends(security)):
    """Create new task"""
    # Create new task for the authenticated user
    now = datetime.utcnow()
    return {
        "id": "dummy_task_id",
        "title": request.title,
        "description": request.description,
        "status": "todo",
        "priority": request.priority,
        "project_id": request.project_id,
        "due_date": request.due_date,
        "created_at": now,
        "updated_at": now
    }