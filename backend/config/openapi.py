from fastapi.openapi.utils import get_openapi
from fastapi import FastAPI

def custom_openapi(app: FastAPI):
    """Generate custom OpenAPI schema"""
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Artist Plan API",
        version="1.0.0",
        description="""
        ## Artist Plan API
        
        A comprehensive music artist management platform API that empowers independent musicians 
        to manage their careers effectively.
        
        ### Features
        
        * **Authentication & User Management** - Secure JWT-based authentication with user profiles
        * **Project Management** - Organize releases, tours, and creative projects
        * **Task Management** - Track progress with Kanban boards and task dependencies
        * **Financial Management** - Monitor income, expenses, and budgets with AI insights
        * **Content Management** - Organize creative assets and marketing materials
        * **AI Integration** - Smart suggestions and automation across all modules
        * **Platform Integrations** - Connect with streaming services, social media, and more
        
        ### Authentication
        
        Most endpoints require authentication. Include the JWT token in the Authorization header:
        ```
        Authorization: Bearer <your-jwt-token>
        ```
        
        ### Error Handling
        
        The API uses standard HTTP status codes and returns structured error responses:
        ```json
        {
            "success": false,
            "error": {
                "code": 400,
                "message": "Error description",
                "type": "validation_error"
            },
            "timestamp": "2024-01-01T00:00:00Z"
        }
        ```
        
        ### Rate Limiting
        
        API requests are limited to 100 calls per minute per IP address.
        """,
        routes=app.routes,
        servers=[
            {"url": "http://localhost:8000", "description": "Development server"},
            {"url": "https://api.artistplan.com", "description": "Production server"}
        ]
    )
    
    # Add security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token obtained from /api/auth/login"
        }
    }
    
    # Add global security requirement
    openapi_schema["security"] = [{"BearerAuth": []}]
    
    # Add custom tags
    openapi_schema["tags"] = [
        {
            "name": "System",
            "description": "System health and information endpoints"
        },
        {
            "name": "Authentication", 
            "description": "User authentication and authorization"
        },
        {
            "name": "User Management",
            "description": "User profile and account management"
        },
        {
            "name": "Project Management",
            "description": "Create and manage music projects, releases, and tours"
        },
        {
            "name": "Task Management", 
            "description": "Task tracking, Kanban boards, and project workflows"
        },
        {
            "name": "Financial Management",
            "description": "Income tracking, expense management, and financial reporting"
        },
        {
            "name": "Content Management",
            "description": "Digital asset organization and content workflows"
        }
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema