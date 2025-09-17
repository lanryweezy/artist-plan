from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime, timedelta
from decimal import Decimal

from services.base_crud import BaseCRUDService
from models.financial import FinancialRecord, FinancialRecordCreate, FinancialRecordUpdate

class FinancialService(BaseCRUDService[FinancialRecord, FinancialRecordCreate, FinancialRecordUpdate]):
    """Service for financial management operations"""
    
    def __init__(self):
        super().__init__(FinancialRecord, "financial_records")
    
    async def get_by_type(self, record_type: str, user_id: str) -> List[FinancialRecord]:
        """Get financial records by type (income/expense)"""
        return await self.get_multi(
            user_id=user_id,
            filters={"type": record_type}
        )
    
    async def get_by_category(self, category: str, user_id: str) -> List[FinancialRecord]:
        """Get financial records by category"""
        return await self.get_multi(
            user_id=user_id,
            filters={"category": category}
        )
    
    async def get_by_date_range(
        self, 
        start_date: datetime, 
        end_date: datetime, 
        user_id: str
    ) -> List[FinancialRecord]:
        """Get financial records within date range"""
        return await self.get_multi(
            user_id=user_id,
            filters={
                "date": {
                    "$gte": start_date,
                    "$lte": end_date
                }
            }
        )
    
    async def get_monthly_summary(self, year: int, month: int, user_id: str) -> Dict[str, Any]:
        """Get monthly financial summary"""
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1) - timedelta(days=1)
        
        # Aggregate pipeline for monthly summary
        pipeline = [
            {
                "$match": {
                    "user_id": ObjectId(user_id),
                    "date": {"$gte": start_date, "$lte": end_date},
                    "is_deleted": {"$ne": True}
                }
            },
            {
                "$group": {
                    "_id": "$type",
                    "total": {"$sum": "$amount"},
                    "count": {"$sum": 1},
                    "categories": {
                        "$push": {
                            "category": "$category",
                            "amount": "$amount"
                        }
                    }
                }
            }
        ]
        
        results = await self.collection.aggregate(pipeline).to_list(None)
        
        summary = {
            "income": {"total": 0, "count": 0, "categories": []},
            "expense": {"total": 0, "count": 0, "categories": []},
            "net": 0
        }
        
        for result in results:
            record_type = result["_id"]
            if record_type in summary:
                summary[record_type] = {
                    "total": float(result["total"]),
                    "count": result["count"],
                    "categories": result["categories"]
                }
        
        summary["net"] = summary["income"]["total"] - summary["expense"]["total"]
        
        return summary
    
    async def get_category_breakdown(self, user_id: str, days: int = 30) -> Dict[str, float]:
        """Get expense breakdown by category for the last N days"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {
                "$match": {
                    "user_id": ObjectId(user_id),
                    "type": "expense",
                    "date": {"$gte": start_date},
                    "is_deleted": {"$ne": True}
                }
            },
            {
                "$group": {
                    "_id": "$category",
                    "total": {"$sum": "$amount"}
                }
            },
            {
                "$sort": {"total": -1}
            }
        ]
        
        results = await self.collection.aggregate(pipeline).to_list(None)
        
        return {result["_id"]: float(result["total"]) for result in results}
    
    async def get_income_sources(self, user_id: str, days: int = 30) -> Dict[str, float]:
        """Get income breakdown by source for the last N days"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {
                "$match": {
                    "user_id": ObjectId(user_id),
                    "type": "income",
                    "date": {"$gte": start_date},
                    "is_deleted": {"$ne": True}
                }
            },
            {
                "$group": {
                    "_id": "$category",
                    "total": {"$sum": "$amount"}
                }
            },
            {
                "$sort": {"total": -1}
            }
        ]
        
        results = await self.collection.aggregate(pipeline).to_list(None)
        
        return {result["_id"]: float(result["total"]) for result in results}

# Create singleton instance
financial_service = FinancialService()