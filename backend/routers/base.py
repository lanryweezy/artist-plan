from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Generic, TypeVar, Type, List, Optional, Dict, Any
from pydantic import BaseModel

from models.base import BaseDocument
from models.user import UserInDB
from services.base_crud import BaseCRUDService
from schemas.responses import BaseResponse, PaginatedResponse, SuccessResponse, create_response, create_paginated_response
from routers.auth import get_current_user

ModelType = TypeVar("ModelType", bound=BaseDocument)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
ResponseSchemaType = TypeVar("ResponseSchemaType", bound=BaseModel)

class BaseRouter(Generic[ModelType, CreateSchemaType, UpdateSchemaType, ResponseSchemaType]):
    """Base router class with common CRUD operations"""
    
    def __init__(
        self,
        service: BaseCRUDService[ModelType, CreateSchemaType, UpdateSchemaType],
        response_model: Type[ResponseSchemaType],
        prefix: str,
        tags: List[str]
    ):
        self.service = service
        self.response_model = response_model
        self.router = APIRouter(prefix=prefix, tags=tags)
        self._setup_routes()
    
    def _setup_routes(self):
        """Setup common CRUD routes"""
        
        @self.router.post("/", response_model=BaseResponse[self.response_model])
        async def create_item(
            item: CreateSchemaType,
            current_user: UserInDB = Depends(get_current_user)
        ):
            """Create a new item"""
            created_item = await self.service.create(item, user_id=str(current_user.id))
            response_data = self.response_model.model_validate(created_item.model_dump())
            return create_response(data=response_data, message="Item created successfully")
        
        @self.router.get("/{item_id}", response_model=BaseResponse[self.response_model])
        async def get_item(
            item_id: str,
            current_user: UserInDB = Depends(get_current_user)
        ):
            """Get an item by ID"""
            item = await self.service.get(item_id, user_id=str(current_user.id))
            if not item:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Item not found"
                )
            response_data = self.response_model.model_validate(item.model_dump())
            return create_response(data=response_data)
        
        @self.router.get("/", response_model=PaginatedResponse[self.response_model])
        async def get_items(
            page: int = Query(1, ge=1, description="Page number"),
            size: int = Query(10, ge=1, le=100, description="Page size"),
            current_user: UserInDB = Depends(get_current_user)
        ):
            """Get items with pagination"""
            skip = (page - 1) * size
            items = await self.service.get_multi(
                skip=skip, 
                limit=size, 
                user_id=str(current_user.id)
            )
            total = await self.service.count(user_id=str(current_user.id))
            
            response_data = [
                self.response_model.model_validate(item.model_dump()) 
                for item in items
            ]
            
            return create_paginated_response(
                data=response_data,
                page=page,
                size=size,
                total=total
            )
        
        @self.router.put("/{item_id}", response_model=BaseResponse[self.response_model])
        async def update_item(
            item_id: str,
            item_update: UpdateSchemaType,
            current_user: UserInDB = Depends(get_current_user)
        ):
            """Update an item"""
            updated_item = await self.service.update(
                item_id, 
                item_update, 
                user_id=str(current_user.id)
            )
            if not updated_item:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Item not found"
                )
            response_data = self.response_model.model_validate(updated_item.model_dump())
            return create_response(data=response_data, message="Item updated successfully")
        
        @self.router.delete("/{item_id}", response_model=SuccessResponse)
        async def delete_item(
            item_id: str,
            current_user: UserInDB = Depends(get_current_user)
        ):
            """Delete an item (soft delete)"""
            deleted = await self.service.soft_delete(item_id, user_id=str(current_user.id))
            if not deleted:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Item not found"
                )
            return SuccessResponse(message="Item deleted successfully")
    
    def add_custom_route(self, method: str, path: str, **kwargs):
        """Add custom routes to the router"""
        return getattr(self.router, method.lower())(path, **kwargs)
    
    def get_router(self) -> APIRouter:
        """Get the configured router"""
        return self.router