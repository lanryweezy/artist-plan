#!/bin/bash

# 🚀 Artist Plan MVP Deployment Script
# This script helps you deploy your MVP to Railway quickly

echo "🎵 Artist Plan MVP Deployment"
echo "=============================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Create new project
echo "🏗️  Creating Railway project..."
railway project new

# Deploy backend
echo "🚀 Deploying backend..."
cd backend
railway up

# Get the deployed URL
echo "📋 Getting deployment URL..."
BACKEND_URL=$(railway domain)
echo "✅ Backend deployed at: $BACKEND_URL"

# Go back to root
cd ..

# Deploy frontend (if you want everything on Railway)
echo "🎨 Deploying frontend..."
railway up

# Get frontend URL
FRONTEND_URL=$(railway domain)
echo "✅ Frontend deployed at: $FRONTEND_URL"

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Backend:  $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""
echo "📝 Next steps:"
echo "1. Add MongoDB and Redis databases in Railway dashboard"
echo "2. Update environment variables"
echo "3. Test your application"
echo "4. Set up custom domain (optional)"
echo ""
echo "💰 Cost: FREE for 3+ months with Railway's $5/month credit!"
