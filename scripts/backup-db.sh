#!/bin/bash

# Database Backup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR=${BACKUP_DIR:-./backups}
DATABASE_NAME=${DATABASE_NAME:-artist_plan}
MONGO_HOST=${MONGO_HOST:-localhost}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_USERNAME=${MONGO_ROOT_USERNAME:-admin}
MONGO_PASSWORD=${MONGO_ROOT_PASSWORD}
RETENTION_DAYS=${RETENTION_DAYS:-30}

# Create backup directory
mkdir -p $BACKUP_DIR

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/artist_plan_backup_$TIMESTAMP.gz"

echo -e "${YELLOW}💾 Starting database backup${NC}"
echo -e "${YELLOW}📁 Backup location: $BACKUP_FILE${NC}"

# Create MongoDB dump
if docker-compose exec -T mongodb mongodump \
    --host $MONGO_HOST:$MONGO_PORT \
    --username $MONGO_USERNAME \
    --password $MONGO_PASSWORD \
    --db $DATABASE_NAME \
    --authenticationDatabase admin \
    --gzip \
    --archive > $BACKUP_FILE; then
    
    echo -e "${GREEN}✅ Database backup completed successfully${NC}"
    echo -e "${GREEN}📊 Backup size: $(du -h $BACKUP_FILE | cut -f1)${NC}"
else
    echo -e "${RED}❌ Database backup failed${NC}"
    exit 1
fi

# Cleanup old backups
echo -e "${YELLOW}🧹 Cleaning up backups older than $RETENTION_DAYS days${NC}"
find $BACKUP_DIR -name "artist_plan_backup_*.gz" -mtime +$RETENTION_DAYS -delete

# List current backups
echo -e "${YELLOW}📋 Current backups:${NC}"
ls -lh $BACKUP_DIR/artist_plan_backup_*.gz 2>/dev/null || echo "No backups found"

# Upload to cloud storage (if configured)
if [[ -n "$AWS_S3_BUCKET" ]]; then
    echo -e "${YELLOW}☁️  Uploading backup to S3${NC}"
    aws s3 cp $BACKUP_FILE s3://$AWS_S3_BUCKET/backups/
    echo -e "${GREEN}✅ Backup uploaded to S3${NC}"
fi

echo -e "${GREEN}🎉 Backup process completed successfully!${NC}"