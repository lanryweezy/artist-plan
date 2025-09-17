# Artist Plan Deployment Guide

## Overview

This guide covers the deployment and DevOps setup for the Artist Plan application, including Docker containerization, CI/CD pipelines, monitoring, and cloud deployment.

## Architecture

- **Frontend**: Next.js 14 deployed to Vercel
- **Backend**: FastAPI deployed to Railway
- **Database**: MongoDB with Redis for caching
- **Monitoring**: Prometheus, Grafana, Loki stack
- **CI/CD**: GitHub Actions with automated testing and deployment

## Quick Start

### Local Development with Docker

```bash
# Start development environment
docker-compose up -d

# Check service status
docker-compose ps
```

### Production Deployment

#### Using PowerShell (Windows)
```powershell
# Deploy to staging
.\scripts\deploy.ps1 -Environment staging

# Deploy to production
.\scripts\deploy.ps1 -Environment production
```

#### Using Bash (Linux/Mac)
```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

## Environment Configuration

### Required Environment Variables

Create `.env.staging` and `.env.production` files with:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.artist-plan.com

# Database
MONGODB_URL=mongodb://admin:password@mongodb:27017/artist_plan
REDIS_URL=redis://:password@redis:6379

# Authentication
JWT_SECRET_KEY=your-secure-secret-key

# AI Services
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key

# OAuth Integrations
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

## CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Tests**: Runs unit, integration, and E2E tests
2. **Security**: Scans for vulnerabilities
3. **Build**: Creates optimized production builds
4. **Deploy**: Deploys to staging/production environments

### Required GitHub Secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RAILWAY_TOKEN
PRODUCTION_API_URL
STAGING_API_URL
SLACK_WEBHOOK
```

## Monitoring Setup

### Start Monitoring Stack

```bash
# Start monitoring services
docker-compose -f monitoring/docker-compose.monitoring.yml up -d
```

### Access Monitoring Tools

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **AlertManager**: http://localhost:9093

## Health Checks

### Manual Health Check

```powershell
# Windows
.\scripts\health-check.ps1

# Linux/Mac
./scripts/health-check.sh
```

### Health Endpoints

- **Backend Health**: `GET /health`
- **Frontend Health**: `GET /`
- **Metrics**: `GET /metrics`

## Backup and Recovery

### Database Backup

```bash
# Create backup
./scripts/backup-db.sh

# Backups are stored in ./backups/ directory
# Production backups are uploaded to S3 (if configured)
```

### Restore from Backup

```bash
# Restore from backup file
docker-compose exec mongodb mongorestore --gzip --archive=backup_file.gz
```

## Security Features

- **HTTPS**: SSL/TLS encryption
- **Rate Limiting**: API request throttling
- **Security Headers**: XSS, CSRF protection
- **Authentication**: JWT with refresh tokens
- **Data Encryption**: At rest and in transit

## Scaling Considerations

### Horizontal Scaling

- **Frontend**: Auto-scaling on Vercel
- **Backend**: Multiple Railway instances with load balancer
- **Database**: MongoDB replica sets
- **Cache**: Redis cluster

### Performance Optimization

- **CDN**: Cloudflare for static assets
- **Caching**: Redis for API responses
- **Database**: Optimized indexes and queries
- **Images**: Next.js image optimization

## Troubleshooting

### Common Issues

1. **Service Won't Start**
   ```bash
   # Check logs
   docker-compose logs service-name
   
   # Restart service
   docker-compose restart service-name
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   docker-compose exec mongodb mongosh --eval "db.runCommand({ping: 1})"
   ```

3. **High Memory Usage**
   ```bash
   # Check resource usage
   docker stats
   
   # Restart services if needed
   docker-compose restart
   ```

### Log Analysis

- **Application Logs**: Available in Grafana via Loki
- **System Logs**: Collected by Promtail
- **Error Tracking**: Structured logging with correlation IDs

## Support

For deployment issues:
1. Check the health endpoints
2. Review application logs in Grafana
3. Verify environment configuration
4. Check GitHub Actions workflow status

## Security Checklist

- [ ] Environment variables are properly secured
- [ ] Database credentials are rotated regularly
- [ ] SSL certificates are valid and auto-renewing
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Monitoring alerts are configured
- [ ] Backup strategy is tested
- [ ] Access logs are monitored