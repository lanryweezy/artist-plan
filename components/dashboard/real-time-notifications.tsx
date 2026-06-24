"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle, AlertTriangle, Info, DollarSign } from "lucide-react"

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

const mockNotifications: Notification[] = [
  { id: "1", type: "warning", title: "Registration Missing", message: "You haven't registered with the MLC yet. This means uncollected streaming mechanical royalties.", timestamp: new Date(), read: false, actionable: true, action: { label: "Register Now", href: "/rights" } },
  { id: "2", type: "info", title: "Release Approaching", message: "Your single 'Midnight Dreams' is set to release in 5 days.", timestamp: new Date(), read: false, actionable: true, action: { label: "View Release", href: "/releases" } },
  { id: "3", type: "success", title: "Copyright Registered", message: "Your composition 'Electric Sunset' has been registered.", timestamp: new Date(), read: false },
  { id: "4", type: "financial", title: "Royalty Statement", message: "Your Q2 royalty statement is ready for review.", timestamp: new Date(), read: true, actionable: true, action: { label: "View Royalties", href: "/royalties" } },
]

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isVisible, setIsVisible] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4" />
      case "warning": return <AlertTriangle className="h-4 w-4" />
      case "info": return <Info className="h-4 w-4" />
      case "financial": return <DollarSign className="h-4 w-4" />
    }
  }

  const dismiss = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (!isVisible && unreadCount === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {isVisible && notifications.filter(n => !n.read).slice(0, 3).map(notification => (
        <div key={notification.id} className="bg-card border rounded-lg shadow-lg p-4 border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-full">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.title}</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => dismiss(notification.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              {notification.actionable && notification.action && (
                <Button size="sm" variant="outline" className="mt-2 h-6 text-xs" onClick={() => { dismiss(notification.id); window.location.href = notification.action!.href; }}>
                  {notification.action.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
      {unreadCount > 0 && !isVisible && (
        <Button size="sm" variant="outline" onClick={() => setIsVisible(true)} className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs">{unreadCount}</Badge>
        </Button>
      )}
    </div>
  )
}
