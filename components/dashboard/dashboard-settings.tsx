"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings, Palette, Bell, Zap } from "lucide-react"

export function DashboardSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    compactMode: false,
    enableAnimations: true,
    autoRefresh: true,
    enableNotifications: true,
  })

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="fixed bottom-4 left-4 z-40">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
      <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dashboard Settings
            </span>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Compact Mode</p>
              <p className="text-xs text-muted-foreground">Reduce spacing and use smaller components</p>
            </div>
            <Switch checked={settings.compactMode} onCheckedChange={v => setSettings(s => ({...s, compactMode: v}))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Animations</p>
              <p className="text-xs text-muted-foreground">Show smooth transitions and hover effects</p>
            </div>
            <Switch checked={settings.enableAnimations} onCheckedChange={v => setSettings(s => ({...s, enableAnimations: v}))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto Refresh</p>
              <p className="text-xs text-muted-foreground">Automatically refresh dashboard data</p>
            </div>
            <Switch checked={settings.autoRefresh} onCheckedChange={v => setSettings(s => ({...s, autoRefresh: v}))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">Show deadline and registration reminders</p>
            </div>
            <Switch checked={settings.enableNotifications} onCheckedChange={v => setSettings(s => ({...s, enableNotifications: v}))} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
