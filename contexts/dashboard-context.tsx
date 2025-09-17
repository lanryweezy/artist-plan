"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { useDashboardData } from '@/hooks/use-dashboard-data'

interface DashboardState {
  isLoading: boolean
  error: Error | null
  lastUpdated: Date
  refreshCount: number
  isConnected: boolean
  notifications: Notification[]
  settings: {
    compactMode: boolean
    enableAnimations: boolean
    autoRefresh: boolean
    showPerformanceMonitor: boolean
  }
}

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

type DashboardAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'UPDATE_LAST_UPDATED'; payload: Date }
  | { type: 'INCREMENT_REFRESH_COUNT' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<DashboardState['settings']> }

const initialState: DashboardState = {
  isLoading: true,
  error: null,
  lastUpdated: new Date(),
  refreshCount: 0,
  isConnected: false,
  notifications: [],
  settings: {
    compactMode: dashboardConfig.appearance.compactMode,
    enableAnimations: dashboardConfig.appearance.enableAnimations,
    autoRefresh: dashboardConfig.dataRefresh.enableAutoRefresh,
    showPerformanceMonitor: dashboardConfig.performance.enableMonitoring,
  }
}

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload }
    case 'UPDATE_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload }
    case 'INCREMENT_REFRESH_COUNT':
      return { ...state, refreshCount: state.refreshCount + 1 }
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications.slice(0, dashboardConfig.notifications.maxVisible - 1)]
      }
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    default:
      return state
  }
}

interface DashboardContextType {
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationRead: (id: string) => void
  updateSettings: (settings: Partial<DashboardState['settings']>) => void
  refresh: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const { data, isLoading, error, isConnected, refreshData } = useDashboardData()

  // Sync with dashboard data hook
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: isLoading })
  }, [isLoading])

  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [error])

  useEffect(() => {
    dispatch({ type: 'SET_CONNECTED', payload: isConnected })
  }, [isConnected])

  useEffect(() => {
    if (data) {
      dispatch({ type: 'UPDATE_LAST_UPDATED', payload: data.lastUpdated })
    }
  }, [data])

  // Auto-refresh functionality
  useEffect(() => {
    if (!state.settings.autoRefresh) return

    const interval = setInterval(() => {
      refreshData()
      dispatch({ type: 'INCREMENT_REFRESH_COUNT' })
    }, dashboardConfig.dataRefresh.autoRefreshInterval)

    return () => clearInterval(interval)
  }, [state.settings.autoRefresh, refreshData])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })

    // Auto-remove notification after delay
    if (dashboardConfig.notifications.autoHideDelay > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id })
      }, dashboardConfig.notifications.autoHideDelay)
    }
  }

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
  }

  const updateSettings = (settings: Partial<DashboardState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  }

  const refresh = () => {
    refreshData()
    dispatch({ type: 'INCREMENT_REFRESH_COUNT' })
  }

  const contextValue: DashboardContextType = {
    state,
    dispatch,
    addNotification,
    removeNotification,
    markNotificationRead,
    updateSettings,
    refresh
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}