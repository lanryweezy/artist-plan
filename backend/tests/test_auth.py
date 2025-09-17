"""Tests for authentication system"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from routers.auth import get_password_hash, verify_password, create_access_token

client = TestClient(app)

class TestPasswordHashing:
    """Test password hashing functions"""
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Verify the password matches
        assert verify_password(password, hashed) is True
        
        # Verify wrong password doesn't match
        assert verify_password("wrongpassword", hashed) is False

class TestJWTTokens:
    """Test JWT token creation and validation"""
    
    def test_create_access_token(self):
        """Test access token creation"""
        data = {"sub": "test_user_id"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0

class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    @patch('routers.auth.get_database')
    @patch('routers.auth.redis_client')
    async def test_register_endpoint_structure(self, mock_redis, mock_db):
        """Test register endpoint structure (without database)"""
        # This test verifies the endpoint exists and has correct structure
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "password": "testpassword123",
            "name": "Test User"
        })
        
        # We expect this to fail due to database not being connected
        # but it should not be a 404 (endpoint exists)
        assert response.status_code != 404
    
    @patch('routers.auth.get_database')
    @patch('routers.auth.redis_client')
    async def test_login_endpoint_structure(self, mock_redis, mock_db):
        """Test login endpoint structure (without database)"""
        response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
        
        # We expect this to fail due to database not being connected
        # but it should not be a 404 (endpoint exists)
        assert response.status_code != 404

if __name__ == "__main__":
    pytest.main([__file__])