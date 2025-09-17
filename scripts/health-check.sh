#!/bin/bash

# Health Check Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}
BACKEND_URL=${BACKEND_URL:-http://localhost:8000}
MAX_RETRIES=30
RETRY_INTERVAL=5

echo -e "${YELLOW}🏥 Starting health checks${NC}"

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local retries=0

    echo -e "${YELLOW}Checking $service_name at $url${NC}"

    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -f -s "$url" > /dev/null; then
            echo -e "${GREEN}✅ $service_name is healthy${NC}"
            return 0
        else
            echo -e "${YELLOW}⏳ $service_name not ready, retrying in ${RETRY_INTERVAL}s... (${retries}/${MAX_RETRIES})${NC}"
            sleep $RETRY_INTERVAL
            retries=$((retries + 1))
        fi
    done

    echo -e "${RED}❌ $service_name health check failed after $MAX_RETRIES attempts${NC}"
    return 1
}

# Check backend health
check_service "Backend API" "$BACKEND_URL/health"

# Check frontend health
check_service "Frontend" "$FRONTEND_URL"

# Check database connectivity
echo -e "${YELLOW}🗃️  Checking database connectivity${NC}"
if docker-compose exec -T backend python -c "
import asyncio
from database import get_database
async def test_db():
    db = await get_database()
    result = await db.command('ping')
    print('Database ping successful:', result)
asyncio.run(test_db())
" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database is accessible${NC}"
else
    echo -e "${RED}❌ Database connectivity check failed${NC}"
    exit 1
fi

# Check Redis connectivity
echo -e "${YELLOW}🔴 Checking Redis connectivity${NC}"
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is accessible${NC}"
else
    echo -e "${RED}❌ Redis connectivity check failed${NC}"
    exit 1
fi

# Check API endpoints
echo -e "${YELLOW}🔌 Checking critical API endpoints${NC}"

# Test authentication endpoint
if curl -f -s "$BACKEND_URL/auth/health" > /dev/null; then
    echo -e "${GREEN}✅ Auth endpoint is accessible${NC}"
else
    echo -e "${RED}❌ Auth endpoint check failed${NC}"
    exit 1
fi

# Test projects endpoint
if curl -f -s "$BACKEND_URL/projects/health" > /dev/null; then
    echo -e "${GREEN}✅ Projects endpoint is accessible${NC}"
else
    echo -e "${RED}❌ Projects endpoint check failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All health checks passed successfully!${NC}"