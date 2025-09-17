from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime

from services.base_crud import BaseCRUDService
from models.task import Task, TaskCreate, TaskUpdate

class TaskService(BaseCRUDService[Task, TaskCreate, TaskUpdate]):
    """Service for task management operations"""
    
    def __init__(self):
        super().__init__(Task, "tasks")
    
    async def get_by_project(self, project_id: str, user_id: str) -> List[Task]:
        """Get tasks by project ID"""
        return await self.get_multi(
            user_id=user_id,
            filters={"project_id": ObjectId(project_id)}
        )
    
    async def get_by_status(self, status: str, user_id: str) -> List[Task]:
        """Get tasks by status"""
        return await self.get_multi(
            user_id=user_id,
            filters={"status": status}
        )
    
    async def get_by_priority(self, priority: str, user_id: str) -> List[Task]:
        """Get tasks by priority"""
        return await self.get_multi(
            user_id=user_id,
            filters={"priority": priority}
        )
    
    async def get_overdue_tasks(self, user_id: str) -> List[Task]:
        """Get overdue tasks"""
        return await self.get_multi(
            user_id=user_id,
            filters={
                "due_date": {"$lt": datetime.utcnow()},
                "status": {"$ne": "completed"},
                "is_deleted": {"$ne": True}
            }
        )
    
    async def get_upcoming_tasks(self, days: int, user_id: str) -> List[Task]:
        """Get tasks due in the next N days"""
        from datetime import timedelta
        future_date = datetime.utcnow() + timedelta(days=days)
        
        return await self.get_multi(
            user_id=user_id,
            filters={
                "due_date": {
                    "$gte": datetime.utcnow(),
                    "$lte": future_date
                },
                "status": {"$ne": "completed"},
                "is_deleted": {"$ne": True}
            }
        )
    
    async def mark_completed(self, task_id: str, user_id: str) -> Optional[Task]:
        """Mark a task as completed"""
        if not ObjectId.is_valid(task_id):
            return None
        
        result = await self.collection.update_one(
            {"_id": ObjectId(task_id), "user_id": ObjectId(user_id)},
            {
                "$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            return await self.get(task_id, user_id)
        return None
    
    async def get_task_dependencies(self, task_id: str, user_id: str) -> List[Task]:
        """Get tasks that depend on this task"""
        return await self.get_multi(
            user_id=user_id,
            filters={"dependencies": ObjectId(task_id)}
        )

# Create singleton instance
task_service = TaskService()