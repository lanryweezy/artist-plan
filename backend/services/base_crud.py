from typing import Generic, TypeVar, Type, Optional, List, Dict, Any
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException, status

from database import get_database
from models.base import BaseDocument

ModelType = TypeVar("ModelType", bound=BaseDocument)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseCRUDService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base CRUD service for all entities"""
    
    def __init__(self, model: Type[ModelType], collection_name: str):
        self.model = model
        self.collection_name = collection_name
    
    @property
    def collection(self) -> AsyncIOMotorCollection:
        """Get the MongoDB collection"""
        db = get_database()
        return db[self.collection_name]
    
    async def create(self, obj_in: CreateSchemaType, user_id: Optional[str] = None) -> ModelType:
        """Create a new document"""
        try:
            obj_data = obj_in.model_dump()
            if user_id:
                obj_data["user_id"] = ObjectId(user_id)
            
            obj_data["created_at"] = datetime.utcnow()
            obj_data["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(obj_data)
            
            # Retrieve the created document
            created_doc = await self.collection.find_one({"_id": result.inserted_id})
            if not created_doc:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create document"
                )
            
            return self.model(**created_doc)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating document: {str(e)}"
            )
    
    async def get(self, id: str, user_id: Optional[str] = None) -> Optional[ModelType]:
        """Get a document by ID"""
        try:
            if not ObjectId.is_valid(id):
                return None
            
            query = {"_id": ObjectId(id)}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            doc = await self.collection.find_one(query)
            if doc:
                return self.model(**doc)
            return None
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving document: {str(e)}"
            )
    
    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        user_id: Optional[str] = None,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[ModelType]:
        """Get multiple documents with pagination"""
        try:
            query = {}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            if filters:
                query.update(filters)
            
            cursor = self.collection.find(query).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [self.model(**doc) for doc in docs]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving documents: {str(e)}"
            )
    
    async def update(
        self, 
        id: str, 
        obj_in: UpdateSchemaType, 
        user_id: Optional[str] = None
    ) -> Optional[ModelType]:
        """Update a document"""
        try:
            if not ObjectId.is_valid(id):
                return None
            
            query = {"_id": ObjectId(id)}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            # Get current document to check if it exists
            existing_doc = await self.collection.find_one(query)
            if not existing_doc:
                return None
            
            # Prepare update data
            update_data = obj_in.model_dump(exclude_unset=True)
            update_data["updated_at"] = datetime.utcnow()
            
            # Update document
            result = await self.collection.update_one(
                query,
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                return None
            
            # Return updated document
            updated_doc = await self.collection.find_one(query)
            if updated_doc:
                return self.model(**updated_doc)
            return None
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating document: {str(e)}"
            )
    
    async def delete(self, id: str, user_id: Optional[str] = None) -> bool:
        """Delete a document (hard delete)"""
        try:
            if not ObjectId.is_valid(id):
                return False
            
            query = {"_id": ObjectId(id)}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            result = await self.collection.delete_one(query)
            return result.deleted_count > 0
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting document: {str(e)}"
            )
    
    async def soft_delete(self, id: str, user_id: Optional[str] = None) -> bool:
        """Soft delete a document by setting is_deleted flag"""
        try:
            if not ObjectId.is_valid(id):
                return False
            
            query = {"_id": ObjectId(id)}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            result = await self.collection.update_one(
                query,
                {
                    "$set": {
                        "is_deleted": True,
                        "deleted_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error soft deleting document: {str(e)}"
            )
    
    async def count(self, user_id: Optional[str] = None, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count documents"""
        try:
            query = {}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            if filters:
                query.update(filters)
            
            return await self.collection.count_documents(query)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting documents: {str(e)}"
            )
    
    async def exists(self, id: str, user_id: Optional[str] = None) -> bool:
        """Check if document exists"""
        try:
            if not ObjectId.is_valid(id):
                return False
            
            query = {"_id": ObjectId(id)}
            if user_id:
                query["user_id"] = ObjectId(user_id)
            
            doc = await self.collection.find_one(query, {"_id": 1})
            return doc is not None
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error checking document existence: {str(e)}"
            )