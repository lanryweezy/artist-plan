"use client"

import { useState, useEffect } from "react"

interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  monthlyIncome: number
  monthlyExpenses: number
  upcomingDeadlines: number
  activeCollaborators: number
  contentItems: number
}

interface DashboardData {
  metrics: DashboardMetrics
  recentActivity: Array<{ id: string; type: string; title: string; time: string }>
  upcomingDeadlines: Array<{ id: string; title: string; date: string; type: string }>
  lastUpdated: Date
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    metrics: {
      totalProjects: 8,
      activeProjects: 5,
      totalTasks: 42,
      completedTasks: 28,
      monthlyIncome: 4500,
      monthlyExpenses: 1200,
      upcomingDeadlines: 3,
      activeCollaborators: 4,
      contentItems: 28,
    },
    recentActivity: [
      { id: "1", type: "task", title: "Mixed new single", time: "2 hours ago" },
      { id: "2", type: "project", title: "Album artwork finalized", time: "5 hours ago" },
      { id: "3", type: "finance", title: "Sync placement fee received", time: "1 day ago" },
    ],
    upcomingDeadlines: [
      { id: "1", title: "Submit to playlist curators", date: "2026-06-25", type: "marketing" },
      { id: "2", title: "Master recording due", date: "2026-06-28", type: "recording" },
      { id: "3", title: "Copyright registration", date: "2026-07-01", type: "legal" },
    ],
    lastUpdated: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setData((prev) => ({ ...prev, lastUpdated: new Date() }))
      setIsLoading(false)
    }, 500)
  }

  return { data, isLoading, error, isConnected, refreshData }
}
