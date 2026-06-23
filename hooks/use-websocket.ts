"use client"

import { useState, useEffect, useCallback } from "react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
}

export function useWebSocket() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50))
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  useEffect(() => {
    setIsConnected(true)
    return () => setIsConnected(false)
  }, [])

  return { notifications, isConnected, addNotification, dismissNotification }
}
