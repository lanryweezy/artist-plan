from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..models.content import (
    Content, ContentCreate, ContentUpdate, ContentInDB,
    ContentCollection, ContentCollectionCreate, ContentCollectionUpdate, ContentCollectionInDB,
    ContentVersion, ContentMetadata, ContentType
)
from ..models.base import PyObjectId
from .base_crud import BaseCRUDService
import hashlib
import mimetypes
import os

class ContentService(BaseCRUDService[ContentInDB, ContentCreate, ContentUpdate]):
    def __init__(self, database: AsyncIOMotorDatabase):
        super().__init__(database, "content", ContentInDB)
        self.collections_collection = database["content_collections"]
    
    async def create_content(self, content_data: ContentCreate, owner_id: PyObjectId, file_content: bytes = None) -> ContentInDB:
        """Create new content item with version tracking"""
        # Generate checksum if file content provided
        checksum = hashlib.sha256(file_content).hexdigest() if file_content else ""
        
        # Create initial version
        initial_version = ContentVersion(
            version_number=1,
            file_url=content_data.file_url,
            file_size=content_data.file_size,
            mime_type=content_data.mime_type,
            checksum=checksum,
            created_by=owner_id,
            change_notes="Initial upload"
        )
        
        # Extract metadata based on content type
        metadata = await self._extract_metadata(content_data.mime_type, file_content)
        
        content_doc = ContentInDB(
            **content_data.dict(),
            owner_id=owner_id,
            current_version=1,
            versions=[initial_version],
            metadata=metadata,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        result = await self.collection.insert_one(content_doc.dict(by_alias=True))
        content_doc.id = result.inserted_id
        return content_doc
    
    async def add_version(self, content_id: PyObjectId, file_url: str, file_size: int, 
                         mime_type: str, created_by: PyObjectId, change_notes: str = None,
                         file_content: bytes = None) -> ContentInDB:
        """Add new version to existing content"""
        content = await self.get_by_id(content_id)
        if not content:
            raise ValueError("Content not found")
        
        checksum = hashlib.sha256(file_content).hexdigest() if file_content else ""
        new_version_number = content.current_version + 1
        
        new_version = ContentVersion(
            version_number=new_version_number,
            file_url=file_url,
            file_size=file_size,
            mime_type=mime_type,
            checksum=checksum,
            created_by=created_by,
            change_notes=change_notes
        )
        
        # Update metadata if file content provided
        metadata = await self._extract_metadata(mime_type, file_content) if file_content else content.metadata
        
        update_data = {
            "$push": {"versions": new_version.dict()},
            "$set": {
                "current_version": new_version_number,
                "metadata": metadata.dict() if metadata else None,
                "updated_at": datetime.utcnow()
            }
        }
        
        await self.collection.update_one({"_id": content_id}, update_data)
        return await self.get_by_id(content_id)
    
    async def search_content(self, owner_id: PyObjectId, query: str = None, 
                           content_type: ContentType = None, tags: List[str] = None,
                           categories: List[str] = None, project_id: PyObjectId = None,
                           limit: int = 50, skip: int = 0) -> List[ContentInDB]:
        """Search content with filters"""
        filter_query = {"owner_id": owner_id}
        
        if query:
            filter_query["$or"] = [
                {"title": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}},
                {"ai_description": {"$regex": query, "$options": "i"}}
            ]
        
        if content_type:
            filter_query["type"] = content_type
        
        if tags:
            filter_query["tags"] = {"$in": tags}
        
        if categories:
            filter_query["categories"] = {"$in": categories}
        
        if project_id:
            filter_query["project_id"] = project_id
        
        cursor = self.collection.find(filter_query).skip(skip).limit(limit).sort("updated_at", -1)
        results = await cursor.to_list(length=limit)
        return [ContentInDB(**doc) for doc in results]
    
    async def get_content_by_tags(self, owner_id: PyObjectId, tags: List[str]) -> List[ContentInDB]:
        """Get content by specific tags"""
        filter_query = {
            "owner_id": owner_id,
            "tags": {"$in": tags}
        }
        
        cursor = self.collection.find(filter_query).sort("updated_at", -1)
        results = await cursor.to_list(length=None)
        return [ContentInDB(**doc) for doc in results]
    
    async def get_all_tags(self, owner_id: PyObjectId) -> List[str]:
        """Get all unique tags for user's content"""
        pipeline = [
            {"$match": {"owner_id": owner_id}},
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags"}},
            {"$sort": {"_id": 1}}
        ]
        
        results = await self.collection.aggregate(pipeline).to_list(length=None)
        return [result["_id"] for result in results]
    
    async def get_all_categories(self, owner_id: PyObjectId) -> List[str]:
        """Get all unique categories for user's content"""
        pipeline = [
            {"$match": {"owner_id": owner_id}},
            {"$unwind": "$categories"},
            {"$group": {"_id": "$categories"}},
            {"$sort": {"_id": 1}}
        ]
        
        results = await self.collection.aggregate(pipeline).to_list(length=None)
        return [result["_id"] for result in results]
    
    async def update_content_tags(self, content_id: PyObjectId, tags: List[str]) -> ContentInDB:
        """Update content tags"""
        await self.collection.update_one(
            {"_id": content_id},
            {"$set": {"tags": tags, "updated_at": datetime.utcnow()}}
        )
        return await self.get_by_id(content_id)
    
    async def increment_view_count(self, content_id: PyObjectId) -> None:
        """Increment view count for content"""
        await self.collection.update_one(
            {"_id": content_id},
            {
                "$inc": {"view_count": 1},
                "$set": {"last_accessed": datetime.utcnow()}
            }
        )
    
    async def increment_download_count(self, content_id: PyObjectId) -> None:
        """Increment download count for content"""
        await self.collection.update_one(
            {"_id": content_id},
            {
                "$inc": {"download_count": 1},
                "$set": {"last_accessed": datetime.utcnow()}
            }
        )
    
    async def _extract_metadata(self, mime_type: str, file_content: bytes = None) -> Optional[ContentMetadata]:
        """Extract metadata from file content based on MIME type"""
        if not file_content:
            return None
        
        metadata = ContentMetadata()
        
        # Basic file info
        metadata.format_info = {"mime_type": mime_type}
        
        # Extract metadata for different file types (audio, video, image)
        # This would require additional libraries like:
        # - mutagen for audio metadata
        # - Pillow for image metadata
        # - ffprobe for video metadata
        
        if mime_type.startswith("image/"):
            # Image metadata extraction would go here
            pass
        elif mime_type.startswith("audio/"):
            # Audio metadata extraction would go here
            pass
        elif mime_type.startswith("video/"):
            # Video metadata extraction would go here
            pass
        
        return metadata

class ContentCollectionService(BaseCRUDService[ContentCollectionInDB, ContentCollectionCreate, ContentCollectionUpdate]):
    def __init__(self, database: AsyncIOMotorDatabase):
        super().__init__(database, "content_collections", ContentCollectionInDB)
    
    async def create_collection(self, collection_data: ContentCollectionCreate, owner_id: PyObjectId) -> ContentCollectionInDB:
        """Create new content collection"""
        collection_doc = ContentCollectionInDB(
            **collection_data.dict(),
            owner_id=owner_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        result = await self.collection.insert_one(collection_doc.dict(by_alias=True))
        collection_doc.id = result.inserted_id
        return collection_doc
    
    async def add_content_to_collection(self, collection_id: PyObjectId, content_id: PyObjectId) -> ContentCollectionInDB:
        """Add content to collection"""
        await self.collection.update_one(
            {"_id": collection_id},
            {
                "$addToSet": {"content_ids": content_id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return await self.get_by_id(collection_id)
    
    async def remove_content_from_collection(self, collection_id: PyObjectId, content_id: PyObjectId) -> ContentCollectionInDB:
        """Remove content from collection"""
        await self.collection.update_one(
            {"_id": collection_id},
            {
                "$pull": {"content_ids": content_id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return await self.get_by_id(collection_id)
    
    async def get_collections_by_owner(self, owner_id: PyObjectId) -> List[ContentCollectionInDB]:
        """Get all collections for a user"""
        cursor = self.collection.find({"owner_id": owner_id}).sort("updated_at", -1)
        results = await cursor.to_list(length=None)
        return [ContentCollectionInDB(**doc) for doc in results]