"""Integration tests for projects API endpoints"""

import pytest
from unittest.mock import AsyncMock, patch
from fastapi import status

@pytest.mark.integration
@pytest.mark.api
class TestProjectsAPI:
    """Test projects API endpoints"""

    @patch('routers.projects.get_current_user')
    async def test_get_projects_success(self, mock_get_user, client, mock_db, sample_user, sample_project):
        """Test successful retrieval of projects"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find.return_value.to_list = AsyncMock(return_value=[sample_project])
        
        response = client.get("/api/projects", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "projects" in data
        assert len(data["projects"]) == 1
        assert data["projects"][0]["name"] == "Test Album"

    @patch('routers.projects.get_current_user')
    async def test_get_projects_empty(self, mock_get_user, client, mock_db, sample_user):
        """Test retrieval of projects when none exist"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find.return_value.to_list = AsyncMock(return_value=[])
        
        response = client.get("/api/projects", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["projects"] == []

    @patch('routers.projects.get_current_user')
    async def test_create_project_success(self, mock_get_user, client, mock_db, sample_user):
        """Test successful project creation"""
        mock_get_user.return_value = sample_user
        mock_db.projects.insert_one = AsyncMock(return_value=type('obj', (object,), {'inserted_id': 'new_project_id'}))
        mock_db.projects.find_one = AsyncMock(return_value={
            "id": "new_project_id",
            "name": "New Album",
            "description": "My new album project",
            "status": "planning",
            "user_id": "user123"
        })
        
        project_data = {
            "name": "New Album",
            "description": "My new album project",
            "status": "planning",
            "priority": "medium"
        }
        
        response = client.post("/api/projects", json=project_data, headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "New Album"
        assert data["status"] == "planning"

    @patch('routers.projects.get_current_user')
    async def test_create_project_validation_error(self, mock_get_user, client, sample_user):
        """Test project creation with invalid data"""
        mock_get_user.return_value = sample_user
        
        invalid_data = {
            "name": "",  # Empty name should fail validation
            "status": "invalid_status"
        }
        
        response = client.post("/api/projects", json=invalid_data, headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @patch('routers.projects.get_current_user')
    async def test_get_project_by_id_success(self, mock_get_user, client, mock_db, sample_user, sample_project):
        """Test successful retrieval of project by ID"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find_one = AsyncMock(return_value=sample_project)
        
        response = client.get("/api/projects/project123", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == "project123"
        assert data["name"] == "Test Album"

    @patch('routers.projects.get_current_user')
    async def test_get_project_by_id_not_found(self, mock_get_user, client, mock_db, sample_user):
        """Test retrieval of non-existent project"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find_one = AsyncMock(return_value=None)
        
        response = client.get("/api/projects/nonexistent", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @patch('routers.projects.get_current_user')
    async def test_update_project_success(self, mock_get_user, client, mock_db, sample_user, sample_project):
        """Test successful project update"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find_one = AsyncMock(return_value=sample_project)
        mock_db.projects.update_one = AsyncMock(return_value=type('obj', (object,), {'modified_count': 1}))
        
        updated_project = sample_project.copy()
        updated_project["name"] = "Updated Album Name"
        mock_db.projects.find_one.side_effect = [sample_project, updated_project]
        
        update_data = {
            "name": "Updated Album Name",
            "status": "in_progress"
        }
        
        response = client.put("/api/projects/project123", json=update_data, headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Updated Album Name"

    @patch('routers.projects.get_current_user')
    async def test_delete_project_success(self, mock_get_user, client, mock_db, sample_user, sample_project):
        """Test successful project deletion"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find_one = AsyncMock(return_value=sample_project)
        mock_db.projects.delete_one = AsyncMock(return_value=type('obj', (object,), {'deleted_count': 1}))
        mock_db.tasks.delete_many = AsyncMock(return_value=type('obj', (object,), {'deleted_count': 3}))
        
        response = client.delete("/api/projects/project123", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @patch('routers.projects.get_current_user')
    async def test_get_project_tasks(self, mock_get_user, client, mock_db, sample_user, sample_project, sample_task):
        """Test retrieval of project tasks"""
        mock_get_user.return_value = sample_user
        mock_db.projects.find_one = AsyncMock(return_value=sample_project)
        mock_db.tasks.find.return_value.to_list = AsyncMock(return_value=[sample_task])
        
        response = client.get("/api/projects/project123/tasks", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "tasks" in data
        assert len(data["tasks"]) == 1
        assert data["tasks"][0]["title"] == "Record vocals"

    def test_unauthorized_access(self, client):
        """Test API access without authentication"""
        response = client.get("/api/projects")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @patch('routers.projects.get_current_user')
    async def test_forbidden_access_other_user_project(self, mock_get_user, client, mock_db, sample_user):
        """Test access to another user's project"""
        mock_get_user.return_value = sample_user
        other_user_project = {
            "id": "project456",
            "name": "Other User's Project",
            "user_id": "other_user_id"
        }
        mock_db.projects.find_one = AsyncMock(return_value=other_user_project)
        
        response = client.get("/api/projects/project456", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN