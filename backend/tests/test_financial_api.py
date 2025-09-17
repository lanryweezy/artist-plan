"""Integration tests for financial API endpoints"""

import pytest
from unittest.mock import AsyncMock, patch
from fastapi import status
from datetime import datetime, timedelta

@pytest.mark.integration
@pytest.mark.api
class TestFinancialAPI:
    """Test financial API endpoints"""

    @patch('routers.financial.get_current_user')
    async def test_get_financial_records_success(self, mock_get_user, client, mock_db, sample_user, sample_financial_record):
        """Test successful retrieval of financial records"""
        mock_get_user.return_value = sample_user
        mock_db.financial_records.find.return_value.to_list = AsyncMock(return_value=[sample_financial_record])
        
        response = client.get("/api/financial/records", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "records" in data
        assert len(data["records"]) == 1
        assert data["records"][0]["amount"] == 1500.00
        assert data["records"][0]["type"] == "income"

    @patch('routers.financial.get_current_user')
    async def test_create_financial_record_success(self, mock_get_user, client, mock_db, sample_user):
        """Test successful financial record creation"""
        mock_get_user.return_value = sample_user
        mock_db.financial_records.insert_one = AsyncMock(return_value=type('obj', (object,), {'inserted_id': 'new_record_id'}))
        mock_db.financial_records.find_one = AsyncMock(return_value={
            "id": "new_record_id",
            "amount": 500.00,
            "type": "expense",
            "category": "equipment",
            "description": "New microphone",
            "user_id": "user123"
        })
        
        record_data = {
            "amount": 500.00,
            "type": "expense",
            "category": "equipment",
            "description": "New microphone",
            "date": "2024-01-15T00:00:00Z"
        }
        
        response = client.post("/api/financial/records", json=record_data, headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["amount"] == 500.00
        assert data["type"] == "expense"
        assert data["category"] == "equipment"

    @patch('routers.financial.get_current_user')
    async def test_get_financial_summary(self, mock_get_user, client, mock_db, sample_user):
        """Test financial summary endpoint"""
        mock_get_user.return_value = sample_user
        
        # Mock aggregation pipeline results
        income_result = [{"_id": None, "total": 5000.00}]
        expense_result = [{"_id": None, "total": 2000.00}]
        
        mock_db.financial_records.aggregate.side_effect = [
            AsyncMock(return_value=type('cursor', (), {'to_list': AsyncMock(return_value=income_result)})),
            AsyncMock(return_value=type('cursor', (), {'to_list': AsyncMock(return_value=expense_result)}))
        ]
        
        response = client.get("/api/financial/summary", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_income" in data
        assert "total_expenses" in data
        assert "net_income" in data
        assert data["total_income"] == 5000.00
        assert data["total_expenses"] == 2000.00
        assert data["net_income"] == 3000.00

    @patch('routers.financial.get_current_user')
    async def test_get_financial_records_with_filters(self, mock_get_user, client, mock_db, sample_user):
        """Test financial records with date and type filters"""
        mock_get_user.return_value = sample_user
        mock_db.financial_records.find.return_value.to_list = AsyncMock(return_value=[])
        
        # Test with date range filter
        start_date = "2024-01-01"
        end_date = "2024-01-31"
        response = client.get(
            f"/api/financial/records?start_date={start_date}&end_date={end_date}",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        # Test with type filter
        response = client.get(
            "/api/financial/records?type=income",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == status.HTTP_200_OK

    @patch('routers.financial.get_current_user')
    async def test_update_financial_record(self, mock_get_user, client, mock_db, sample_user, sample_financial_record):
        """Test updating a financial record"""
        mock_get_user.return_value = sample_user
        mock_db.financial_records.find_one = AsyncMock(return_value=sample_financial_record)
        mock_db.financial_records.update_one = AsyncMock(return_value=type('obj', (object,), {'modified_count': 1}))
        
        updated_record = sample_financial_record.copy()
        updated_record["amount"] = 1800.00
        mock_db.financial_records.find_one.side_effect = [sample_financial_record, updated_record]
        
        update_data = {
            "amount": 1800.00,
            "description": "Updated Spotify royalties"
        }
        
        response = client.put(
            "/api/financial/records/financial123",
            json=update_data,
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["amount"] == 1800.00

    @patch('routers.financial.get_current_user')
    async def test_delete_financial_record(self, mock_get_user, client, mock_db, sample_user, sample_financial_record):
        """Test deleting a financial record"""
        mock_get_user.return_value = sample_user
        mock_db.financial_records.find_one = AsyncMock(return_value=sample_financial_record)
        mock_db.financial_records.delete_one = AsyncMock(return_value=type('obj', (object,), {'deleted_count': 1}))
        
        response = client.delete(
            "/api/financial/records/financial123",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @patch('routers.financial.get_current_user')
    async def test_get_categories(self, mock_get_user, client, mock_db, sample_user):
        """Test getting financial categories"""
        mock_get_user.return_value = sample_user
        
        categories_result = [
            {"_id": "streaming", "count": 5},
            {"_id": "equipment", "count": 3},
            {"_id": "marketing", "count": 2}
        ]
        
        mock_db.financial_records.aggregate.return_value.to_list = AsyncMock(return_value=categories_result)
        
        response = client.get("/api/financial/categories", headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "categories" in data
        assert len(data["categories"]) == 3

    @patch('routers.financial.get_current_user')
    async def test_create_budget(self, mock_get_user, client, mock_db, sample_user):
        """Test creating a budget"""
        mock_get_user.return_value = sample_user
        mock_db.budgets.insert_one = AsyncMock(return_value=type('obj', (object,), {'inserted_id': 'budget123'}))
        mock_db.budgets.find_one = AsyncMock(return_value={
            "id": "budget123",
            "name": "Q1 Marketing Budget",
            "amount": 2000.00,
            "category": "marketing",
            "period": "quarterly",
            "user_id": "user123"
        })
        
        budget_data = {
            "name": "Q1 Marketing Budget",
            "amount": 2000.00,
            "category": "marketing",
            "period": "quarterly"
        }
        
        response = client.post("/api/financial/budgets", json=budget_data, headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Q1 Marketing Budget"
        assert data["amount"] == 2000.00

    @patch('routers.financial.get_current_user')
    async def test_invalid_financial_record_data(self, mock_get_user, client, sample_user):
        """Test creating financial record with invalid data"""
        mock_get_user.return_value = sample_user
        
        invalid_data = {
            "amount": -100,  # Negative amount should fail
            "type": "invalid_type",  # Invalid type
            "category": ""  # Empty category
        }
        
        response = client.post("/api/financial/records", json=invalid_data, headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_financial_unauthorized_access(self, client):
        """Test financial API access without authentication"""
        response = client.get("/api/financial/records")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED