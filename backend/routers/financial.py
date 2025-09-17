from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

router = APIRouter()
security = HTTPBearer()

class FinancialRecord(BaseModel):
    id: str
    amount: float
    type: str  # income or expense
    category: str
    description: Optional[str] = None
    date: datetime
    created_at: datetime

class CreateFinancialRecordRequest(BaseModel):
    amount: float
    type: str
    category: str
    description: Optional[str] = None
    date: Optional[datetime] = None

@router.get("/records", response_model=List[FinancialRecord])
async def get_financial_records(token = Depends(security)):
    """Get financial records"""
    # Retrieve financial records for the authenticated user
    return []

@router.post("/records", response_model=FinancialRecord)
async def create_financial_record(request: CreateFinancialRecordRequest, token = Depends(security)):
    """Create new financial record"""
    # Create new financial record for the authenticated user
    now = datetime.utcnow()
    return {
        "id": "dummy_record_id",
        "amount": request.amount,
        "type": request.type,
        "category": request.category,
        "description": request.description,
        "date": request.date or now,
        "created_at": now
    }