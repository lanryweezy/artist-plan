"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Wifi, WifiOff, Settings } from "lucide-react"

interface DashboardHeaderProps {
  isConnected: boolean
  onRefresh: () => void
  lastUpdated: Date
}

export function DashboardHeader({ isConnected, onRefresh, lastUpdated }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your music career.
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className="text-xs"
          >
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </div>

        {/* Last Updated */}
        <span className="text-xs text-muted-foreground hidden sm:block">
          Updated {lastUpdated.toLocaleTimeString()}
        </span>

        {/* Refresh Button */}
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        {/* Settings Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </div>
    </div>
  )
}