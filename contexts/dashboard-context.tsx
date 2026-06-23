"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { dashboard } from "@/lib/db"

interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  completedTasks: number
  totalTasks: number
  monthlyIncome: number
  monthlyExpenses: number
  netIncome: number
  upcomingDeadlines: number
  totalStreams: number
}

interface DashboardData {
  metrics: DashboardMetrics
  lastUpdated: Date
}

interface DashboardContextType {
  data: DashboardData
  isLoading: boolean
  error: Error | null
  refreshData: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard must be used within DashboardProvider")
  return context
}

// Mock user ID for demo (replace with Supabase auth when ready)
const DEMO_USER_ID = "demo-user-001"

const defaultMetrics: DashboardMetrics = {
  totalProjects: 8,
  activeProjects: 3,
  completedTasks: 24,
  totalTasks: 51,
  monthlyIncome: 5410,
  monthlyExpenses: 1879,
  netIncome: 3531,
  upcomingDeadlines: 5,
  totalStreams: 45230,
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>({
    metrics: defaultMetrics,
    lastUpdated: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const stats = await dashboard.getStats(DEMO_USER_ID)
      setData({
        metrics: stats,
        lastUpdated: new Date(),
      })
    } catch (err) {
      console.error("Failed to load dashboard data:", err)
      setError(err instanceof Error ? err : new Error("Failed to load data"))
      // Use mock data as fallback
      setData({
        metrics: defaultMetrics,
        lastUpdated: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <DashboardContext.Provider value={{ data, isLoading, error, refreshData }}>
      {children}
    </DashboardContext.Provider>
  )
}
