"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { 
  Settings, 
  Monitor, 
  Bell, 
  Palette, 
  Zap, 
  RefreshCw,
  Eye,
  Volume2,
  Smartphone
} from "lucide-react"
import { useDashboardContext } from "@/contexts/dashboard-context"
import { dashboardConfig } from "@/config/dashboard"

interface SettingsSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  settings: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description: string
  type: 'switch' | 'slider' | 'select'
  value: boolean | number | string
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
}

export function DashboardSettings() {
  const { state, updateSettings } = useDashboardContext()
  const [isOpen, setIsOpen] = useState(false)

  const settingsSections: SettingsSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          id: 'compactMode',
          label: 'Compact Mode',
          description: 'Reduce spacing and use smaller components',
          type: 'switch',
          value: state.settings.compactMode
        },
        {
          id: 'enableAnimations',
          label: 'Enable Animations',
          description: 'Show smooth transitions and hover effects',
          type: 'switch',
          value: state.settings.enableAnimations
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: Zap,
      settings: [
        {
          id: 'showPerformanceMonitor',
          label: 'Performance Monitor',
          description: 'Show real-time performance metrics',
          type: 'switch',
          value: state.settings.showPerformanceMonitor
        },
        {
          id: 'autoRefresh',
          label: 'Auto Refresh',
          description: 'Automatically refresh dashboard data',
          type: 'switch',
          value: state.settings.autoRefresh
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'enableRealTime',
          label: 'Real-time Notifications',
          description: 'Show live notifications as they happen',
          type: 'switch',
          value: dashboardConfig.notifications.enableRealTime
        },
        {
          id: 'enableSound',
          label: 'Sound Notifications',
          description: 'Play sound for important notifications',
          type: 'switch',
          value: dashboardConfig.notifications.enableSound
        },
        {
          id: 'enableDesktop',
          label: 'Desktop Notifications',
          description: 'Show browser notifications',
          type: 'switch',
          value: dashboardConfig.notifications.enableDesktop
        }
      ]
    }
  ]

  const handleSettingChange = (sectionId: string, settingId: string, value: boolean | number | string) => {
    if (sectionId === 'appearance' || sectionId === 'performance') {
      updateSettings({ [settingId]: value })
    }
    // Handle other sections as needed
  }

  const resetToDefaults = () => {
    updateSettings({
      compactMode: false,
      enableAnimations: true,
      autoRefresh: true,
      showPerformanceMonitor: dashboardConfig.performance.enableMonitoring,
    })
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40"
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dashboard Settings
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <section.icon className="h-4 w-4" />
                <h3 className="font-medium">{section.title}</h3>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">{setting.label}</label>
                        {setting.id === 'showPerformanceMonitor' && (
                          <Badge variant="outline" className="text-xs">Dev Only</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    
                    <div className="ml-4">
                      {setting.type === 'switch' && (
                        <Switch
                          checked={setting.value as boolean}
                          onCheckedChange={(checked) => 
                            handleSettingChange(section.id, setting.id, checked)
                          }
                        />
                      )}
                      {setting.type === 'slider' && (
                        <div className="w-24">
                          <Slider
                            value={[setting.value as number]}
                            onValueChange={([value]) => 
                              handleSettingChange(section.id, setting.id, value)
                            }
                            min={setting.min || 0}
                            max={setting.max || 100}
                            step={setting.step || 1}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* System Information */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <h3 className="font-medium">System Information</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Connection Status:</span>
                <Badge variant={state.isConnected ? "default" : "destructive"} className="ml-2">
                  {state.isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Refresh Count:</span>
                <span className="ml-2 font-mono">{state.refreshCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="ml-2 font-mono text-xs">
                  {state.lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Notifications:</span>
                <span className="ml-2 font-mono">{state.notifications.length}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetToDefaults}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}