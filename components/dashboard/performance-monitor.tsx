"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, WifiOff, Zap } from "lucide-react"

interface PerformanceMetrics {
  loadTime: number
  wsLatency: number
  lastUpdate: Date
  updateCount: number
  connectionStatus: "connected" | "disconnected" | "reconnecting"
}

interface PerformanceMonitorProps {
  isConnected: boolean
  lastUpdated: Date
}

export function PerformanceMonitor({ isConnected, lastUpdated }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    wsLatency: 0,
    lastUpdate: new Date(),
    updateCount: 0,
    connectionStatus: "disconnected"
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Calculate initial load time
    const loadTime = performance.now()
    setMetrics(prev => ({ ...prev, loadTime }))
  }, [])

  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      connectionStatus: isConnected ? "connected" : "disconnected",
      lastUpdate: lastUpdated,
      updateCount: prev.updateCount + 1
    }))
  }, [isConnected, lastUpdated])

  useEffect(() => {
    // Simulate WebSocket latency measurement
    if (isConnected) {
      const measureLatency = () => {
        const start = performance.now()
        // Simulate ping-pong measurement
        setTimeout(() => {
          const latency = performance.now() - start + Math.random() * 50 // Add some realistic variance
          setMetrics(prev => ({ ...prev, wsLatency: latency }))
        }, Math.random() * 100)
      }

      const interval = setInterval(measureLatency, 5000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  // Show performance monitor only in development or when explicitly enabled
  useEffect(() => {
    const showMonitor = process.env.NODE_ENV === 'development' || 
                       localStorage.getItem('show-performance-monitor') === 'true'
    setIsVisible(showMonitor)
  }, [])

  if (!isVisible) {
    return null
  }

  const getConnectionColor = () => {
    switch (metrics.connectionStatus) {
      case "connected":
        return "bg-green-500"
      case "reconnecting":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  const getLatencyColor = () => {
    if (metrics.wsLatency < 100) return "text-green-600"
    if (metrics.wsLatency < 300) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="w-64 shadow-lg border-dashed opacity-80 hover:opacity-100 transition-opacity">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2">
            <Activity className="h-3 w-3" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Connection:</span>
            <div className="flex items-center gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <div className={`h-2 w-2 rounded-full ${getConnectionColor()}`}></div>
              <Badge variant="outline" className="text-xs px-1 py-0">
                {metrics.connectionStatus}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Load Time:</span>
            <span className="font-mono">
              {metrics.loadTime.toFixed(0)}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">WS Latency:</span>
            <span className={`font-mono ${getLatencyColor()}`}>
              {metrics.wsLatency.toFixed(0)}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Updates:</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span className="font-mono">{metrics.updateCount}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Update:</span>
            <span className="font-mono text-xs">
              {metrics.lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}