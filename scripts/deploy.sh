#!/bin/bash

# Deployment Script for Artist Plan
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
MONITORING_COMPOSE_FILE="monitoring/docker-compose.monitoring.yml"

echo -e "${GREEN}🚀 Starting deployment for ${ENVIRONMENT} environment${NC}"

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Check if required files exist
if [[ ! -f "$DOCKER_COMPOSE_FILE" ]]; then
    echo -e "${RED}❌ Docker compose file not found: $DOCKER_COMPOSE_FILE${NC}"
    exit 1
fi

if [[ ! -f ".env.${ENVIRONMENT}" ]]; then
    echo -e "${RED}❌ Environment file not found: .env.${ENVIRONMENT}${NC}"
    exit 1
fi

# Load environment variables
echo -e "${YELLOW}📋 Loading environment variables${NC}"
export $(cat .env.${ENVIRONMENT} | xargs)

# Pre-deployment checks
echo -e "${YELLOW}🔍 Running pre-deployment checks${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

# Check if services are running
echo -e "${YELLOW}🔄 Checking current services${NC}"
if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
    echo -e "${YELLOW}⚠️  Services are currently running. Stopping them...${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE down
fi

# Pull latest images
echo -e "${YELLOW}📥 Pulling latest images${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE pull

# Build images
echo -e "${YELLOW}🔨 Building images${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache

# Database backup (production only)
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${YELLOW}💾 Creating database backup${NC}"
    ./scripts/backup-db.sh
fi

# Start services
echo -e "${YELLOW}🚀 Starting services${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy${NC}"
sleep 30

# Health checks
echo -e "${YELLOW}🏥 Running health checks${NC}"
./scripts/health-check.sh

# Start monitoring (if not already running)
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${YELLOW}📊 Starting monitoring stack${NC}"
    docker-compose -f $MONITORING_COMPOSE_FILE up -d
fi

# Run database migrations
echo -e "${YELLOW}🗃️  Running database migrations${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE exec backend python -m alembic upgrade head

# Cleanup old images
echo -e "${YELLOW}🧹 Cleaning up old images${NC}"
docker image prune -f

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is available at: ${NEXT_PUBLIC_API_URL}${NC}"

# Display service status
echo -e "${YELLOW}📊 Service Status:${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE ps