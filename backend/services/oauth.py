"""OAuth service for Google and Apple sign-in integration"""

import httpx
import os
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
import json

class OAuthService:
    """Service for handling OAuth authentication with Google and Apple"""
    
    def __init__(self):
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.apple_client_id = os.getenv("APPLE_CLIENT_ID")
        self.apple_team_id = os.getenv("APPLE_TEAM_ID")
        self.apple_key_id = os.getenv("APPLE_KEY_ID")
        self.apple_private_key = os.getenv("APPLE_PRIVATE_KEY")
    
    async def verify_google_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Google OAuth token and return user info"""
        if not self.google_client_id:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Google OAuth not configured"
            )
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
                )
                
                if response.status_code != 200:
                    return None
                
                token_info = response.json()
                
                # Verify the token is for our app
                if token_info.get("aud") != self.google_client_id:
                    return None
                
                return {
                    "email": token_info.get("email"),
                    "name": token_info.get("name"),
                    "avatar": token_info.get("picture"),
                    "provider": "google",
                    "provider_id": token_info.get("sub")
                }
                
        except Exception as e:
            print(f"Google token verification error: {e}")
            return None
    
    async def verify_apple_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Apple OAuth token and return user info"""
        if not all([self.apple_client_id, self.apple_team_id, self.apple_key_id, self.apple_private_key]):
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Apple OAuth not configured"
            )
        
        try:
            # Apple token verification is more complex and requires JWT validation
            # This is a simplified implementation - in production, you'd need to:
            # 1. Decode the JWT token
            # 2. Verify the signature using Apple's public keys
            # 3. Validate the claims
            
            # For now, return None to indicate not implemented
            return None
            
        except Exception as e:
            print(f"Apple token verification error: {e}")
            return None

oauth_service = OAuthService()