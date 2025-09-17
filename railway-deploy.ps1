# 🚀 Artist Plan MVP Deployment Script (PowerShell)
# This script helps you deploy your MVP to Railway quickly

Write-Host "🎵 Artist Plan MVP Deployment" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if Railway CLI is installed
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
railway login

# Create new project
Write-Host "🏗️  Creating Railway project..." -ForegroundColor Yellow
railway project new

# Deploy backend
Write-Host "🚀 Deploying backend..." -ForegroundColor Yellow
Set-Location backend
railway up

# Get the deployed URL
Write-Host "📋 Getting deployment URL..." -ForegroundColor Yellow
$BACKEND_URL = railway domain
Write-Host "✅ Backend deployed at: $BACKEND_URL" -ForegroundColor Green

# Go back to root
Set-Location ..

# Deploy frontend (if you want everything on Railway)
Write-Host "🎨 Deploying frontend..." -ForegroundColor Yellow
railway up

# Get frontend URL
$FRONTEND_URL = railway domain
Write-Host "✅ Frontend deployed at: $FRONTEND_URL" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "Backend:  $BACKEND_URL" -ForegroundColor Cyan
Write-Host "Frontend: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Add MongoDB and Redis databases in Railway dashboard"
Write-Host "2. Update environment variables"
Write-Host "3. Test your application"
Write-Host "4. Set up custom domain (optional)"
Write-Host ""
Write-Host "💰 Cost: FREE for 3+ months with Railway's `$5/month credit!" -ForegroundColor Green
