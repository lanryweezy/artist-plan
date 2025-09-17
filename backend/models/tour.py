from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, time
from enum import Enum
from .base import BaseDocument, PyObjectId

class TourType(str, Enum):
    HEADLINING = "headlining"
    SUPPORTING = "supporting"
    FESTIVAL = "festival"
    RESIDENCY = "residency"
    ACOUSTIC = "acoustic"
    VIRTUAL = "virtual"

class TourStatus(str, Enum):
    PLANNING = "planning"
    BOOKING = "booking"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"

class VenueType(str, Enum):
    CLUB = "club"
    THEATER = "theater"
    ARENA = "arena"
    STADIUM = "stadium"
    FESTIVAL_STAGE = "festival_stage"
    OUTDOOR = "outdoor"
    HOUSE_CONCERT = "house_concert"
    VIRTUAL = "virtual"

class ShowStatus(str, Enum):
    TENTATIVE = "tentative"
    CONFIRMED = "confirmed"
    SOLD_OUT = "sold_out"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"
    COMPLETED = "completed"

class VenueContact(BaseModel):
    name: str
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class VenueLocation(BaseModel):
    address: str
    city: str
    state: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None  # lat, lng

class VenueBase(BaseModel):
    name: str
    type: VenueType
    capacity: Optional[int] = None
    location: VenueLocation
    website: Optional[str] = None
    contacts: List[VenueContact] = []
    technical_specs: Dict[str, Any] = {}
    notes: Optional[str] = None

class VenueCreate(VenueBase):
    pass

class VenueUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[VenueType] = None
    capacity: Optional[int] = None
    location: Optional[VenueLocation] = None
    website: Optional[str] = None
    contacts: Optional[List[VenueContact]] = None
    technical_specs: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None

class VenueInDB(BaseDocument, VenueBase):
    creator_id: PyObjectId
    rating: Optional[float] = None
    last_played: Optional[datetime] = None
    times_played: int = 0
    is_favorite: bool = False

class Venue(VenueBase):
    id: PyObjectId = Field(alias="_id")
    creator_id: PyObjectId
    rating: Optional[float] = None
    last_played: Optional[datetime] = None
    times_played: int = 0
    is_favorite: bool = False
    created_at: datetime
    updated_at: datetime

# Show/Performance Models
class ShowFinancials(BaseModel):
    guarantee: Optional[float] = None
    door_split_percentage: Optional[float] = None
    merchandise_split_percentage: Optional[float] = None
    expenses: Dict[str, float] = {}
    actual_payout: Optional[float] = None
    currency: str = "USD"

class ShowLogistics(BaseModel):
    load_in_time: Optional[time] = None
    sound_check_time: Optional[time] = None
    doors_open_time: Optional[time] = None
    show_start_time: Optional[time] = None
    curfew_time: Optional[time] = None
    travel_distance_miles: Optional[float] = None
    travel_time_hours: Optional[float] = None
    accommodation: Optional[str] = None
    parking_info: Optional[str] = None

class ShowBase(BaseModel):
    title: str
    date: datetime
    venue_id: PyObjectId
    status: ShowStatus = ShowStatus.TENTATIVE
    ticket_price: Optional[float] = None
    expected_attendance: Optional[int] = None
    actual_attendance: Optional[int] = None
    setlist: List[str] = []
    notes: Optional[str] = None

class ShowCreate(ShowBase):
    tour_id: Optional[PyObjectId] = None
    financials: Optional[ShowFinancials] = None
    logistics: Optional[ShowLogistics] = None

class ShowUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    status: Optional[ShowStatus] = None
    ticket_price: Optional[float] = None
    expected_attendance: Optional[int] = None
    actual_attendance: Optional[int] = None
    setlist: Optional[List[str]] = None
    notes: Optional[str] = None

class ShowInDB(BaseDocument, ShowBase):
    tour_id: Optional[PyObjectId] = None
    creator_id: PyObjectId
    financials: Optional[ShowFinancials] = None
    logistics: Optional[ShowLogistics] = None
    supporting_acts: List[str] = []
    crew_notes: Optional[str] = None
    fan_reviews: List[Dict[str, Any]] = []
    photos: List[str] = []
    recordings: List[str] = []

class Show(ShowBase):
    id: PyObjectId = Field(alias="_id")
    tour_id: Optional[PyObjectId] = None
    creator_id: PyObjectId
    financials: Optional[ShowFinancials] = None
    logistics: Optional[ShowLogistics] = None
    supporting_acts: List[str] = []
    crew_notes: Optional[str] = None
    fan_reviews: List[Dict[str, Any]] = []
    photos: List[str] = []
    recordings: List[str] = []
    created_at: datetime
    updated_at: datetime

# Tour Models
class TourBudget(BaseModel):
    total_budget: float
    categories: Dict[str, float] = {}  # travel, accommodation, crew, equipment, etc.
    spent_amount: float = 0.0
    currency: str = "USD"

class TourBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: TourType
    status: TourStatus = TourStatus.PLANNING
    start_date: datetime
    end_date: datetime
    regions: List[str] = []  # North America, Europe, etc.
    tags: List[str] = []

class TourCreate(TourBase):
    project_id: Optional[PyObjectId] = None
    budget: Optional[TourBudget] = None

class TourUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TourStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    regions: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class TourInDB(BaseDocument, TourBase):
    creator_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    budget: Optional[TourBudget] = None
    show_count: int = 0
    total_expected_attendance: int = 0
    total_actual_attendance: int = 0
    total_revenue: float = 0.0
    total_expenses: float = 0.0
    crew_members: List[Dict[str, Any]] = []
    equipment_list: List[Dict[str, Any]] = []
    sponsors: List[Dict[str, Any]] = []
    ai_route_optimized: bool = False

class Tour(TourBase):
    id: PyObjectId = Field(alias="_id")
    creator_id: PyObjectId
    project_id: Optional[PyObjectId] = None
    budget: Optional[TourBudget] = None
    show_count: int = 0
    total_expected_attendance: int = 0
    total_actual_attendance: int = 0
    total_revenue: float = 0.0
    total_expenses: float = 0.0
    crew_members: List[Dict[str, Any]] = []
    equipment_list: List[Dict[str, Any]] = []
    sponsors: List[Dict[str, Any]] = []
    ai_route_optimized: bool = False
    created_at: datetime
    updated_at: datetime