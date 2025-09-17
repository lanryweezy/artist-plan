from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.security import HTTPBearer
from typing import List, Optional
from datetime import datetime
import os
import uuid
import aiofiles
from pathlib import Path

from ..models.content import (
    Content, ContentCreate, ContentUpdate, ContentType, ContentStatus,
    ContentCollection, ContentCollectionCreate, ContentCollectionUpdate
)
from ..models.base import PyObjectId
from ..services.content import ContentService, ContentCollectionService
from ..database import get_database
from ..middleware.auth import get_current_user
from ..models.user import User

router = APIRouter()
security = HTTPBearer()

# File upload configuration
UPLOAD_DIR = Path("uploads/content")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

@router.get("/", response_model=List[Content])
async def get_content(
    query: Optional[str] = Query(None, description="Search query"),
    content_type: Optional[ContentType] = Query(None, description="Filter by content type"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    categories: Optional[str] = Query(None, description="Comma-separated categories"),
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
):
    """Get user content with search and filters"""
    db = await get_database()
    content_service = ContentService(db)
    
    # Parse comma-separated values
    tag_list = tags.split(",") if tags else None
    category_list = categories.split(",") if categories else None
    project_obj_id = PyObjectId(project_id) if project_id else None
    
    content_items = await content_service.search_content(
        owner_id=current_user.id,
        query=query,
        content_type=content_type,
        tags=tag_list,
        categories=category_list,
        project_id=project_obj_id,
        limit=limit,
        skip=skip
    )
    
    return [Content(**item.dict()) for item in content_items]

@router.post("/upload", response_model=Content)
async def upload_content(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    categories: Optional[str] = Form(None),
    project_id: Optional[str] = Form(None),
    is_public: bool = Form(False),
    current_user: User = Depends(get_current_user)
):
    """Upload content file with metadata"""
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix if file.filename else ""
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    file_content = await file.read()
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(file_content)
    
    # Determine content type
    content_type = ContentType.OTHER
    if file.content_type:
        if file.content_type.startswith("image/"):
            content_type = ContentType.IMAGE
        elif file.content_type.startswith("audio/"):
            content_type = ContentType.AUDIO
        elif file.content_type.startswith("video/"):
            content_type = ContentType.VIDEO
        elif file.content_type in ["application/pdf", "text/plain", "application/msword"]:
            content_type = ContentType.DOCUMENT
        elif file.content_type in ["application/zip", "application/x-rar"]:
            content_type = ContentType.ARCHIVE
    
    # Parse tags and categories
    tag_list = [tag.strip() for tag in tags.split(",")] if tags else []
    category_list = [cat.strip() for cat in categories.split(",")] if categories else []
    
    # Create content record
    db = await get_database()
    content_service = ContentService(db)
    
    content_data = ContentCreate(
        title=title,
        description=description,
        type=content_type,
        status=ContentStatus.DRAFT,
        tags=tag_list,
        categories=category_list,
        is_public=is_public,
        file_url=f"/uploads/content/{unique_filename}",
        file_size=len(file_content),
        mime_type=file.content_type or "application/octet-stream",
        original_filename=file.filename or "unknown",
        project_id=PyObjectId(project_id) if project_id else None
    )
    
    content_item = await content_service.create_content(
        content_data, 
        current_user.id, 
        file_content
    )
    
    return Content(**content_item.dict())

@router.get("/{content_id}", response_model=Content)
async def get_content_by_id(
    content_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get specific content item"""
    db = await get_database()
    content_service = ContentService(db)
    
    content_item = await content_service.get_by_id(PyObjectId(content_id))
    if not content_item or content_item.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Increment view count
    await content_service.increment_view_count(PyObjectId(content_id))
    
    return Content(**content_item.dict())

@router.put("/{content_id}", response_model=Content)
async def update_content(
    content_id: str,
    content_update: ContentUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update content metadata"""
    db = await get_database()
    content_service = ContentService(db)
    
    content_item = await content_service.get_by_id(PyObjectId(content_id))
    if not content_item or content_item.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Content not found")
    
    updated_content = await content_service.update(PyObjectId(content_id), content_update)
    return Content(**updated_content.dict())

@router.delete("/{content_id}")
async def delete_content(
    content_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete content item"""
    db = await get_database()
    content_service = ContentService(db)
    
    content_item = await content_service.get_by_id(PyObjectId(content_id))
    if not content_item or content_item.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Delete file from filesystem
    try:
        file_path = Path(content_item.versions[-1].file_url.lstrip("/"))
        if file_path.exists():
            file_path.unlink()
    except Exception:
        pass  # Continue even if file deletion fails
    
    await content_service.delete(PyObjectId(content_id))
    return {"message": "Content deleted successfully"}

@router.post("/{content_id}/versions", response_model=Content)
async def add_content_version(
    content_id: str,
    file: UploadFile = File(...),
    change_notes: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """Add new version to existing content"""
    db = await get_database()
    content_service = ContentService(db)
    
    content_item = await content_service.get_by_id(PyObjectId(content_id))
    if not content_item or content_item.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Content not found")
    
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix if file.filename else ""
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    file_content = await file.read()
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(file_content)
    
    # Add version
    updated_content = await content_service.add_version(
        content_id=PyObjectId(content_id),
        file_url=f"/uploads/content/{unique_filename}",
        file_size=len(file_content),
        mime_type=file.content_type or "application/octet-stream",
        created_by=current_user.id,
        change_notes=change_notes,
        file_content=file_content
    )
    
    return Content(**updated_content.dict())

@router.get("/tags/all")
async def get_all_tags(current_user: User = Depends(get_current_user)):
    """Get all unique tags for user's content"""
    db = await get_database()
    content_service = ContentService(db)
    
    tags = await content_service.get_all_tags(current_user.id)
    return {"tags": tags}

@router.get("/categories/all")
async def get_all_categories(current_user: User = Depends(get_current_user)):
    """Get all unique categories for user's content"""
    db = await get_database()
    content_service = ContentService(db)
    
    categories = await content_service.get_all_categories(current_user.id)
    return {"categories": categories}

@router.put("/{content_id}/tags", response_model=Content)
async def update_content_tags(
    content_id: str,
    tags: List[str],
    current_user: User = Depends(get_current_user)
):
    """Update content tags"""
    db = await get_database()
    content_service = ContentService(db)
    
    content_item = await content_service.get_by_id(PyObjectId(content_id))
    if not content_item or content_item.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Content not found")
    
    updated_content = await content_service.update_content_tags(PyObjectId(content_id), tags)
    return Content(**updated_content.dict())

# Content Collections endpoints
@router.get("/collections/", response_model=List[ContentCollection])
async def get_content_collections(current_user: User = Depends(get_current_user)):
    """Get user's content collections"""
    db = await get_database()
    collection_service = ContentCollectionService(db)
    
    collections = await collection_service.get_collections_by_owner(current_user.id)
    return [ContentCollection(**col.dict()) for col in collections]

@router.post("/collections/", response_model=ContentCollection)
async def create_content_collection(
    collection_data: ContentCollectionCreate,
    current_user: User = Depends(get_current_user)
):
    """Create new content collection"""
    db = await get_database()
    collection_service = ContentCollectionService(db)
    
    collection = await collection_service.create_collection(collection_data, current_user.id)
    return ContentCollection(**collection.dict())

@router.put("/collections/{collection_id}/content/{content_id}")
async def add_content_to_collection(
    collection_id: str,
    content_id: str,
    current_user: User = Depends(get_current_user)
):
    """Add content to collection"""
    db = await get_database()
    collection_service = ContentCollectionService(db)
    
    collection = await collection_service.get_by_id(PyObjectId(collection_id))
    if not collection or collection.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    await collection_service.add_content_to_collection(PyObjectId(collection_id), PyObjectId(content_id))
    return {"message": "Content added to collection"}

@router.delete("/collections/{collection_id}/content/{content_id}")
async def remove_content_from_collection(
    collection_id: str,
    content_id: str,
    current_user: User = Depends(get_current_user)
):
    """Remove content from collection"""
    db = await get_database()
    collection_service = ContentCollectionService(db)
    
    collection = await collection_service.get_by_id(PyObjectId(collection_id))
    if not collection or collection.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    await collection_service.remove_content_from_collection(PyObjectId(collection_id), PyObjectId(content_id))
    return {"message": "Content removed from collection"}