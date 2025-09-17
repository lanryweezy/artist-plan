from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime

from services.base_crud import BaseCRUDService
from models.project import Project, ProjectCreate, ProjectUpdate

class ProjectService(BaseCRUDService[Project, ProjectCreate, ProjectUpdate]):
    """Service for project management operations"""
    
    def __init__(self):
        super().__init__(Project, "projects")
    
    async def get_by_status(self, status: str, user_id: str) -> List[Project]:
        """Get projects by status"""
        return await self.get_multi(
            user_id=user_id,
            filters={"status": status}
        )
    
    async def get_by_type(self, project_type: str, user_id: str) -> List[Project]:
        """Get projects by type"""
        return await self.get_multi(
            user_id=user_id,
            filters={"type": project_type}
        )
    
    async def search_projects(self, query: str, user_id: str) -> List[Project]:
        """Search projects by name or description"""
        return await self.get_multi(
            user_id=user_id,
            filters={
                "$or": [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"description": {"$regex": query, "$options": "i"}}
                ]
            }
        )
    
    async def get_active_projects(self, user_id: str) -> List[Project]:
        """Get active projects (not completed or archived)"""
        return await self.get_multi(
            user_id=user_id,
            filters={
                "status": {"$nin": ["completed", "archived"]},
                "is_deleted": {"$ne": True}
            }
        )
    
    async def update_project_progress(self, project_id: str, progress: float, user_id: str) -> Optional[Project]:
        """Update project progress percentage"""
        if not ObjectId.is_valid(project_id):
            return None
        
        result = await self.collection.update_one(
            {"_id": ObjectId(project_id), "user_id": ObjectId(user_id)},
            {
                "$set": {
                    "progress": max(0, min(100, progress)),  # Clamp between 0-100
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            return await self.get(project_id, user_id)
        return None

# Create singleton instance
project_service = ProjectService()