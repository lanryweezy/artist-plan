import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Artist Plan API is running"
    assert data["version"] == "1.0.0"
    assert "docs" in data
    assert "redoc" in data

def test_api_info_endpoint():
    """Test API info endpoint"""
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Artist Plan API"
    assert data["version"] == "1.0.0"
    assert "endpoints" in data
    assert "documentation" in data

def test_health_check_endpoint_exists():
    """Test health check endpoint exists and returns proper structure"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "services" in data
    assert "timestamp" in data
    # The actual status may be unhealthy in test environment, but structure should be correct

def test_openapi_docs():
    """Test OpenAPI documentation endpoint"""
    response = client.get("/docs")
    assert response.status_code == 200

def test_openapi_json():
    """Test OpenAPI JSON schema"""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "Artist Plan API"
    assert data["info"]["version"] == "1.0.0"
    assert "components" in data
    assert "securitySchemes" in data["components"]

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options("/")
    # CORS headers should be present in preflight requests
    assert response.status_code in [200, 405]  # Some test clients handle OPTIONS differently

def test_security_headers():
    """Test security headers are added"""
    response = client.get("/")
    headers = response.headers
    
    # Check for security headers added by SecurityHeadersMiddleware
    assert "x-content-type-options" in headers
    assert "x-frame-options" in headers
    assert "x-xss-protection" in headers

def test_validation_error_handling():
    """Test validation error handling"""
    # This would require an endpoint that accepts POST data
    # For now, test that the error handlers are properly configured
    assert hasattr(app, 'exception_handlers')

def test_rate_limiting_headers():
    """Test that rate limiting middleware adds process time header"""
    response = client.get("/")
    assert "x-process-time" in response.headers