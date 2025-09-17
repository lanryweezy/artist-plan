"""Pytest configuration and fixtures"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from unittest.mock import AsyncMock, MagicMock
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from main import app
from database import get_database
from redis_client import get_redis_client

# Test database configuration
TEST_DATABASE_URL = "mongodb://localhost:27017/artist_plan_test"
TEST_REDIS_URL = "redis://localhost:6379/1"

@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def mock_db():
    """Mock database for testing"""
    mock_db = AsyncMock()
    mock_db.users = AsyncMock()
    mock_db.projects = AsyncMock()
    mock_db.tasks = AsyncMock()
    mock_db.financial_records = AsyncMock()
    mock_db.integrations = AsyncMock()
    mock_db.ai_suggestions = AsyncMock()
    return mock_db

@pytest.fixture
def mock_redis():
    """Mock Redis client for testing"""
    mock_redis = MagicMock()
    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.set = AsyncMock(return_value=True)
    mock_redis.delete = AsyncMock(return_value=1)
    mock_redis.exists = AsyncMock(return_value=False)
    return mock_redis

@pytest.fixture
def client(mock_db, mock_redis):
    """Test client with mocked dependencies"""
    
    def override_get_database():
        return mock_db
    
    def override_get_redis_client():
        return mock_redis
    
    app.dependency_overrides[get_database] = override_get_database
    app.dependency_overrides[get_redis_client] = override_get_redis_client
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up overrides
    app.dependency_overrides.clear()

@pytest.fixture
def sample_user():
    """Sample user data for testing"""
    return {
        "id": "user123",
        "email": "test@example.com",
        "name": "Test User",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "secret"
        "subscription": "free",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def sample_project():
    """Sample project data for testing"""
    return {
        "id": "project123",
        "name": "Test Album",
        "description": "Test album project",
        "status": "active",
        "priority": "high",
        "progress": 25,
        "user_id": "user123",
        "due_date": "2024-12-31T23:59:59Z",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def sample_task():
    """Sample task data for testing"""
    return {
        "id": "task123",
        "title": "Record vocals",
        "description": "Record lead vocals for track 1",
        "status": "pending",
        "priority": "high",
        "project_id": "project123",
        "user_id": "user123",
        "due_date": "2024-06-15T00:00:00Z",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def sample_financial_record():
    """Sample financial record for testing"""
    return {
        "id": "financial123",
        "amount": 1500.00,
        "type": "income",
        "category": "streaming",
        "description": "Spotify royalties",
        "user_id": "user123",
        "date": "2024-01-15T00:00:00Z",
        "created_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def auth_headers():
    """Authentication headers for testing"""
    # This would normally contain a valid JWT token
    return {"Authorization": "Bearer test_token"}

@pytest.fixture
def mock_jwt_decode():
    """Mock JWT decode for testing"""
    return {
        "sub": "user123",
        "email": "test@example.com",
        "exp": 9999999999  # Far future expiration
    }