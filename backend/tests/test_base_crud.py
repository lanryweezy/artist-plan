import pytest
import asyncio
from datetime import datetime
from bson import ObjectId

from services.base_crud import BaseCRUDService
from models.base import BaseDocument
from pydantic import BaseModel

# Test models
class TestDocument(BaseDocument):
    name: str
    description: str = ""
    user_id: ObjectId

class TestCreate(BaseModel):
    name: str
    description: str = ""

class TestUpdate(BaseModel):
    name: str = None
    description: str = None

class TestCRUDService(BaseCRUDService[TestDocument, TestCreate, TestUpdate]):
    def __init__(self):
        super().__init__(TestDocument, "test_documents")

@pytest.fixture
def test_service():
    return TestCRUDService()

@pytest.fixture
def test_user_id():
    return str(ObjectId())

@pytest.fixture
def test_create_data():
    return TestCreate(
        name="Test Document",
        description="Test description"
    )

@pytest.mark.asyncio
async def test_create_document(test_service, test_create_data, test_user_id):
    """Test creating a document"""
    # This would require a test database setup
    # For now, we'll test the service structure
    assert test_service.model == TestDocument
    assert test_service.collection_name == "test_documents"

@pytest.mark.asyncio
async def test_get_document(test_service, test_user_id):
    """Test getting a document by ID"""
    # Test with invalid ObjectId
    result = await test_service.get("invalid_id", test_user_id)
    assert result is None

@pytest.mark.asyncio
async def test_validation():
    """Test model validation"""
    # Test valid data
    valid_data = {
        "_id": ObjectId(),
        "name": "Test",
        "description": "Test description",
        "user_id": ObjectId(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    doc = TestDocument(**valid_data)
    assert doc.name == "Test"
    assert doc.description == "Test description"

def test_service_initialization():
    """Test service initialization"""
    service = TestCRUDService()
    assert service.model == TestDocument
    assert service.collection_name == "test_documents"