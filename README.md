# Artist Plan

A comprehensive music artist management platform built with Next.js 14, FastAPI, and MongoDB.

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **Framer Motion** for animations
- **TanStack Query** for state management
- **Zustand** for client-side state
- **React Hook Form** with **Zod** validation

### Backend
- **FastAPI** (Python)
- **MongoDB** with **Motor** (async driver)
- **Redis** for caching and sessions
- **Pydantic** for data validation
- **JWT** authentication

### Infrastructure
- **Docker** for development environment
- **Docker Compose** for service orchestration

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker and Docker Compose

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd artist-plan
   ```

2. **Run setup script**
   
   On Linux/Mac:
   ```bash
   chmod +x setup-dev.sh
   ./setup-dev.sh
   ```
   
   On Windows:
   ```cmd
   setup-dev.bat
   ```

3. **Start development servers**
   
   Option A - Using Docker (Recommended):
   ```bash
   docker-compose up
   ```
   
   Option B - Manual:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   python main.py
   
   # Terminal 3 - Services
   docker-compose up mongodb redis
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Mongo Express**: http://localhost:8081

## Project Structure

```
artist-plan/
├── app/                    # Next.js app directory
├── backend/               # FastAPI backend
│   ├── models/           # Pydantic models
│   ├── routers/          # API routes
│   ├── main.py           # FastAPI app
│   ├── database.py       # MongoDB connection
│   └── redis_client.py   # Redis client
├── components/           # React components (future)
├── lib/                  # Utility functions (future)
├── docker-compose.yml    # Docker services
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and `backend/.env.example` to `backend/.env`, then update the values as needed.

## Development

The project is set up with hot reloading for both frontend and backend development. Changes to the code will automatically restart the servers.

## Next Steps

This is the initial project setup. The next tasks will implement:
- Authentication system
- Database models and schemas
- Core API endpoints
- Frontend components and pages
- AI integration features
