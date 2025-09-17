from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List, Any, Dict
from datetime import datetime

T = TypeVar('T')

class BaseResponse(BaseModel, Generic[T]):
    """Base response model"""
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    timestamp: datetime = datetime.utcnow()

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: Dict[str, Any]
    timestamp: datetime = datetime.utcnow()

class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response model"""
    success: bool = True
    data: List[T]
    pagination: Dict[str, Any]
    message: Optional[str] = None
    timestamp: datetime = datetime.utcnow()

class SuccessResponse(BaseModel):
    """Simple success response"""
    success: bool = True
    message: str
    timestamp: datetime = datetime.utcnow()

def create_response(data: Any = None, message: str = None) -> BaseResponse:
    """Create a successful response"""
    return BaseResponse(
        success=True,
        data=data,
        message=message,
        timestamp=datetime.utcnow()
    )

def create_error_response(
    code: int, 
    message: str, 
    error_type: str = "error",
    details: Any = None
) -> ErrorResponse:
    """Create an error response"""
    error_data = {
        "code": code,
        "message": message,
        "type": error_type
    }
    if details:
        error_data["details"] = details
    
    return ErrorResponse(
        success=False,
        error=error_data,
        timestamp=datetime.utcnow()
    )

def create_paginated_response(
    data: List[Any],
    page: int,
    size: int,
    total: int,
    message: str = None
) -> PaginatedResponse:
    """Create a paginated response"""
    total_pages = (total + size - 1) // size  # Ceiling division
    
    return PaginatedResponse(
        success=True,
        data=data,
        pagination={
            "page": page,
            "size": size,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        },
        message=message,
        timestamp=datetime.utcnow()
    )