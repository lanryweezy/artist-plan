# PowerShell Deployment Script for Artist Plan
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("staging", "production")]
    [string]$Environment = "staging"
)

# Colors for output
$Red = [System.ConsoleColor]::Red
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow

function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput $Green "🚀 Starting deployment for $Environment environment"

# Configuration
$DockerComposeFile = "docker-compose.prod.yml"
$MonitoringComposeFile = "monitoring/docker-compose.monitoring.yml"
$EnvFile = ".env.$Environment"

# Check if required files exist
if (-not (Test-Path $DockerComposeFile)) {
    Write-ColorOutput $Red "❌ Docker compose file not found: $DockerComposeFile"
    exit 1
}

if (-not (Test-Path $EnvFile)) {
    Write-ColorOutput $Red "❌ Environment file not found: $EnvFile"
    exit 1
}

# Load environment variables
Write-ColorOutput $Yellow "📋 Loading environment variables"
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Pre-deployment checks
Write-ColorOutput $Yellow "🔍 Running pre-deployment checks"

# Check Docker
try {
    docker --version | Out-Null
} catch {
    Write-ColorOutput $Red "❌ Docker is not installed or not accessible"
    exit 1
}

# Check Docker Compose
try {
    docker-compose --version | Out-Null
} catch {
    Write-ColorOutput $Red "❌ Docker Compose is not installed or not accessible"
    exit 1
}

# Check if services are running
Write-ColorOutput $Yellow "🔄 Checking current services"
$runningServices = docker-compose -f $DockerComposeFile ps --services --filter "status=running"
if ($runningServices) {
    Write-ColorOutput $Yellow "⚠️  Services are currently running. Stopping them..."
    docker-compose -f $DockerComposeFile down
}

# Pull latest images
Write-ColorOutput $Yellow "📥 Pulling latest images"
docker-compose -f $DockerComposeFile pull

# Build images
Write-ColorOutput $Yellow "🔨 Building images"
docker-compose -f $DockerComposeFile build --no-cache

# Database backup (production only)
if ($Environment -eq "production") {
    Write-ColorOutput $Yellow "💾 Creating database backup"
    & ".\scripts\backup-db.ps1"
}

# Start services
Write-ColorOutput $Yellow "🚀 Starting services"
docker-compose -f $DockerComposeFile up -d

# Wait for services to be healthy
Write-ColorOutput $Yellow "⏳ Waiting for services to be healthy"
Start-Sleep -Seconds 30

# Health checks
Write-ColorOutput $Yellow "🏥 Running health checks"
& ".\scripts\health-check.ps1"

# Start monitoring (if production)
if ($Environment -eq "production") {
    Write-ColorOutput $Yellow "📊 Starting monitoring stack"
    docker-compose -f $MonitoringComposeFile up -d
}

# Cleanup old images
Write-ColorOutput $Yellow "🧹 Cleaning up old images"
docker image prune -f

Write-ColorOutput $Green "✅ Deployment completed successfully!"
Write-ColorOutput $Green "🌐 Application is available at: $env:NEXT_PUBLIC_API_URL"

# Display service status
Write-ColorOutput $Yellow "📊 Service Status:"
docker-compose -f $DockerComposeFile ps