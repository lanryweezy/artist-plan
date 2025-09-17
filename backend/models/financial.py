from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from .base import BaseDocument, PyObjectId

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class IncomeCategory(str, Enum):
    STREAMING_ROYALTIES = "streaming_royalties"
    PERFORMANCE_ROYALTIES = "performance_royalties"
    SYNC_LICENSING = "sync_licensing"
    MERCHANDISE = "merchandise"
    LIVE_PERFORMANCE = "live_performance"
    TEACHING = "teaching"
    SESSION_WORK = "session_work"
    PRODUCTION = "production"
    OTHER_INCOME = "other_income"

class ExpenseCategory(str, Enum):
    RECORDING = "recording"
    MIXING_MASTERING = "mixing_mastering"
    MARKETING = "marketing"
    DISTRIBUTION = "distribution"
    EQUIPMENT = "equipment"
    SOFTWARE = "software"
    TRAVEL = "travel"
    ACCOMMODATION = "accommodation"
    MEALS = "meals"
    LEGAL = "legal"
    ACCOUNTING = "accounting"
    INSURANCE = "insurance"
    UTILITIES = "utilities"
    RENT = "rent"
    OTHER_EXPENSE = "other_expense"

class PaymentMethod(str, Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    PAYPAL = "paypal"
    STRIPE = "stripe"
    CRYPTO = "crypto"
    CHECK = "check"
    OTHER = "other"

class IntegrationMetadata(BaseModel):
    source_platform: str
    source_id: str
    sync_date: datetime = Field(default_factory=datetime.utcnow)
    raw_data: Dict[str, Any] = {}

class FinancialRecordBase(BaseModel):
    amount: float
    currency: str = "USD"
    type: TransactionType
    category: str
    description: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    payment_method: Optional[PaymentMethod] = None
    reference_number: Optional[str] = None
    tags: List[str] = []

class FinancialRecordCreate(FinancialRecordBase):
    project_id: Optional[PyObjectId] = None

class FinancialRecordUpdate(BaseModel):
    amount: Optional[float] = None
    currency: Optional[str] = None
    type: Optional[TransactionType] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    payment_method: Optional[PaymentMethod] = None
    reference_number: Optional[str] = None
    tags: Optional[List[str]] = None

class FinancialRecordInDB(BaseDocument, FinancialRecordBase):
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    source: str = "manual"  # manual, integration, ai_generated
    integration_metadata: Optional[IntegrationMetadata] = None
    ai_categorized: bool = False
    ai_confidence: Optional[float] = None
    receipt_url: Optional[str] = None
    tax_deductible: bool = False
    reconciled: bool = False

class FinancialRecord(FinancialRecordBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    source: str = "manual"
    integration_metadata: Optional[IntegrationMetadata] = None
    ai_categorized: bool = False
    ai_confidence: Optional[float] = None
    receipt_url: Optional[str] = None
    tax_deductible: bool = False
    reconciled: bool = False
    created_at: datetime
    updated_at: datetime

# Budget Models
class BudgetCategory(BaseModel):
    name: str
    allocated_amount: float
    spent_amount: float = 0.0
    remaining_amount: float = 0.0

class BudgetBase(BaseModel):
    name: str
    description: Optional[str] = None
    total_amount: float
    currency: str = "USD"
    start_date: datetime
    end_date: datetime
    categories: List[BudgetCategory] = []

class BudgetCreate(BudgetBase):
    project_id: Optional[PyObjectId] = None

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    categories: Optional[List[BudgetCategory]] = None

class BudgetInDB(BaseDocument, BudgetBase):
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    spent_amount: float = 0.0
    remaining_amount: float = 0.0
    is_active: bool = True

class Budget(BudgetBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    spent_amount: float = 0.0
    remaining_amount: float = 0.0
    is_active: bool = True
    created_at: datetime
    updated_at: datetime