"""
Live notification service
"""
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from enum import Enum
import json
from redis_client import redis_client
from services.websocket import ws_manager

class NotificationType(str, Enum):
    SUCCESS = "success"
    WARNING = "warning"
    INFO = "info"
    ERROR = "error"
    FINANCIAL = "financial"
    TASK = "task"
    PROJECT = "project"
    AI = "ai"
    COLLABORATION = "collaboration"

class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class NotificationService:
    def __init__(self):
        self.notification_templates = {
            "task_completed": {
                "type": NotificationType.SUCCESS,
                "title": "Task Completed",
                "template": "{task_name} has been completed for {project_name}"
            },
            "task_overdue": {
                "type": NotificationType.WARNING,
                "title": "Task Overdue",
                "template": "{task_name} is overdue by {days} days"
            },
            "payment_received": {
                "type": NotificationType.FINANCIAL,
                "title": "Payment Received",
                "template": "Received ${amount} from {source}"
            },
            "budget_exceeded": {
                "type": NotificationType.WARNING,
                "title": "Budget Alert",
                "template": "{project_name} budget exceeded by ${amount}"
            },
            "ai_suggestion": {
                "type": NotificationType.AI,
                "title": "AI Suggestion",
                "template": "New {suggestion_type} suggestion available"
            },
            "collaboration_invite": {
                "type": NotificationType.COLLABORATION,
                "title": "Collaboration Invite",
                "template": "{user_name} invited you to collaborate on {project_name}"
            }
        }
    
    async def send_notification(
        self,
        user_id: str,
        notification_type: str,
        data: Dict[str, Any],
        priority: NotificationPriority = NotificationPriority.MEDIUM,
        actionable: bool = False,
        action: Optional[Dict[str, str]] = None
    ):
        """Send a notification to a user"""
        template = self.notification_templates.get(notification_type)
        if not template:
            # Generic notification
            notification = {
                "type": data.get("type", NotificationType.INFO),
                "title": data.get("title", "Notification"),
                "message": data.get("message", ""),
                "priority": priority,
                "actionable": actionable,
                "action": action
            }
        else:
            # Template-based notification
            message = template["template"].format(**data)
            notification = {
                "type": template["type"],
                "title": template["title"],
                "message": message,
                "priority": priority,
                "actionable": actionable,
                "action": action
            }
        
        # Add metadata
        notification.update({
            "id": f"{user_id}_{datetime.utcnow().timestamp()}",
            "timestamp": datetime.utcnow().isoformat(),
            "read": False,
            "user_id": user_id
        })
        
        # Send via WebSocket
        await ws_manager.broadcast_notification(user_id, notification)
        
        # Store in database/Redis for persistence
        await self._store_notification(user_id, notification)
        
        return notification
    
    async def _store_notification(self, user_id: str, notification: Dict[str, Any]):
        """Store notification for persistence"""
        notification_key = f"notifications:{user_id}"
        await redis_client.lpush(notification_key, json.dumps(notification))
        await redis_client.ltrim(notification_key, 0, 199)  # Keep only 200 most recent
        
        # Set expiration for cleanup
        await redis_client.expire(notification_key, 86400 * 30)  # 30 days
    
    async def get_notifications(
        self,
        user_id: str,
        limit: int = 50,
        unread_only: bool = False
    ) -> List[Dict[str, Any]]:
        """Get user notifications"""
        notification_key = f"notifications:{user_id}"
        notifications_data = await redis_client.lrange(notification_key, 0, limit - 1)
        
        notifications = []
        for notification_json in notifications_data:
            try:
                notification = json.loads(notification_json)
                if unread_only and notification.get("read", False):
                    continue
                notifications.append(notification)
            except json.JSONDecodeError:
                continue
        
        return notifications
    
    async def mark_as_read(self, user_id: str, notification_id: str):
        """Mark a notification as read"""
        notification_key = f"notifications:{user_id}"
        notifications_data = await redis_client.lrange(notification_key, 0, -1)
        
        updated_notifications = []
        for notification_json in notifications_data:
            try:
                notification = json.loads(notification_json)
                if notification.get("id") == notification_id:
                    notification["read"] = True
                updated_notifications.append(json.dumps(notification))
            except json.JSONDecodeError:
                updated_notifications.append(notification_json)
        
        # Replace the list
        if updated_notifications:
            await redis_client.delete(notification_key)
            await redis_client.lpush(notification_key, *updated_notifications)
    
    async def mark_all_as_read(self, user_id: str):
        """Mark all notifications as read for a user"""
        notification_key = f"notifications:{user_id}"
        notifications_data = await redis_client.lrange(notification_key, 0, -1)
        
        updated_notifications = []
        for notification_json in notifications_data:
            try:
                notification = json.loads(notification_json)
                notification["read"] = True
                updated_notifications.append(json.dumps(notification))
            except json.JSONDecodeError:
                updated_notifications.append(notification_json)
        
        # Replace the list
        if updated_notifications:
            await redis_client.delete(notification_key)
            await redis_client.lpush(notification_key, *updated_notifications)
    
    async def delete_notification(self, user_id: str, notification_id: str):
        """Delete a specific notification"""
        notification_key = f"notifications:{user_id}"
        notifications_data = await redis_client.lrange(notification_key, 0, -1)
        
        filtered_notifications = []
        for notification_json in notifications_data:
            try:
                notification = json.loads(notification_json)
                if notification.get("id") != notification_id:
                    filtered_notifications.append(notification_json)
            except json.JSONDecodeError:
                filtered_notifications.append(notification_json)
        
        # Replace the list
        await redis_client.delete(notification_key)
        if filtered_notifications:
            await redis_client.lpush(notification_key, *filtered_notifications)
    
    async def send_bulk_notification(
        self,
        user_ids: List[str],
        notification_type: str,
        data: Dict[str, Any],
        priority: NotificationPriority = NotificationPriority.MEDIUM
    ):
        """Send notification to multiple users"""
        for user_id in user_ids:
            await self.send_notification(user_id, notification_type, data, priority)
    
    async def schedule_notification(
        self,
        user_id: str,
        notification_type: str,
        data: Dict[str, Any],
        send_at: datetime,
        priority: NotificationPriority = NotificationPriority.MEDIUM
    ):
        """Schedule a notification to be sent later"""
        scheduled_notification = {
            "user_id": user_id,
            "notification_type": notification_type,
            "data": data,
            "priority": priority,
            "send_at": send_at.isoformat()
        }
        
        # Store in Redis with expiration
        schedule_key = f"scheduled_notifications:{send_at.timestamp()}"
        await redis_client.set(
            schedule_key,
            json.dumps(scheduled_notification),
            ex=int((send_at - datetime.utcnow()).total_seconds()) + 3600  # Extra hour buffer
        )
    
    async def send_system_notification(
        self,
        message: str,
        notification_type: NotificationType = NotificationType.INFO,
        target_users: Optional[List[str]] = None
    ):
        """Send system-wide notification"""
        notification = {
            "type": notification_type,
            "title": "System Notification",
            "message": message,
            "priority": NotificationPriority.HIGH,
            "actionable": False,
            "system": True
        }
        
        if target_users:
            for user_id in target_users:
                await ws_manager.broadcast_notification(user_id, notification)
        else:
            # Broadcast to all connected users
            await ws_manager.send_to_all("notification:system", notification)

# Global notification service instance
notification_service = NotificationService()