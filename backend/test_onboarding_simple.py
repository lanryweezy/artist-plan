"""
Simple test for onboarding functionality without full app dependencies.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_onboarding_data_structure():
    """Test that onboarding data has the correct structure."""
    
    # Sample onboarding data structure
    onboarding_data = {
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
    
    # Test required fields exist
    assert "userType" in onboarding_data
    assert "goals" in onboarding_data
    assert "preferences" in onboarding_data
    assert "selectedFeatures" in onboarding_data
    
    # Test user type is valid
    valid_user_types = ["solo_artist", "band", "manager", "producer", "label"]
    assert onboarding_data["userType"] in valid_user_types
    
    # Test goals is a list
    assert isinstance(onboarding_data["goals"], list)
    assert len(onboarding_data["goals"]) > 0
    
    # Test preferences structure
    prefs = onboarding_data["preferences"]
    assert "theme" in prefs
    assert "currency" in prefs
    assert "timezone" in prefs
    assert "notifications" in prefs
    assert "ai_automation_level" in prefs
    
    # Test notifications structure
    notifications = prefs["notifications"]
    required_notification_types = [
        "email", "push", "task_reminders", "project_updates", 
        "financial_alerts", "ai_suggestions"
    ]
    for notification_type in required_notification_types:
        assert notification_type in notifications
        assert isinstance(notifications[notification_type], bool)
    
    # Test selected features is a list
    assert isinstance(onboarding_data["selectedFeatures"], list)
    
    print("✓ Onboarding data structure test passed")

def test_user_preferences_update():
    """Test user preferences update logic."""
    
    # Mock existing user preferences
    existing_preferences = {
        "theme": "dark",
        "currency": "EUR",
        "timezone": "UTC",
        "notifications": {
            "email": False,
            "push": False,
            "task_reminders": False,
            "project_updates": False,
            "financial_alerts": False,
            "ai_suggestions": False
        },
        "ai_automation_level": "low",
        "onboarding_completed": False
    }
    
    # New onboarding data
    onboarding_data = {
        "userType": "band",
        "goals": ["book_performances", "increase_revenue"],
        "preferences": {
            "theme": "light",
            "currency": "USD",
            "timezone": "America/Los_Angeles",
            "notifications": {
                "email": True,
                "push": True,
                "task_reminders": True,
                "project_updates": True,
                "financial_alerts": True,
                "ai_suggestions": True
            },
            "ai_automation_level": "high"
        },
        "selectedFeatures": ["tours", "finances", "marketing"]
    }
    
    # Simulate preference update logic
    updated_preferences = existing_preferences.copy()
    updated_preferences.update(onboarding_data["preferences"])
    updated_preferences["onboarding_completed"] = True
    updated_preferences["onboarding_goals"] = onboarding_data["goals"]
    updated_preferences["selected_features"] = onboarding_data["selectedFeatures"]
    
    # Test that preferences were updated correctly
    assert updated_preferences["theme"] == "light"
    assert updated_preferences["currency"] == "USD"
    assert updated_preferences["timezone"] == "America/Los_Angeles"
    assert updated_preferences["ai_automation_level"] == "high"
    assert updated_preferences["onboarding_completed"] == True
    assert updated_preferences["onboarding_goals"] == ["book_performances", "increase_revenue"]
    assert updated_preferences["selected_features"] == ["tours", "finances", "marketing"]
    
    # Test that notifications were updated
    assert updated_preferences["notifications"]["email"] == True
    assert updated_preferences["notifications"]["push"] == True
    assert updated_preferences["notifications"]["task_reminders"] == True
    
    print("✓ User preferences update test passed")

def test_onboarding_validation():
    """Test onboarding data validation."""
    
    # Test valid data
    valid_data = {
        "userType": "producer",
        "goals": ["improve_workflow", "manage_projects"],
        "preferences": {
            "theme": "system",
            "currency": "GBP",
            "timezone": "Europe/London",
            "notifications": {
                "email": True,
                "push": False,
                "task_reminders": True,
                "project_updates": True,
                "financial_alerts": False,
                "ai_suggestions": True
            },
            "ai_automation_level": "medium"
        },
        "selectedFeatures": ["projects", "ai", "analytics"]
    }
    
    # Validation function
    def validate_onboarding_data(data):
        errors = []
        
        # Check required fields
        required_fields = ["userType", "goals", "preferences", "selectedFeatures"]
        for field in required_fields:
            if field not in data:
                errors.append(f"Missing required field: {field}")
        
        # Validate user type
        valid_user_types = ["solo_artist", "band", "manager", "producer", "label"]
        if data.get("userType") not in valid_user_types:
            errors.append(f"Invalid user type: {data.get('userType')}")
        
        # Validate goals
        if not isinstance(data.get("goals"), list) or len(data.get("goals", [])) == 0:
            errors.append("Goals must be a non-empty list")
        
        # Validate preferences
        prefs = data.get("preferences", {})
        required_pref_fields = ["theme", "currency", "timezone", "notifications", "ai_automation_level"]
        for field in required_pref_fields:
            if field not in prefs:
                errors.append(f"Missing preference field: {field}")
        
        # Validate notifications
        notifications = prefs.get("notifications", {})
        required_notification_types = [
            "email", "push", "task_reminders", "project_updates", 
            "financial_alerts", "ai_suggestions"
        ]
        for notification_type in required_notification_types:
            if notification_type not in notifications:
                errors.append(f"Missing notification setting: {notification_type}")
        
        return errors
    
    # Test valid data
    errors = validate_onboarding_data(valid_data)
    assert len(errors) == 0, f"Valid data should not have errors: {errors}"
    
    # Test invalid data
    invalid_data = {
        "userType": "invalid_type",
        "goals": [],
        "preferences": {
            "theme": "light"
            # Missing other required fields
        },
        "selectedFeatures": ["dashboard"]
    }
    
    errors = validate_onboarding_data(invalid_data)
    assert len(errors) > 0, "Invalid data should have validation errors"
    
    print("✓ Onboarding validation test passed")

def test_onboarding_step_completion():
    """Test onboarding step completion tracking."""
    
    # Mock user data at different onboarding stages
    user_no_onboarding = {
        "user_type": None,
        "preferences": {
            "onboarding_completed": False
        }
    }
    
    user_partial_onboarding = {
        "user_type": "solo_artist",
        "preferences": {
            "theme": "light",
            "currency": "USD",
            "onboarding_goals": ["release_music"],
            "onboarding_completed": False
        }
    }
    
    user_complete_onboarding = {
        "user_type": "band",
        "preferences": {
            "theme": "dark",
            "currency": "EUR",
            "timezone": "Europe/Paris",
            "onboarding_goals": ["book_performances", "grow_fanbase"],
            "selected_features": ["tours", "marketing", "analytics"],
            "onboarding_completed": True
        }
    }
    
    def get_onboarding_progress(user):
        """Calculate onboarding progress for a user."""
        completed_steps = []
        total_steps = 5
        
        # Step 1: User type
        if user.get("user_type"):
            completed_steps.append("user-type")
        
        # Step 2: Goals
        if user.get("preferences", {}).get("onboarding_goals"):
            completed_steps.append("goals")
        
        # Step 3: Preferences
        prefs = user.get("preferences", {})
        if prefs.get("theme") and prefs.get("currency") and prefs.get("timezone"):
            completed_steps.append("preferences")
        
        # Step 4: Features
        if prefs.get("selected_features"):
            completed_steps.append("features")
        
        # Step 5: Completion
        if prefs.get("onboarding_completed"):
            completed_steps.append("completion")
        
        return {
            "current_step": len(completed_steps),
            "total_steps": total_steps,
            "completed_steps": completed_steps,
            "is_complete": len(completed_steps) == total_steps
        }
    
    # Test progress tracking
    progress_none = get_onboarding_progress(user_no_onboarding)
    assert progress_none["current_step"] == 0
    assert progress_none["is_complete"] == False
    
    progress_partial = get_onboarding_progress(user_partial_onboarding)
    print(f"Partial progress: {progress_partial}")  # Debug output
    assert progress_partial["current_step"] == 2  # user_type, goals (preferences incomplete)
    assert progress_partial["is_complete"] == False
    
    progress_complete = get_onboarding_progress(user_complete_onboarding)
    assert progress_complete["current_step"] == 5
    assert progress_complete["is_complete"] == True
    
    print("✓ Onboarding step completion test passed")

if __name__ == "__main__":
    print("Running onboarding tests...")
    test_onboarding_data_structure()
    test_user_preferences_update()
    test_onboarding_validation()
    test_onboarding_step_completion()
    print("\n✅ All onboarding tests passed!")