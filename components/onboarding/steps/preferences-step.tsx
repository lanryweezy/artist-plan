'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { OnboardingData } from '../onboarding-wizard'
import { Palette, Globe, DollarSign, Bell, Zap } from 'lucide-react'

interface PreferencesStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'JPY', label: 'JPY (¥)' }
]

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
]

const AI_LEVELS = [
  { 
    value: 'low', 
    label: 'Conservative', 
    description: 'Minimal automation, more manual control' 
  },
  { 
    value: 'medium', 
    label: 'Balanced', 
    description: 'Smart suggestions with user approval' 
  },
  { 
    value: 'high', 
    label: 'Aggressive', 
    description: 'Maximum automation and AI assistance' 
  }
]

export function PreferencesStep({ data, onUpdate, onNext, onPrev }: PreferencesStepProps) {
  const [preferences, setPreferences] = useState(data.preferences)

  const updatePreference = (key: string, value: any) => {
    const updatedPreferences = { ...preferences, [key]: value }
    setPreferences(updatedPreferences)
    onUpdate({ preferences: updatedPreferences })
  }

  const updateNotificationPreference = (key: string, value: boolean) => {
    const updatedNotifications = { ...preferences.notifications, [key]: value }
    const updatedPreferences = { ...preferences, notifications: updatedNotifications }
    setPreferences(updatedPreferences)
    onUpdate({ preferences: updatedPreferences })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Customize Your Experience</h2>
        <p className="text-gray-600">
          Set your preferences to make Artist Plan work best for you.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">Theme</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Select 
              value={preferences.theme} 
              onValueChange={(value) => updatePreference('theme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Currency Selection */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">Currency</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Select 
              value={preferences.currency} 
              onValueChange={(value) => updatePreference('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Timezone Selection */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">Timezone</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Select 
              value={preferences.timezone} 
              onValueChange={(value) => updatePreference('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* AI Automation Level */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">AI Automation Level</CardTitle>
            </div>
            <CardDescription>
              How much should AI help automate your workflow?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {AI_LEVELS.map((level) => (
                <div key={level.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={level.value}
                    name="ai_level"
                    value={level.value}
                    checked={preferences.ai_automation_level === level.value}
                    onChange={(e) => updatePreference('ai_automation_level', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor={level.value} className="font-medium">
                      {level.label}
                    </Label>
                    <p className="text-sm text-gray-500">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-red-500" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose which notifications you'd like to receive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => updateNotificationPreference('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => updateNotificationPreference('push', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="task-reminders">Task Reminders</Label>
                <Switch
                  id="task-reminders"
                  checked={preferences.notifications.task_reminders}
                  onCheckedChange={(checked) => updateNotificationPreference('task_reminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="project-updates">Project Updates</Label>
                <Switch
                  id="project-updates"
                  checked={preferences.notifications.project_updates}
                  onCheckedChange={(checked) => updateNotificationPreference('project_updates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="financial-alerts">Financial Alerts</Label>
                <Switch
                  id="financial-alerts"
                  checked={preferences.notifications.financial_alerts}
                  onCheckedChange={(checked) => updateNotificationPreference('financial_alerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-suggestions">AI Suggestions</Label>
                <Switch
                  id="ai-suggestions"
                  checked={preferences.notifications.ai_suggestions}
                  onCheckedChange={(checked) => updateNotificationPreference('ai_suggestions', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  )
}