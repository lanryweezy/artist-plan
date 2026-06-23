# PowerShell Health Check Script
param(
    [string]$FrontendUrl = "http://localhost:3000",
    [string]$BackendUrl = "http://localhost:8000",
    [int]$MaxRetries = 30,
    [int]$RetryInterval = 5
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

function Test-ServiceHealth($ServiceName, $Url) {
    $retries = 0
    Write-ColorOutput $Yellow "Checking $ServiceName at $Url"
    
    while ($retries -lt $MaxRetries) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput $Green "✅ $ServiceName is healthy"
                return $true
            }
        } catch {
            Write-ColorOutput $Yellow "⏳ $ServiceName not ready, retrying in ${RetryInterval}s... ($retries/$MaxRetries)"
            Start-Sleep -Seconds $RetryInterval
            $retries++
        }
    }
    
    Write-ColorOutput $Red "❌ $ServiceName health check failed after $MaxRetries attempts"
    return $false
}

Write-ColorOutput $Yellow "🏥 Starting health checks"

# Check backend health
if (-not (Test-ServiceHealth "Backend API" "$BackendUrl/health")) {
    exit 1
}

# Check frontend health
if (-not (Test-ServiceHealth "Frontend" $FrontendUrl)) {
    exit 1
}

# Check database connectivity
Write-ColorOutput $Yellow "🗃️  Checking database connectivity"
try {
    $dbCheck = docker-compose exec -T backend python -c @"
import asyncio
from database import get_database
async def test_db():
    db = await get_database()
    result = await db.command('ping')
    print('Database ping successful:', result)
asyncio.run(test_db())
"@
    Write-ColorOutput $Green "✅ Database is accessible"
} catch {
    Write-ColorOutput $Red "❌ Database connectivity check failed"
    exit 1
}

# Check Redis connectivity
Write-ColorOutput $Yellow "🔴 Checking Redis connectivity"
try {
    $redisCheck = docker-compose exec -T redis redis-cli ping
    if ($redisCheck -eq "PONG") {
        Write-ColorOutput $Green "✅ Redis is accessible"
    } else {
        throw "Redis ping failed"
    }
} catch {
    Write-ColorOutput $Red "❌ Redis connectivity check failed"
    exit 1
}

# Check API endpoints
Write-ColorOutput $Yellow "🔌 Checking critical API endpoints"

# Test authentication endpoint
if (-not (Test-ServiceHealth "Auth endpoint" "$BackendUrl/api/auth/health")) {
    exit 1
}

Write-ColorOutput $Green "🎉 All health checks passed successfully!"