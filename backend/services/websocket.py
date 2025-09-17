"""
WebSocket service for real-time features
"""
import socketio
import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from redis_client import redis_client
from models.user import User

# Create Socket.IO server
sio = socketio.AsyncServer(
    cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    logger=True,
    engineio_logger=True
)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, List[str]] = {}  # user_id -> [session_ids]
        self.session_users: Dict[str, str] = {}  # session_id -> user_id
        
    async def connect(self, sid: str, user_id: str):
        """Connect a user session"""
        self.session_users[sid] = user_id
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(sid)
        
        # Store in Redis for persistence across server restarts
        await redis_client.hset(f"ws:user:{user_id}", sid, datetime.utcnow().isoformat())
        await redis_client.hset("ws:sessions", sid, user_id)
        
        print(f"User {user_id} connected with session {sid}")
        
    async def disconnect(self, sid: str):
        """Disconnect a user session"""
        user_id = self.session_users.get(sid)
        if not user_id:
            return
            
        # Remove from active connections
        if user_id in self.active_connections:
            self.active_connections[user_id] = [
                s for s in self.active_connections[user_id] if s != sid
            ]
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        # Remove from session mapping
        del self.session_users[sid]
        
        # Remove from Redis
        await redis_client.hdel(f"ws:user:{user_id}", sid)
        await redis_client.hdel("ws:sessions", sid)
        
        print(f"User {user_id} disconnected session {sid}")
    
    async def send_to_user(self, user_id: str, event: str, data: Any):
        """Send message to all sessions of a specific user"""
        if user_id in self.active_connections:
            for sid in self.active_connections[user_id]:
                await sio.emit(event, data, room=sid)
    
    async def send_to_all(self, event: str, data: Any):
        """Send message to all connected users"""
        await sio.emit(event, data)
    
    async def broadcast_notification(self, user_id: str, notification: Dict[str, Any]):
        """Broadcast a notification to a specific user"""
        await self.send_to_user(user_id, "notification:new", notification)
        
        # Store notification in Redis for persistence
        notification_key = f"notifications:{user_id}"
        notification_data = {
            **notification,
            "timestamp": datetime.utcnow().isoformat(),
            "id": f"{user_id}_{datetime.utcnow().timestamp()}"
        }
        await redis_client.lpush(notification_key, json.dumps(notification_data))
        await redis_client.ltrim(notification_key, 0, 99)  # Keep only 100 most recent
    
    async def broadcast_ai_suggestion(self, user_id: str, suggestion: Dict[str, Any]):
        """Broadcast an AI suggestion to a specific user"""
        await self.send_to_user(user_id, "ai:suggestion", suggestion)
    
    async def broadcast_collaboration_update(self, project_id: str, update: Dict[str, Any]):
        """Broadcast collaboration update to all project members"""
        # Get project members from database (simplified for now)
        # In real implementation, fetch from database
        await sio.emit("collaboration:update", {
            "project_id": project_id,
            **update
        }, room=f"project:{project_id}")
    
    async def join_project_room(self, sid: str, project_id: str):
        """Join a project room for collaboration"""
        await sio.enter_room(sid, f"project:{project_id}")
    
    async def leave_project_room(self, sid: str, project_id: str):
        """Leave a project room"""
        await sio.leave_room(sid, f"project:{project_id}")

# Global WebSocket manager instance
ws_manager = WebSocketManager()

@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    try:
        # Extract user_id from auth token (simplified)
        user_id = auth.get("user_id") if auth else "anonymous"
        await ws_manager.connect(sid, user_id)
        
        # Send connection confirmation
        await sio.emit("connection:confirmed", {
            "status": "connected",
            "session_id": sid,
            "timestamp": datetime.utcnow().isoformat()
        }, room=sid)
        
    except Exception as e:
        print(f"Connection error: {e}")
        await sio.disconnect(sid)

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    await ws_manager.disconnect(sid)

@sio.event
async def join_project(sid, data):
    """Join a project room for collaboration"""
    project_id = data.get("project_id")
    if project_id:
        await ws_manager.join_project_room(sid, project_id)
        await sio.emit("project:joined", {"project_id": project_id}, room=sid)

@sio.event
async def leave_project(sid, data):
    """Leave a project room"""
    project_id = data.get("project_id")
    if project_id:
        await ws_manager.leave_project_room(sid, project_id)
        await sio.emit("project:left", {"project_id": project_id}, room=sid)

@sio.event
async def collaboration_action(sid, data):
    """Handle collaboration actions (task updates, comments, etc.)"""
    action_type = data.get("type")
    project_id = data.get("project_id")
    user_id = ws_manager.session_users.get(sid)
    
    if not all([action_type, project_id, user_id]):
        return
    
    # Broadcast to all project members
    await ws_manager.broadcast_collaboration_update(project_id, {
        "type": action_type,
        "user_id": user_id,
        "data": data.get("data", {}),
        "timestamp": datetime.utcnow().isoformat()
    })

@sio.event
async def request_ai_suggestion(sid, data):
    """Handle AI suggestion requests"""
    user_id = ws_manager.session_users.get(sid)
    if not user_id:
        return
    
    # Simulate AI processing (in real implementation, call AI service)
    await asyncio.sleep(1)  # Simulate processing time
    
    suggestion = {
        "type": data.get("type", "general"),
        "title": "AI Suggestion Ready",
        "content": "Based on your recent activity, here's a suggestion...",
        "actions": [
            {"label": "Apply", "action": "apply_suggestion"},
            {"label": "Dismiss", "action": "dismiss_suggestion"}
        ]
    }
    
    await ws_manager.broadcast_ai_suggestion(user_id, suggestion)

# Export the Socket.IO app for integration with FastAPI
def get_socketio_app():
    return socketio.ASGIApp(sio)