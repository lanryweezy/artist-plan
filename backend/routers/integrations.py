"""Integration management router for platform connections"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import httpx
import os

from models.integration import (
    Integration, IntegrationCreate, IntegrationUpdate, IntegrationInDB,
    StreamingData, SocialMediaData, IntegrationType, IntegrationStatus,
    SyncConfiguration
)
from models.user import User
from services.integration_service import IntegrationService
from services.platform_services import SpotifyService, InstagramService, TwitterService
from routers.auth import get_current_user
from middleware.error_handler import APIError

router = APIRouter()
integration_service = IntegrationService()
spotify_service = SpotifyService()
instagram_service = InstagramService()
twitter_service = TwitterService()

@router.get("/", response_model=List[Integration])
async def get_user_integrations(
    current_user: User = Depends(get_current_user),
    integration_type: Optional[IntegrationType] = None,
    status: Optional[IntegrationStatus] = None
):
    """Get all integrations for the current user"""
    try:
        integrations = await integration_service.get_user_integrations(
            user_id=current_user.id,
            integration_type=integration_type,
            status=status
        )
        return integrations
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch integrations: {str(e)}"
        )

@router.get("/{integration_id}", response_model=Integration)
async def get_integration(
    integration_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific integration by ID"""
    try:
        integration = await integration_service.get_integration(
            integration_id=integration_id,
            user_id=current_user.id
        )
        if not integration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Integration not found"
            )
        return integration
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch integration: {str(e)}"
        )

@router.post("/", response_model=Integration)
async def create_integration(
    integration_data: IntegrationCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Create a new platform integration"""
    try:
        # Validate platform-specific requirements
        await _validate_platform_credentials(integration_data.platform, integration_data.credentials)
        
        integration = await integration_service.create_integration(
            user_id=current_user.id,
            integration_data=integration_data
        )
        
        # Start initial sync in background
        background_tasks.add_task(
            _perform_initial_sync,
            integration.id,
            integration.platform
        )
        
        return integration
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create integration: {str(e)}"
        )

@router.put("/{integration_id}", response_model=Integration)
async def update_integration(
    integration_id: str,
    integration_data: IntegrationUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update an existing integration"""
    try:
        integration = await integration_service.update_integration(
            integration_id=integration_id,
            user_id=current_user.id,
            integration_data=integration_data
        )
        if not integration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Integration not found"
            )
        return integration
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update integration: {str(e)}"
        )

@router.delete("/{integration_id}")
async def delete_integration(
    integration_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an integration and all associated data"""
    try:
        success = await integration_service.delete_integration(
            integration_id=integration_id,
            user_id=current_user.id
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Integration not found"
            )
        return {"message": "Integration deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete integration: {str(e)}"
        )

@router.post("/{integration_id}/sync")
async def trigger_sync(
    integration_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Manually trigger a sync for an integration"""
    try:
        integration = await integration_service.get_integration(
            integration_id=integration_id,
            user_id=current_user.id
        )
        if not integration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Integration not found"
            )
        
        if integration.status != IntegrationStatus.CONNECTED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Integration must be connected to sync"
            )
        
        # Start sync in background
        background_tasks.add_task(
            _perform_sync,
            integration_id,
            integration.platform
        )
        
        return {"message": "Sync started", "integration_id": integration_id}
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger sync: {str(e)}"
        )

@router.get("/{integration_id}/data/streaming")
async def get_streaming_data(
    integration_id: str,
    current_user: User = Depends(get_current_user),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0
):
    """Get streaming data for an integration"""
    try:
        data = await integration_service.get_streaming_data(
            integration_id=integration_id,
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
            offset=offset
        )
        return data
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch streaming data: {str(e)}"
        )

@router.get("/{integration_id}/data/social")
async def get_social_media_data(
    integration_id: str,
    current_user: User = Depends(get_current_user),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0
):
    """Get social media data for an integration"""
    try:
        data = await integration_service.get_social_media_data(
            integration_id=integration_id,
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
            offset=offset
        )
        return data
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch social media data: {str(e)}"
        )

# OAuth endpoints for platform connections
@router.get("/oauth/{platform}/authorize")
async def get_oauth_url(
    platform: str,
    current_user: User = Depends(get_current_user)
):
    """Get OAuth authorization URL for a platform"""
    try:
        if platform == "spotify":
            auth_url = await spotify_service.get_authorization_url(current_user.id)
        elif platform == "instagram":
            auth_url = await instagram_service.get_authorization_url(current_user.id)
        elif platform == "twitter":
            auth_url = await twitter_service.get_authorization_url(current_user.id)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Platform '{platform}' not supported"
            )
        
        return {"authorization_url": auth_url}
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get OAuth URL: {str(e)}"
        )

@router.post("/oauth/{platform}/callback")
async def oauth_callback(
    platform: str,
    code: str,
    state: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Handle OAuth callback and create integration"""
    try:
        if platform == "spotify":
            integration = await spotify_service.handle_callback(
                code=code,
                state=state,
                user_id=current_user.id
            )
        elif platform == "instagram":
            integration = await instagram_service.handle_callback(
                code=code,
                state=state,
                user_id=current_user.id
            )
        elif platform == "twitter":
            integration = await twitter_service.handle_callback(
                code=code,
                state=state,
                user_id=current_user.id
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Platform '{platform}' not supported"
            )
        
        # Start initial sync in background
        background_tasks.add_task(
            _perform_initial_sync,
            integration.id,
            platform
        )
        
        return integration
    except HTTPException:
        raise
    except Exception as e:
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback failed: {str(e)}"
        )

# Helper functions
async def _validate_platform_credentials(platform: str, credentials: dict):
    """Validate platform-specific credentials"""
    if platform == "spotify":
        if not credentials.get("access_token"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Spotify integration requires access_token"
            )
    elif platform in ["instagram", "twitter"]:
        if not credentials.get("access_token"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{platform.title()} integration requires access_token"
            )

async def _perform_initial_sync(integration_id: str, platform: str):
    """Perform initial data sync for a new integration"""
    try:
        if platform == "spotify":
            await spotify_service.sync_data(integration_id)
        elif platform == "instagram":
            await instagram_service.sync_data(integration_id)
        elif platform == "twitter":
            await twitter_service.sync_data(integration_id)
    except Exception as e:
        # Log error and update integration status
        await integration_service.update_sync_error(integration_id, str(e))

async def _perform_sync(integration_id: str, platform: str):
    """Perform data sync for an existing integration"""
    try:
        await integration_service.update_sync_status(integration_id, "syncing")
        
        if platform == "spotify":
            await spotify_service.sync_data(integration_id)
        elif platform == "instagram":
            await instagram_service.sync_data(integration_id)
        elif platform == "twitter":
            await twitter_service.sync_data(integration_id)
        
        await integration_service.update_sync_status(integration_id, "connected")
    except Exception as e:
        await integration_service.update_sync_error(integration_id, str(e))