from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from ..models.tour import (
    Tour, TourCreate, TourUpdate, TourInDB,
    Venue, VenueCreate, VenueUpdate, VenueInDB,
    Show, ShowCreate, ShowUpdate, ShowInDB,
    TourStatus, ShowStatus, VenueType
)
from ..models.user import User
from ..database import get_database
from ..routers.auth import get_current_user
from ..schemas.responses import StandardResponse
from ..services.base_crud import BaseCRUDService

router = APIRouter(prefix="/tours", tags=["tours"])

# Tour CRUD Operations
@router.post("/", response_model=StandardResponse[Tour])
async def create_tour(
    tour_data: TourCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new tour"""
    tour_dict = tour_data.dict()
    tour_dict["creator_id"] = ObjectId(current_user.id)
    tour_dict["created_at"] = datetime.utcnow()
    tour_dict["updated_at"] = datetime.utcnow()
    
    result = await db.tours.insert_one(tour_dict)
    created_tour = await db.tours.find_one({"_id": result.inserted_id})
    
    return StandardResponse(
        success=True,
        message="Tour created successfully",
        data=Tour(**created_tour)
    )

@router.get("/", response_model=StandardResponse[List[Tour]])
async def get_tours(
    status: Optional[TourStatus] = None,
    project_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get user's tours with optional filtering"""
    query = {"creator_id": ObjectId(current_user.id)}
    
    if status:
        query["status"] = status
    if project_id:
        query["project_id"] = ObjectId(project_id)
    
    tours = await db.tours.find(query).skip(skip).limit(limit).to_list(length=limit)
    return StandardResponse(
        success=True,
        message="Tours retrieved successfully",
        data=[Tour(**tour) for tour in tours]
    )

@router.get("/{tour_id}", response_model=StandardResponse[Tour])
async def get_tour(
    tour_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get a specific tour"""
    tour = await db.tours.find_one({
        "_id": ObjectId(tour_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    return StandardResponse(
        success=True,
        message="Tour retrieved successfully",
        data=Tour(**tour)
    )

@router.put("/{tour_id}", response_model=StandardResponse[Tour])
async def update_tour(
    tour_id: str,
    tour_update: TourUpdate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Update a tour"""
    update_data = {k: v for k, v in tour_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.tours.update_one(
        {"_id": ObjectId(tour_id), "creator_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    updated_tour = await db.tours.find_one({"_id": ObjectId(tour_id)})
    return StandardResponse(
        success=True,
        message="Tour updated successfully",
        data=Tour(**updated_tour)
    )

@router.delete("/{tour_id}", response_model=StandardResponse[dict])
async def delete_tour(
    tour_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Delete a tour"""
    result = await db.tours.delete_one({
        "_id": ObjectId(tour_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Also delete associated shows
    await db.shows.delete_many({"tour_id": ObjectId(tour_id)})
    
    return StandardResponse(
        success=True,
        message="Tour deleted successfully",
        data={"deleted_id": tour_id}
    )

# Venue Management
@router.post("/venues", response_model=StandardResponse[Venue])
async def create_venue(
    venue_data: VenueCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new venue"""
    venue_dict = venue_data.dict()
    venue_dict["creator_id"] = ObjectId(current_user.id)
    venue_dict["created_at"] = datetime.utcnow()
    venue_dict["updated_at"] = datetime.utcnow()
    
    result = await db.venues.insert_one(venue_dict)
    created_venue = await db.venues.find_one({"_id": result.inserted_id})
    
    return StandardResponse(
        success=True,
        message="Venue created successfully",
        data=Venue(**created_venue)
    )

@router.get("/venues", response_model=StandardResponse[List[Venue]])
async def get_venues(
    venue_type: Optional[VenueType] = None,
    city: Optional[str] = None,
    country: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get user's venues with optional filtering"""
    query = {"creator_id": ObjectId(current_user.id)}
    
    if venue_type:
        query["type"] = venue_type
    if city:
        query["location.city"] = {"$regex": city, "$options": "i"}
    if country:
        query["location.country"] = {"$regex": country, "$options": "i"}
    
    venues = await db.venues.find(query).skip(skip).limit(limit).to_list(length=limit)
    return StandardResponse(
        success=True,
        message="Venues retrieved successfully",
        data=[Venue(**venue) for venue in venues]
    )

@router.get("/venues/{venue_id}", response_model=StandardResponse[Venue])
async def get_venue(
    venue_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get a specific venue"""
    venue = await db.venues.find_one({
        "_id": ObjectId(venue_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    return StandardResponse(
        success=True,
        message="Venue retrieved successfully",
        data=Venue(**venue)
    )

@router.put("/venues/{venue_id}", response_model=StandardResponse[Venue])
async def update_venue(
    venue_id: str,
    venue_update: VenueUpdate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Update a venue"""
    update_data = {k: v for k, v in venue_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.venues.update_one(
        {"_id": ObjectId(venue_id), "creator_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    updated_venue = await db.venues.find_one({"_id": ObjectId(venue_id)})
    return StandardResponse(
        success=True,
        message="Venue updated successfully",
        data=Venue(**updated_venue)
    )

@router.delete("/venues/{venue_id}", response_model=StandardResponse[dict])
async def delete_venue(
    venue_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Delete a venue"""
    result = await db.venues.delete_one({
        "_id": ObjectId(venue_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    return StandardResponse(
        success=True,
        message="Venue deleted successfully",
        data={"deleted_id": venue_id}
    )
# Sho
w/Performance Management
@router.post("/{tour_id}/shows", response_model=StandardResponse[Show])
async def create_show(
    tour_id: str,
    show_data: ShowCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new show for a tour"""
    # Verify tour exists and belongs to user
    tour = await db.tours.find_one({
        "_id": ObjectId(tour_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Verify venue exists
    venue = await db.venues.find_one({"_id": ObjectId(show_data.venue_id)})
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    show_dict = show_data.dict()
    show_dict["tour_id"] = ObjectId(tour_id)
    show_dict["creator_id"] = ObjectId(current_user.id)
    show_dict["created_at"] = datetime.utcnow()
    show_dict["updated_at"] = datetime.utcnow()
    
    result = await db.shows.insert_one(show_dict)
    created_show = await db.shows.find_one({"_id": result.inserted_id})
    
    # Update tour show count
    await db.tours.update_one(
        {"_id": ObjectId(tour_id)},
        {"$inc": {"show_count": 1}}
    )
    
    return StandardResponse(
        success=True,
        message="Show created successfully",
        data=Show(**created_show)
    )

@router.get("/{tour_id}/shows", response_model=StandardResponse[List[Show]])
async def get_tour_shows(
    tour_id: str,
    status: Optional[ShowStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get shows for a specific tour"""
    # Verify tour exists and belongs to user
    tour = await db.tours.find_one({
        "_id": ObjectId(tour_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    query = {"tour_id": ObjectId(tour_id)}
    if status:
        query["status"] = status
    
    shows = await db.shows.find(query).skip(skip).limit(limit).to_list(length=limit)
    return StandardResponse(
        success=True,
        message="Shows retrieved successfully",
        data=[Show(**show) for show in shows]
    )

@router.get("/shows/{show_id}", response_model=StandardResponse[Show])
async def get_show(
    show_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get a specific show"""
    show = await db.shows.find_one({
        "_id": ObjectId(show_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    return StandardResponse(
        success=True,
        message="Show retrieved successfully",
        data=Show(**show)
    )

@router.put("/shows/{show_id}", response_model=StandardResponse[Show])
async def update_show(
    show_id: str,
    show_update: ShowUpdate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Update a show"""
    update_data = {k: v for k, v in show_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.shows.update_one(
        {"_id": ObjectId(show_id), "creator_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Show not found")
    
    updated_show = await db.shows.find_one({"_id": ObjectId(show_id)})
    return StandardResponse(
        success=True,
        message="Show updated successfully",
        data=Show(**updated_show)
    )

@router.delete("/shows/{show_id}", response_model=StandardResponse[dict])
async def delete_show(
    show_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Delete a show"""
    show = await db.shows.find_one({
        "_id": ObjectId(show_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    result = await db.shows.delete_one({"_id": ObjectId(show_id)})
    
    # Update tour show count
    if show.get("tour_id"):
        await db.tours.update_one(
            {"_id": show["tour_id"]},
            {"$inc": {"show_count": -1}}
        )
    
    return StandardResponse(
        success=True,
        message="Show deleted successfully",
        data={"deleted_id": show_id}
    )

# Tour Budget and Expense Tracking
@router.get("/{tour_id}/budget", response_model=StandardResponse[dict])
async def get_tour_budget(
    tour_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get tour budget and expense summary"""
    tour = await db.tours.find_one({
        "_id": ObjectId(tour_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Get all shows for this tour to calculate actual expenses
    shows = await db.shows.find({"tour_id": ObjectId(tour_id)}).to_list(length=None)
    
    total_show_expenses = 0
    total_revenue = 0
    
    for show in shows:
        if show.get("financials"):
            expenses = show["financials"].get("expenses", {})
            total_show_expenses += sum(expenses.values())
            
            if show["financials"].get("actual_payout"):
                total_revenue += show["financials"]["actual_payout"]
    
    budget_data = {
        "budget": tour.get("budget", {}),
        "total_revenue": total_revenue,
        "total_expenses": total_show_expenses,
        "profit_loss": total_revenue - total_show_expenses,
        "show_count": len(shows)
    }
    
    return StandardResponse(
        success=True,
        message="Budget data retrieved successfully",
        data=budget_data
    )

@router.put("/{tour_id}/budget", response_model=StandardResponse[Tour])
async def update_tour_budget(
    tour_id: str,
    budget_data: dict,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Update tour budget"""
    result = await db.tours.update_one(
        {"_id": ObjectId(tour_id), "creator_id": ObjectId(current_user.id)},
        {"$set": {"budget": budget_data, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    updated_tour = await db.tours.find_one({"_id": ObjectId(tour_id)})
    return StandardResponse(
        success=True,
        message="Budget updated successfully",
        data=Tour(**updated_tour)
    )

# Logistics and Route Planning
@router.get("/{tour_id}/logistics", response_model=StandardResponse[dict])
async def get_tour_logistics(
    tour_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get tour logistics overview"""
    tour = await db.tours.find_one({
        "_id": ObjectId(tour_id),
        "creator_id": ObjectId(current_user.id)
    })
    
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Get shows with venue information
    pipeline = [
        {"$match": {"tour_id": ObjectId(tour_id)}},
        {"$lookup": {
            "from": "venues",
            "localField": "venue_id",
            "foreignField": "_id",
            "as": "venue"
        }},
        {"$unwind": "$venue"},
        {"$sort": {"date": 1}}
    ]
    
    shows_with_venues = await db.shows.aggregate(pipeline).to_list(length=None)
    
    total_distance = 0
    total_travel_time = 0
    
    for show in shows_with_venues:
        if show.get("logistics"):
            if show["logistics"].get("travel_distance_miles"):
                total_distance += show["logistics"]["travel_distance_miles"]
            if show["logistics"].get("travel_time_hours"):
                total_travel_time += show["logistics"]["travel_time_hours"]
    
    logistics_data = {
        "total_distance_miles": total_distance,
        "total_travel_time_hours": total_travel_time,
        "show_count": len(shows_with_venues),
        "shows": shows_with_venues,
        "crew_members": tour.get("crew_members", []),
        "equipment_list": tour.get("equipment_list", [])
    }
    
    return StandardResponse(
        success=True,
        message="Logistics data retrieved successfully",
        data=logistics_data
    )