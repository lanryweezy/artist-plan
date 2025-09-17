from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import List, Optional

from models.project import Project, ProjectCreate, ProjectUpdate
from models.user import UserInDB
from services.project_service import project_service
from schemas.responses import BaseResponse, PaginatedResponse, SuccessResponse, create_response, create_paginated_response
from routers.auth import get_current_user

router = APIRouter()

# Response model for API responses
class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    type: str
    status: str
    progress: float = 0.0
    created_at: str
    updated_at: str

def project_to_response(project: Project) -> ProjectResponse:
    """Convert Project model to response model"""
    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        description=project.description,
        type=project.type,
        status=project.status,
        progress=project.progress,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat()
    )

@router.post("/", response_model=BaseResponse[ProjectResponse])
async def create_project(
    project: ProjectCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Create a new project"""
    created_project = await project_service.create(project, user_id=str(current_user.id))
    response_data = project_to_response(created_project)
    return create_response(data=response_data, message="Project created successfully")

@router.get("/{project_id}", response_model=BaseResponse[ProjectResponse])
async def get_project(
    project_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get a project by ID"""
    project = await project_service.get(project_id, user_id=str(current_user.id))
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    response_data = project_to_response(project)
    return create_response(data=response_data)

@router.get("/", response_model=PaginatedResponse[ProjectResponse])
async def get_projects(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    type_filter: Optional[str] = Query(None, description="Filter by type"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    current_user: UserInDB = Depends(get_current_user)
):
    """Get projects with pagination and filtering"""
    skip = (page - 1) * size
    
    # Apply filters
    if search:
        projects = await project_service.search_projects(search, str(current_user.id))
    elif status_filter:
        projects = await project_service.get_by_status(status_filter, str(current_user.id))
    elif type_filter:
        projects = await project_service.get_by_type(type_filter, str(current_user.id))
    else:
        projects = await project_service.get_multi(
            skip=skip, 
            limit=size, 
            user_id=str(current_user.id)
        )
    
    # Apply pagination to filtered results
    paginated_projects = projects[skip:skip + size]
    total = len(projects) if search or status_filter or type_filter else await project_service.count(user_id=str(current_user.id))
    
    response_data = [project_to_response(project) for project in paginated_projects]
    
    return create_paginated_response(
        data=response_data,
        page=page,
        size=size,
        total=total
    )

@router.put("/{project_id}", response_model=BaseResponse[ProjectResponse])
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Update a project"""
    updated_project = await project_service.update(
        project_id, 
        project_update, 
        user_id=str(current_user.id)
    )
    if not updated_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    response_data = project_to_response(updated_project)
    return create_response(data=response_data, message="Project updated successfully")

@router.delete("/{project_id}", response_model=SuccessResponse)
async def delete_project(
    project_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Delete a project (soft delete)"""
    deleted = await project_service.soft_delete(project_id, user_id=str(current_user.id))
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return SuccessResponse(message="Project deleted successfully")

@router.get("/active/list", response_model=BaseResponse[List[ProjectResponse]])
async def get_active_projects(
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all active projects"""
    projects = await project_service.get_active_projects(str(current_user.id))
    response_data = [project_to_response(project) for project in projects]
    return create_response(data=response_data)

@router.patch("/{project_id}/progress", response_model=BaseResponse[ProjectResponse])
async def update_project_progress(
    project_id: str,
    progress: float = Query(..., ge=0, le=100, description="Progress percentage (0-100)"),
    current_user: UserInDB = Depends(get_current_user)
):
    """Update project progress"""
    updated_project = await project_service.update_project_progress(
        project_id, 
        progress, 
        str(current_user.id)
    )
    if not updated_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    response_data = project_to_response(updated_project)
    return create_response(data=response_data, message="Project progress updated successfully")