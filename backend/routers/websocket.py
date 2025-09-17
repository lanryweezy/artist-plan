"""
WebSocket router for real-time API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from datetime import datetime
import json

from services.websocket import ws_manager
from redis_client import redis_client
from models.user import User
from routers.auth import get_current_user

router = APIRouter()

@router.post("/notifications/send")
async def send_notification(
    notification_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Send a notification to a specific user"""
    target_user_id = notification_data.get("user_id", current_user.id)
    
    notification = {
        "type": notification_data.get("type", "info"),
        "title": notification_data.get("title", "Notification"),
        "message": notification_data.get("message", ""),
        "actionable": notification_data.get("actionable", False),
        "action": notification_data.get("action")
    }
    
    await ws_manager.broadcast_notification(target_user_id, notification)
    
    return {"status": "sent", "notification": notification}

@router.get("/notifications")
async def get_notifications(
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get user's recent notifications"""
    notification_key = f"notifications:{current_user.id}"
    
    # Get notifications from Redis
    notifications_data = await redis_client.lrange(notification_key, 0, limit - 1)
    
    notifications = []
    for notification_json in notifications_data:
        try:
            notification = json.loads(notification_json)
            notifications.append(notification)
        except json.JSONDecodeError:
            continue
    
    return {"notifications": notifications}

@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read"""
    # In a real implementation, you'd update the notification status
    # For now, we'll just acknowledge the request
    return {"status": "marked_as_read", "notification_id": notification_id}

@router.post("/ai/suggest")
async def trigger_ai_suggestion(
    suggestion_request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Trigger an AI suggestion for the user"""
    suggestion_type = suggestion_request.get("type", "general")
    context = suggestion_request.get("context", {})
    
    # Simulate AI processing and send suggestion via WebSocket
    suggestion = {
        "type": suggestion_type,
        "title": f"AI {suggestion_type.title()} Suggestion",
        "content": f"Based on your {suggestion_type} data, here's what I recommend...",
        "confidence": 0.85,
        "actions": [
            {
                "id": "apply",
                "label": "Apply Suggestion",
                "type": "primary"
            },
            {
                "id": "dismiss", 
                "label": "Dismiss",
                "type": "secondary"
            }
        ],
        "context": context
    }
    
    await ws_manager.broadcast_ai_suggestion(current_user.id, suggestion)
    
    return {"status": "suggestion_sent", "type": suggestion_type}

@router.get("/collaboration/active")
async def get_active_collaborations(
    current_user: User = Depends(get_current_user)
):
    """Get active collaboration sessions for the user"""
    # In a real implementation, fetch from database
    # For now, return mock data
    return {
        "active_sessions": [
            {
                "project_id": "project_1",
                "project_name": "Winter EP Release",
                "active_users": ["user_1", "user_2"],
                "last_activity": datetime.utcnow().isoformat()
            }
        ]
    }

@router.post("/collaboration/broadcast")
async def broadcast_collaboration_update(
    update_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Broadcast a collaboration update to project members"""
    project_id = update_data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required")
    
    update = {
        "type": update_data.get("type", "general"),
        "user_id": current_user.id,
        "user_name": current_user.name,
        "data": update_data.get("data", {}),
        "timestamp": datetime.utcnow().isoformat()
    }
    
    await ws_manager.broadcast_collaboration_update(project_id, update)
    
    return {"status": "broadcasted", "project_id": project_id}

@router.get("/status")
async def websocket_status():
    """Get WebSocket service status"""
    active_connections = len(ws_manager.session_users)
    active_users = len(ws_manager.active_connections)
    
    return {
        "status": "active",
        "active_connections": active_connections,
        "active_users": active_users,
        "timestamp": datetime.utcnow().isoformat()
    }