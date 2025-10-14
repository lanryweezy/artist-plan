"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle, AlertTriangle, Info, DollarSign } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "financial"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionable?: boolean
  action?: {
    label: string
    href: string
  }
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const { isConnected, on } = useWebSocket({
    onConnect: () => {
      // Notifications WebSocket connected
    }
  })

  useEffect(() => {
    if (!isConnected) return

    // Listen for real-time notifications
    const unsubscribeNotification = on("notification:new", (data: unknown) => {
      const notification = data as Omit<Notification, "id" | "timestamp" | "read">;
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      }
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 most recent
      setIsVisible(true)
      
      // Auto-hide after 5 seconds for non-actionable notifications
      if (!newNotification.actionable) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
        }, 5000)
      }
    })

    // Simulate some real-time notifications for demo
    const simulateNotifications = () => {
      const demoNotifications = [
        {
          type: "success" as const,
          title: "Task Completed",
          message: "Final mix approval has been completed for Winter EP Release",
          actionable: true,
          action: { label: "View Project", href: "/projects/winter-ep" }
        },
        {
          type: "financial" as const,
          title: "Payment Received",
          message: "Streaming royalties of $127.45 received from Spotify",
          actionable: true,
          action: { label: "View Details", href: "/finances" }
        },
        {
          type: "warning" as const,
          title: "Deadline Approaching",
          message: "Music video shoot is due in 2 days",
          actionable: true,
          action: { label: "View Calendar", href: "/calendar" }
        },
        {
          type: "info" as const,
          title: "AI Suggestion",
          message: "New marketing insights available for your upcoming release",
          actionable: true,
          action: { label: "View Insights", href: "/ai" }
        }
      ]

      // Simulate notifications every 10 seconds
      let index = 0
      const interval = setInterval(() => {
        if (index < demoNotifications.length) {
          const notification = demoNotifications[index]
          setNotifications(prev => [{
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false
          }, ...prev.slice(0, 9)])
          setIsVisible(true)
          index++
        } else {
          clearInterval(interval)
        }
      }, 10000)

      return () => clearInterval(interval)
    }

    const cleanup = simulateNotifications()

    return () => {
      unsubscribeNotification?.()
      cleanup()
    }
  }, [isConnected, on])

  const getNotificationIcon = (type: Notification["type"]) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
      financial: DollarSign
    }
    return icons[type]
  }

  const getNotificationColor = (type: Notification["type"]) => {
    const colors = {
      success: "text-green-600 bg-green-50 dark:bg-green-950/20",
      warning: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20",
      info: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
      financial: "text-green-600 bg-green-50 dark:bg-green-950/20"
    }
    return colors[type]
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notification) => {
        const Icon = getNotificationIcon(notification.type)
        
        return (
          <Card key={notification.id} className={`shadow-lg border-l-4 ${
            notification.type === 'success' ? 'border-l-green-500' :
            notification.type === 'warning' ? 'border-l-yellow-500' :
            notification.type === 'financial' ? 'border-l-green-500' :
            'border-l-blue-500'
          } animate-in slide-in-from-right duration-300`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    {notification.actionable && notification.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          markAsRead(notification.id)
                          window.location.href = notification.action!.href
                        }}
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      
      {notifications.length > 3 && (
        <Card className="shadow-lg">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">
              +{notifications.length - 3} more notifications
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs mt-1"
              onClick={() => setIsVisible(false)}
            >
              View All
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}