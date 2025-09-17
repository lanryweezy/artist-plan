from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from .base import BaseDocument


class ReportType(str, Enum):
    FINANCIAL = "financial"
    PROJECT = "project"
    MARKETING = "marketing"
    STREAMING = "streaming"
    CUSTOM = "custom"


class ReportFormat(str, Enum):
    PDF = "pdf"
    CSV = "csv"
    EXCEL = "excel"
    JSON = "json"


class ChartType(str, Enum):
    LINE = "line"
    BAR = "bar"
    PIE = "pie"
    AREA = "area"
    SCATTER = "scatter"
    HEATMAP = "heatmap"


class WidgetType(str, Enum):
    METRIC = "metric"
    CHART = "chart"
    TABLE = "table"
    PROGRESS = "progress"
    GAUGE = "gauge"


class AlertCondition(str, Enum):
    GREATER_THAN = "greater_than"
    LESS_THAN = "less_than"
    EQUALS = "equals"
    PERCENTAGE_CHANGE = "percentage_change"


class DashboardWidget(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    type: WidgetType
    title: str
    position: Dict[str, int]  # x, y, width, height
    config: Dict[str, Any]
    data_source: str
    filters: Optional[Dict[str, Any]] = None
    refresh_interval: Optional[int] = None  # seconds


class CustomDashboard(BaseDocument):
    name: str
    description: Optional[str] = None
    user_id: str
    widgets: List[DashboardWidget] = []
    is_default: bool = False
    shared_with: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "custom_dashboards"


class ReportTemplate(BaseDocument):
    name: str
    description: Optional[str] = None
    type: ReportType
    user_id: str
    config: Dict[str, Any]
    filters: Dict[str, Any] = {}
    charts: List[Dict[str, Any]] = []
    is_public: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "report_templates"


class GeneratedReport(BaseDocument):
    name: str
    template_id: Optional[str] = None
    type: ReportType
    format: ReportFormat
    user_id: str
    file_path: Optional[str] = None
    file_url: Optional[str] = None
    parameters: Dict[str, Any] = {}
    status: str = "pending"  # pending, generating, completed, failed
    error_message: Optional[str] = None
    generated_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "generated_reports"


class AnalyticsAlert(BaseDocument):
    name: str
    description: Optional[str] = None
    user_id: str
    metric: str
    condition: AlertCondition
    threshold: float
    comparison_period: Optional[str] = None  # "1d", "7d", "30d"
    is_active: bool = True
    last_triggered: Optional[datetime] = None
    notification_channels: List[str] = ["email"]  # email, webhook, in_app
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "analytics_alerts"


class AnalyticsData(BaseDocument):
    user_id: str
    metric: str
    value: float
    dimensions: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str  # manual, integration, calculated
    metadata: Dict[str, Any] = {}

    class Settings:
        name = "analytics_data"


# Request/Response Models
class DashboardWidgetCreate(BaseModel):
    type: WidgetType
    title: str
    position: Dict[str, int]
    config: Dict[str, Any]
    data_source: str
    filters: Optional[Dict[str, Any]] = None
    refresh_interval: Optional[int] = None


class CustomDashboardCreate(BaseModel):
    name: str
    description: Optional[str] = None
    widgets: List[DashboardWidgetCreate] = []
    is_default: bool = False


class ReportTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: ReportType
    config: Dict[str, Any]
    filters: Dict[str, Any] = {}
    charts: List[Dict[str, Any]] = []
    is_public: bool = False


class ReportGenerateRequest(BaseModel):
    template_id: Optional[str] = None
    name: str
    type: ReportType
    format: ReportFormat
    parameters: Dict[str, Any] = {}
    date_range: Optional[Dict[str, str]] = None


class AnalyticsAlertCreate(BaseModel):
    name: str
    description: Optional[str] = None
    metric: str
    condition: AlertCondition
    threshold: float
    comparison_period: Optional[str] = None
    notification_channels: List[str] = ["email"]


class AnalyticsQuery(BaseModel):
    metrics: List[str]
    dimensions: Optional[List[str]] = None
    filters: Optional[Dict[str, Any]] = None
    date_range: Optional[Dict[str, str]] = None
    group_by: Optional[str] = None
    limit: Optional[int] = 1000