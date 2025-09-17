from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

class Project(BaseModel):
    id: str
    name: str
    type: str
    status: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class CreateProjectRequest(BaseModel):
    name: str
    type: str
    description: Optional[str] = None

@router.get("/", response_model=List[Project])
async def get_projects(token = Depends(security)):
    """Get user projects"""
    # Retrieve projects for the authenticated user
    return []

@router.post("/", response_model=Project)
async def create_project(request: CreateProjectRequest, token = Depends(security)):
    """Create new project"""
    # Create new project for the authenticated user
    now = datetime.utcnow()
    return {
        "id": "dummy_project_id",
        "name": request.name,
        "type": request.type,
        "status": "active",
        "description": request.description,
        "created_at": now,
        "updated_at": now
    }

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, token = Depends(security)):
    """Get specific project"""
    # Retrieve projects for the authenticated user
    now = datetime.utcnow()
    return {
        "id": project_id,
        "name": "Sample Project",
        "type": "album",
        "status": "active",
        "description": "Sample project description",
        "created_at": now,
        "updated_at": now
    }