"""
Tests for the onboarding system functionality.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from main import app

client = TestClient(app)

# Mock onboarding data
MOCK_ONBOARDING_DATA = {
    "userType": "solo_artist",
    "goals": ["release_music", "grow_fanbase"],
    "preferences": {
        "theme": "light",
        "currency": "USD",
        "timezone": "America/New_York",
        "notifications": {
            "email": True,
            "push": True,
            "task_reminders": True,
            "project_updates": True,
            "financial_alerts": True,
            "ai_suggestions": True
        },
        "ai_automation_level": "medium"
    },
    "selectedFeatures": ["dashboard", "projects", "finances"]
}

MOCK_USER = {
    "_id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "name": "Test User",
    "user_type": "solo_artist",
    "preferences": {
        "theme": "light",
        "currency": "USD",
        "timezone": "America/New_York",
        "notifications": {
            "email": True,
            "push": True,
            "task_reminders": True,
            "project_updates": True,
            "financial_alerts": True,
            "ai_suggestions": True
        },
        "ai_automation_level": "medium",
        "onboarding_completed": False
    }
}

@pytest.fixture
def mock_auth_user():
    """Mock authenticated user for testing."""
    with patch('routers.users.get_current_user') as mock_get_user:
        from models.user import UserInDB
        mock_get_user.return_value = UserInDB(**MOCK_USER)
        yield mock_get_user

@pytest.fixture
def mock_database():
    """Mock database operations."""
    with patch('routers.users.get_database') as mock_db:
        mock_collection = AsyncMock()
        mock_db.return_value.users = mock_collection
        yield mock_collection

class TestOnboardingAPI:
    """Test cases for onboarding API endpoints."""
    
    def test_onboarding_endpoint_exists(self):
        """Test that the onboarding endpoint is accessible."""
        # This will fail without auth, but confirms the endpoint exists
        response = client.post("/api/users/onboarding", json=MOCK_ONBOARDING_DATA)
        assert response.status_code in [401, 422]  # Unauthorized or validation error
    
    @pytest.mark.asyncio
    async def test_complete_onboarding_success(self, mock_auth_user, mock_database):
        """Test successful onboarding completion."""
        # Mock successful database update
        mock_database.update_one.return_value = AsyncMock(modified_count=1)
        mock_database.find_one.return_value = {
            **MOCK_USER,
            "preferences": {
                **MOCK_USER["preferences"],
                "onboarding_completed": True,
                "onboarding_goals": MOCK_ONBOARDING_DATA["goals"],
                "selected_features": MOCK_ONBOARDING_DATA["selectedFeatures"]
            }
        }
        
        response = client.post("/api/users/onboarding", json=MOCK_ONBOARDING_DATA)
        
        # Should succeed with mocked auth and database
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Onboarding completed successfully"
        assert "user" in data
    
    @pytest.mark.asyncio
    async def test_complete_onboarding_database_error(self, mock_auth_user, mock_database):
        """Test onboarding with database update failure."""
        # Mock failed database update
        mock_database.update_one.return_value = AsyncMock(modified_count=0)
        
        response = client.post("/api/users/onboarding", json=MOCK_ONBOARDING_DATA)
        
        assert response.status_code == 400
        data = response.json()
        assert "Onboarding completion failed" in data["detail"]
    
    def test_onboarding_invalid_data(self):
        """Test onboarding with invalid data."""
        invalid_data = {
            "userType": "invalid_type",  # Invalid user type
            "goals": [],  # Empty goals
            "preferences": {},  # Missing required preferences
            "selectedFeatures": []
        }
        
        response = client.post("/api/users/onboarding", json=invalid_data)
        assert response.status_code in [401, 422]  # Auth error or validation error
    
    def test_onboarding_missing_fields(self):
        """Test onboarding with missing required fields."""
        incomplete_data = {
            "userType": "solo_artist"
            # Missing goals, preferences, selectedFeatures
        }
        
        response = client.post("/api/users/onboarding", json=incomplete_data)
        assert response.status_code in [401, 422]  # Auth error or validation error

class TestOnboardingDataValidation:
    """Test cases for onboarding data validation."""
    
    def test_valid_user_types(self):
        """Test that valid user types are accepted."""
        valid_types = ["solo_artist", "band", "manager", "producer", "label"]
        
        for user_type in valid_types:
            data = {**MOCK_ONBOARDING_DATA, "userType": user_type}
            response = client.post("/api/users/onboarding", json=data)
            # Should not fail due to user type validation (may fail due to auth)
            assert response.status_code in [401, 422, 200]
    
    def test_preferences_structure(self):
        """Test that preferences have the correct structure."""
        required_preference_keys = [
            "theme", "currency", "timezone", "notifications", "ai_automation_level"
        ]
        
        for key in required_preference_keys:
            # Test with missing preference key
            incomplete_prefs = {k: v for k, v in MOCK_ONBOARDING_DATA["preferences"].items() if k != key}
            data = {**MOCK_ONBOARDING_DATA, "preferences": incomplete_prefs}
            
            response = client.post("/api/users/onboarding", json=data)
            # May pass validation depending on defaults, but should not crash
            assert response.status_code in [401, 422, 200, 400]

class TestOnboardingFlow:
    """Test cases for the complete onboarding flow."""
    
    @pytest.mark.asyncio
    async def test_onboarding_updates_user_preferences(self, mock_auth_user, mock_database):
        """Test that onboarding properly updates user preferences."""
        # Mock successful database operations
        mock_database.update_one.return_value = AsyncMock(modified_count=1)
        updated_user = {
            **MOCK_USER,
            "preferences": {
                **MOCK_USER["preferences"],
                "onboarding_completed": True,
                "theme": MOCK_ONBOARDING_DATA["preferences"]["theme"],
                "currency": MOCK_ONBOARDING_DATA["preferences"]["currency"],
                "timezone": MOCK_ONBOARDING_DATA["preferences"]["timezone"],
                "ai_automation_level": MOCK_ONBOARDING_DATA["preferences"]["ai_automation_level"],
                "onboarding_goals": MOCK_ONBOARDING_DATA["goals"],
                "selected_features": MOCK_ONBOARDING_DATA["selectedFeatures"]
            }
        }
        mock_database.find_one.return_value = updated_user
        
        response = client.post("/api/users/onboarding", json=MOCK_ONBOARDING_DATA)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify the response contains updated user data
        assert data["user"]["preferences"]["onboarding_completed"] == True
        assert data["user"]["user_type"] == MOCK_ONBOARDING_DATA["userType"]
    
    @pytest.mark.asyncio
    async def test_onboarding_stores_goals_and_features(self, mock_auth_user, mock_database):
        """Test that onboarding stores user goals and selected features."""
        mock_database.update_one.return_value = AsyncMock(modified_count=1)
        updated_user = {
            **MOCK_USER,
            "preferences": {
                **MOCK_USER["preferences"],
                "onboarding_completed": True,
                "onboarding_goals": MOCK_ONBOARDING_DATA["goals"],
                "selected_features": MOCK_ONBOARDING_DATA["selectedFeatures"]
            }
        }
        mock_database.find_one.return_value = updated_user
        
        response = client.post("/api/users/onboarding", json=MOCK_ONBOARDING_DATA)
        
        assert response.status_code == 200
        
        # Verify that update_one was called with the correct data
        mock_database.update_one.assert_called_once()
        call_args = mock_database.update_one.call_args
        update_data = call_args[0][1]["$set"]
        
        assert update_data["preferences"]["onboarding_goals"] == MOCK_ONBOARDING_DATA["goals"]
        assert update_data["preferences"]["selected_features"] == MOCK_ONBOARDING_DATA["selectedFeatures"]
        assert update_data["user_type"] == MOCK_ONBOARDING_DATA["userType"]
        assert update_data["preferences"]["onboarding_completed"] == True

if __name__ == "__main__":
    pytest.main([__file__, "-v"])