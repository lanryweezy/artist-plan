from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv

from database import connect_to_mongo, close_mongo_connection, get_database
from redis_client import redis_client
from routers import auth, users, projects, tasks, financial, content, websocket, calendar, tour
from services.websocket import get_socketio_app, ws_manager

# Import middleware and error handlers
from middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler,
    api_error_handler,
    starlette_http_exception_handler,
    APIError
)
from middleware.validation import (
    ValidationMiddleware,
    RateLimitMiddleware,
    SecurityHeadersMiddleware
)
from config.openapi import custom_openapi

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await redis_client.connect()
    yield
    # Shutdown
    await close_mongo_connection()
    await redis_client.disconnect()

app = FastAPI(
    title="Artist Plan API",
    description="Music artist management platform API - A comprehensive solution for independent musicians to manage their careers, projects, finances, and marketing efforts.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add custom middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ValidationMiddleware)
app.add_middleware(RateLimitMiddleware, calls=100, period=60)  # 100 calls per minute

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# CORS middleware
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, starlette_http_exception_handler)
app.add_exception_handler(APIError, api_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Set custom OpenAPI schema
app.openapi = lambda: custom_openapi(app)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["User Management"])
app.include_router(projects.router, prefix="/api/projects", tags=["Project Management"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Task Management"])
app.include_router(financial.router, prefix="/api/financial", tags=["Financial Management"])
app.include_router(content.router, prefix="/api/content", tags=["Content Management"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar Management"])
app.include_router(tour.router, prefix="/api/tours", tags=["Tour Management"])
app.include_router(websocket.router, prefix="/api/ws", tags=["WebSocket"])

@app.get("/", tags=["System"])
async def root():
    """Root endpoint - API status"""
    return {
        "message": "Artist Plan API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        db = get_database()
        await db.command("ping")
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"
    
    try:
        # Check Redis connection
        await redis_client.ping()
        redis_status = "healthy"
    except Exception:
        redis_status = "unhealthy"
    
    overall_status = "healthy" if db_status == "healthy" and redis_status == "healthy" else "unhealthy"
    
    return {
        "status": overall_status,
        "services": {
            "database": db_status,
            "redis": redis_status
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/info", tags=["System"])
async def api_info():
    """API information endpoint"""
    return {
        "name": "Artist Plan API",
        "version": "1.0.0",
        "description": "Music artist management platform API",
        "endpoints": {
            "authentication": "/api/auth",
            "users": "/api/users", 
            "projects": "/api/projects",
            "tasks": "/api/tasks",
            "financial": "/api/financial",
            "content": "/api/content",
            "calendar": "/api/calendar",
            "tours": "/api/tours"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        }
    }

# Mount Socket.IO app for WebSocket support
socketio_app = get_socketio_app()
app.mount("/socket.io", socketio_app)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )