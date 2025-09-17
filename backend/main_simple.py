from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv

# Import only the routers that exist and work
from routers import auth, users, projects, tasks, financial

load_dotenv()

app = FastAPI(
    title="Artist Plan API",
    description="Music artist management platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["User Management"])
app.include_router(projects.router, prefix="/api/projects", tags=["Project Management"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Task Management"])
app.include_router(financial.router, prefix="/api/financial", tags=["Financial Management"])

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
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )