"""
Real-time collaboration service
"""
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
from redis_client import redis_client
from services.websocket import ws_manager

class CollaborationService:
    def __init__(self):
        self.active_sessions: Dict[str, Dict] = {}
    
    async def start_collaboration_session(self, project_id: str, user_id: str, session_type: str = "general"):
        """Start a collaboration session for a project"""
        session_key = f"collaboration:{project_id}"
        session_data = {
            "project_id": project_id,
            "type": session_type,
            "started_by": user_id,
            "started_at": datetime.utcnow().isoformat(),
            "active_users": [user_id],
            "last_activity": datetime.utcnow().isoformat()
        }
        
        # Store in Redis
        await redis_client.hset(session_key, "data", json.dumps(session_data))
        await redis_client.expire(session_key, 3600)  # Expire after 1 hour of inactivity
        
        # Notify all project members
        await ws_manager.broadcast_collaboration_update(project_id, {
            "type": "session_started",
            "session_type": session_type,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return session_data
    
    async def join_collaboration_session(self, project_id: str, user_id: str):
        """Join an existing collaboration session"""
        session_key = f"collaboration:{project_id}"
        session_data_json = await redis_client.hget(session_key, "data")
        
        if not session_data_json:
            # No active session, start a new one
            return await self.start_collaboration_session(project_id, user_id)
        
        session_data = json.loads(session_data_json)
        
        # Add user to active users if not already present
        if user_id not in session_data["active_users"]:
            session_data["active_users"].append(user_id)
            session_data["last_activity"] = datetime.utcnow().isoformat()
            
            # Update in Redis
            await redis_client.hset(session_key, "data", json.dumps(session_data))
            
            # Notify all project members
            await ws_manager.broadcast_collaboration_update(project_id, {
                "type": "user_joined",
                "user_id": user_id,
                "active_users": session_data["active_users"],
                "timestamp": datetime.utcnow().isoformat()
            })
        
        return session_data
    
    async def leave_collaboration_session(self, project_id: str, user_id: str):
        """Leave a collaboration session"""
        session_key = f"collaboration:{project_id}"
        session_data_json = await redis_client.hget(session_key, "data")
        
        if not session_data_json:
            return
        
        session_data = json.loads(session_data_json)
        
        # Remove user from active users
        if user_id in session_data["active_users"]:
            session_data["active_users"].remove(user_id)
            session_data["last_activity"] = datetime.utcnow().isoformat()
            
            if session_data["active_users"]:
                # Update session with remaining users
                await redis_client.hset(session_key, "data", json.dumps(session_data))
            else:
                # No users left, end session
                await redis_client.delete(session_key)
            
            # Notify all project members
            await ws_manager.broadcast_collaboration_update(project_id, {
                "type": "user_left",
                "user_id": user_id,
                "active_users": session_data["active_users"],
                "timestamp": datetime.utcnow().isoformat()
            })
    
    async def broadcast_task_update(self, project_id: str, task_id: str, user_id: str, update_data: Dict[str, Any]):
        """Broadcast a task update to all collaborators"""
        await ws_manager.broadcast_collaboration_update(project_id, {
            "type": "task_updated",
            "task_id": task_id,
            "user_id": user_id,
            "update": update_data,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Store update history in Redis
        history_key = f"task_history:{task_id}"
        history_entry = {
            "user_id": user_id,
            "update": update_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await redis_client.lpush(history_key, json.dumps(history_entry))
        await redis_client.ltrim(history_key, 0, 99)  # Keep only 100 most recent updates
    
    async def broadcast_comment(self, project_id: str, target_type: str, target_id: str, user_id: str, comment: str):
        """Broadcast a new comment to all collaborators"""
        await ws_manager.broadcast_collaboration_update(project_id, {
            "type": "comment_added",
            "target_type": target_type,  # "task", "project", etc.
            "target_id": target_id,
            "user_id": user_id,
            "comment": comment,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def broadcast_file_update(self, project_id: str, file_id: str, user_id: str, action: str, file_data: Dict[str, Any]):
        """Broadcast file updates (upload, edit, delete)"""
        await ws_manager.broadcast_collaboration_update(project_id, {
            "type": "file_updated",
            "file_id": file_id,
            "user_id": user_id,
            "action": action,  # "uploaded", "edited", "deleted"
            "file_data": file_data,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def get_active_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all active collaboration sessions for a user"""
        # In a real implementation, you'd query the database for user's projects
        # and check Redis for active sessions
        sessions = []
        
        # For now, return mock data
        # This would be replaced with actual database queries
        mock_projects = ["project_1", "project_2"]
        
        for project_id in mock_projects:
            session_key = f"collaboration:{project_id}"
            session_data_json = await redis_client.hget(session_key, "data")
            
            if session_data_json:
                session_data = json.loads(session_data_json)
                if user_id in session_data["active_users"]:
                    sessions.append(session_data)
        
        return sessions
    
    async def get_task_history(self, task_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get task update history"""
        history_key = f"task_history:{task_id}"
        history_data = await redis_client.lrange(history_key, 0, limit - 1)
        
        history = []
        for entry_json in history_data:
            try:
                entry = json.loads(entry_json)
                history.append(entry)
            except json.JSONDecodeError:
                continue
        
        return history

# Global collaboration service instance
collaboration_service = CollaborationService()