import redis.asyncio as redis
import json
import os
from typing import Optional, Any
from datetime import timedelta

class RedisClient:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.client: Optional[redis.Redis] = None
    
    async def connect(self):
        """Connect to Redis"""
        self.client = redis.from_url(
            self.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
        
        # Test connection
        try:
            await self.client.ping()
            print("Successfully connected to Redis!")
        except Exception as e:
            print(f"Error connecting to Redis: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.client:
            await self.client.close()
    
    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        """Set a key-value pair with optional expiration"""
        if not self.client:
            raise RuntimeError("Redis client not connected")
        
        serialized_value = json.dumps(value) if not isinstance(value, str) else value
        await self.client.set(key, serialized_value, ex=expire)
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value by key"""
        if not self.client:
            raise RuntimeError("Redis client not connected")
        
        value = await self.client.get(key)
        if value is None:
            return None
        
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    
    async def delete(self, key: str):
        """Delete a key"""
        if not self.client:
            raise RuntimeError("Redis client not connected")
        
        await self.client.delete(key)
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.client:
            raise RuntimeError("Redis client not connected")
        
        return bool(await self.client.exists(key))
    
    async def set_session(self, session_id: str, user_data: dict, expire_hours: int = 24):
        """Set session data"""
        expire_seconds = expire_hours * 3600
        await self.set(f"session:{session_id}", user_data, expire_seconds)
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        """Get session data"""
        return await self.get(f"session:{session_id}")
    
    async def delete_session(self, session_id: str):
        """Delete session"""
        await self.delete(f"session:{session_id}")
    
    async def cache_user_data(self, user_id: str, data: dict, expire_minutes: int = 30):
        """Cache user data"""
        expire_seconds = expire_minutes * 60
        await self.set(f"user:{user_id}", data, expire_seconds)
    
    async def get_cached_user_data(self, user_id: str) -> Optional[dict]:
        """Get cached user data"""
        return await self.get(f"user:{user_id}")

# Global Redis client instance
redis_client = RedisClient()