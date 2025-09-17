# Models package
from .base import BaseDocument, PyObjectId, TimestampMixin
from .user import (
    User, UserInDB, UserCreate, UserUpdate, UserBase,
    UserPreferences, UserProfile, NotificationSettings, DashboardWidget,
    SubscriptionTier, UserType
)
from .project import (
    Project, ProjectInDB, ProjectCreate, ProjectUpdate, ProjectBase,
    ProjectType, ProjectStatus, ProjectBudget, ProjectTimeline, ProjectCollaborator
)
from .task import (
    Task, TaskInDB, TaskCreate, TaskUpdate, TaskBase,
    TaskStatus, TaskPriority, TaskType, TaskDependency, TaskAssignee,
    TaskComment, TaskAttachment
)
from .financial import (
    FinancialRecord, FinancialRecordInDB, FinancialRecordCreate, FinancialRecordUpdate, FinancialRecordBase,
    Budget, BudgetInDB, BudgetCreate, BudgetUpdate, BudgetBase, BudgetCategory,
    TransactionType, IncomeCategory, ExpenseCategory, PaymentMethod, IntegrationMetadata
)
from .content import (
    Content, ContentInDB, ContentCreate, ContentUpdate, ContentBase,
    ContentCollection, ContentCollectionInDB, ContentCollectionCreate, ContentCollectionUpdate, ContentCollectionBase,
    ContentType, ContentStatus, ContentVersion, ContentMetadata, ContentTag
)
from .ai import (
    AISuggestion, AISuggestionInDB, AISuggestionCreate, AISuggestionUpdate, AISuggestionBase,
    AIContext, AIContextInDB, AIContextBase,
    AIFeedback, AIFeedbackInDB, AIFeedbackBase,
    AutomationRule, AutomationRuleInDB, AutomationRuleCreate, AutomationRuleUpdate, AutomationRuleBase,
    AIModule, SuggestionStatus, AutomationActionType, AutomationAction
)
from .calendar import (
    Event, EventInDB, EventCreate, EventUpdate, EventBase,
    CalendarIntegration, CalendarIntegrationInDB, CalendarIntegrationCreate, CalendarIntegrationUpdate, CalendarIntegrationBase,
    EventType, EventStatus, EventPriority, RecurrencePattern, EventReminder, EventAttendee, EventLocation
)
from .integration import (
    Integration, IntegrationInDB, IntegrationCreate, IntegrationUpdate, IntegrationBase,
    StreamingData, StreamingDataInDB, StreamingDataBase,
    SocialMediaData, SocialMediaDataInDB, SocialMediaDataBase,
    WebhookEvent, WebhookEventInDB, WebhookEventBase,
    IntegrationType, IntegrationStatus, SyncConfiguration, IntegrationCredentials
)
from .marketing import (
    Campaign, CampaignInDB, CampaignCreate, CampaignUpdate, CampaignBase,
    ContentTemplate, ContentTemplateInDB, ContentTemplateBase,
    CampaignType, CampaignStatus, Platform, CampaignObjective, CampaignContent, CampaignBudget
)
from .tour import (
    Tour, TourInDB, TourCreate, TourUpdate, TourBase,
    Show, ShowInDB, ShowCreate, ShowUpdate, ShowBase,
    Venue, VenueInDB, VenueCreate, VenueUpdate, VenueBase,
    TourType, TourStatus, VenueType, ShowStatus, TourBudget,
    VenueContact, VenueLocation, ShowFinancials, ShowLogistics
)

__all__ = [
    # Base
    "BaseDocument", "PyObjectId", "TimestampMixin",
    
    # User models
    "User", "UserInDB", "UserCreate", "UserUpdate", "UserBase",
    "UserPreferences", "UserProfile", "NotificationSettings", "DashboardWidget",
    "SubscriptionTier", "UserType",
    
    # Project models
    "Project", "ProjectInDB", "ProjectCreate", "ProjectUpdate", "ProjectBase",
    "ProjectType", "ProjectStatus", "ProjectBudget", "ProjectTimeline", "ProjectCollaborator",
    
    # Task models
    "Task", "TaskInDB", "TaskCreate", "TaskUpdate", "TaskBase",
    "TaskStatus", "TaskPriority", "TaskType", "TaskDependency", "TaskAssignee",
    "TaskComment", "TaskAttachment",
    
    # Financial models
    "FinancialRecord", "FinancialRecordInDB", "FinancialRecordCreate", "FinancialRecordUpdate", "FinancialRecordBase",
    "Budget", "BudgetInDB", "BudgetCreate", "BudgetUpdate", "BudgetBase", "BudgetCategory",
    "TransactionType", "IncomeCategory", "ExpenseCategory", "PaymentMethod", "IntegrationMetadata",
    
    # Content models
    "Content", "ContentInDB", "ContentCreate", "ContentUpdate", "ContentBase",
    "ContentCollection", "ContentCollectionInDB", "ContentCollectionCreate", "ContentCollectionUpdate", "ContentCollectionBase",
    "ContentType", "ContentStatus", "ContentVersion", "ContentMetadata", "ContentTag",
    
    # AI models
    "AISuggestion", "AISuggestionInDB", "AISuggestionCreate", "AISuggestionUpdate", "AISuggestionBase",
    "AIContext", "AIContextInDB", "AIContextBase",
    "AIFeedback", "AIFeedbackInDB", "AIFeedbackBase",
    "AutomationRule", "AutomationRuleInDB", "AutomationRuleCreate", "AutomationRuleUpdate", "AutomationRuleBase",
    "AIModule", "SuggestionStatus", "AutomationActionType", "AutomationAction",
    
    # Calendar models
    "Event", "EventInDB", "EventCreate", "EventUpdate", "EventBase",
    "CalendarIntegration", "CalendarIntegrationInDB", "CalendarIntegrationCreate", "CalendarIntegrationUpdate", "CalendarIntegrationBase",
    "EventType", "EventStatus", "EventPriority", "RecurrencePattern", "EventReminder", "EventAttendee", "EventLocation",
    
    # Integration models
    "Integration", "IntegrationInDB", "IntegrationCreate", "IntegrationUpdate", "IntegrationBase",
    "StreamingData", "StreamingDataInDB", "StreamingDataBase",
    "SocialMediaData", "SocialMediaDataInDB", "SocialMediaDataBase",
    "WebhookEvent", "WebhookEventInDB", "WebhookEventBase",
    "IntegrationType", "IntegrationStatus", "SyncConfiguration", "IntegrationCredentials",
    
    # Marketing models
    "Campaign", "CampaignInDB", "CampaignCreate", "CampaignUpdate", "CampaignBase",
    "ContentTemplate", "ContentTemplateInDB", "ContentTemplateBase",
    "CampaignType", "CampaignStatus", "Platform", "CampaignObjective", "CampaignContent", "CampaignBudget",
    
    # Tour models
    "Tour", "TourInDB", "TourCreate", "TourUpdate", "TourBase",
    "Show", "ShowInDB", "ShowCreate", "ShowUpdate", "ShowBase",
    "Venue", "VenueInDB", "VenueCreate", "VenueUpdate", "VenueBase",
    "TourType", "TourStatus", "VenueType", "ShowStatus", "TourBudget",
    "VenueContact", "VenueLocation", "ShowFinancials", "ShowLogistics",
]