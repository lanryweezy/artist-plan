"use client"

import { useState, useEffect } from "react"
import { useWebSocket } from "./use-websocket"

export interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  completedTasks: number
  totalTasks: number
  monthlyIncome: number
  monthlyExpenses: number
  upcomingDeadlines: number
  recentActivities: number
  activeCollaborators: number
  contentItems: number
  streamingPlays: number
  socialFollowers: number
}

export interface DashboardData {
  metrics: DashboardMetrics
  lastUpdated: Date
}

// Mock initial data
const mockInitialData: DashboardData = {
  metrics: {
    totalProjects: 8,
    activeProjects: 3,
    completedTasks: 24,
    totalTasks: 51,
    monthlyIncome: 2500,
    monthlyExpenses: 1400,
    upcomingDeadlines: 5,
    recentActivities: 12,
    activeCollaborators: 4,
    contentItems: 28,
    streamingPlays: 15420,
    socialFollowers: 2340
  },
  lastUpdated: new Date()
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(mockInitialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { isConnected, on, emit } = useWebSocket({
    onConnect: () => {
      // Dashboard WebSocket connected
      // Request initial dashboard data
      emit("dashboard:subscribe")
    },
    onError: (err) => {
      // Dashboard WebSocket error
      setError(err)
    }
  })

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isConnected) return

    // Listen for real-time dashboard updates
    const unsubscribeMetrics = on("dashboard:metrics_updated", (data: unknown) => {
      const newMetrics = data as DashboardMetrics;
      setData(prev => ({
        metrics: newMetrics,
        lastUpdated: new Date()
      }))
    })

    const unsubscribeActivity = on("dashboard:activity_added", (activity: any) => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          recentActivities: prev.metrics.recentActivities + 1
        },
        lastUpdated: new Date()
      }))
    })

    const unsubscribeTask = on("dashboard:task_completed", (taskData: any) => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          completedTasks: prev.metrics.completedTasks + 1
        },
        lastUpdated: new Date()
      }))
    })

    const unsubscribeFinancial = on("dashboard:financial_updated", (financialData: any) => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          monthlyIncome: financialData.income || prev.metrics.monthlyIncome,
          monthlyExpenses: financialData.expenses || prev.metrics.monthlyExpenses
        },
        lastUpdated: new Date()
      }))
    })

    const unsubscribeContent = on("dashboard:content_updated", (contentData: any) => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          contentItems: contentData.count || prev.metrics.contentItems
        },
        lastUpdated: new Date()
      }))
    })

    const unsubscribeCollaborators = on("dashboard:collaborators_updated", (collaboratorData: any) => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          activeCollaborators: collaboratorData.count || prev.metrics.activeCollaborators
        },
        lastUpdated: new Date()
      }))
    })

    const unsubscribeStreaming = on("dashboard:streaming_updated", (streamingData: any) => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          streamingPlays: streamingData.plays || prev.metrics.streamingPlays,
          socialFollowers: streamingData.followers || prev.metrics.socialFollowers
        },
        lastUpdated: new Date()
      }))
    })

    return () => {
      unsubscribeMetrics?.()
      unsubscribeActivity?.()
      unsubscribeTask?.()
      unsubscribeFinancial?.()
      unsubscribeContent?.()
      unsubscribeCollaborators?.()
      unsubscribeStreaming?.()
    }
  }, [isConnected, on])

  const refreshData = () => {
    if (isConnected) {
      emit("dashboard:refresh")
    }
  }

  return {
    data,
    isLoading,
    error,
    isConnected,
    refreshData
  }
}