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

## 🛡️ The Protector: Zero Trust Security Model

Artist Plan is built with a **Zero Trust** architecture, ensuring every request is verified and sanitized.

*   **Anomaly Detection:** Real-time rate limiting and pressure simulation detection.
*   **Injection Protection:** Deep sanitization of queries to block NoSQL and SQL injection vectors.
*   **Secure Handshake:** Enforced TLS 1.3+ headers and strict Content Security Policy (CSP).
*   **Network Segmentation:** Middleware-driven sector isolation for auto-login and session integrity.
*   **Pressure Tested:** Includes `scripts/pressure_test.py` to simulate real-world attacks and high-load scenarios.

## 🚀 Optimized for Vercel Deployment

*   **Edge Middleware:** Global request filtering and authentication at the edge.
*   **Standalone Build:** Optimized `standalone` output for maximum performance.
*   **Security Headers:** Pre-configured `vercel.json` and `next.config.js` with hardened headers.
*   **API Rewrites:** Transparent proxying to backend services with zero CORS issues.
