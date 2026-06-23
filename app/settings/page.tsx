"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Mail,
  Save,
  Camera,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Key,
  Trash2
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "Lanry Weezy",
    email: "lanryweezy@gmail.com",
    avatar: "",
    timezone: "Africa/Lagos",
    currency: "NGN",
    language: "en",
    theme: "dark",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorEnabled: false,
    publicProfile: true,
    showEmail: false,
  })

  const [activeTab, setActiveTab] = useState("profile")

  const handleSave = () => {
    // Save settings
    alert("Settings saved!")
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {settings.name.charAt(0)}
                      </div>
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium">{settings.name}</p>
                      <p className="text-sm text-muted-foreground">{settings.email}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Timezone</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      >
                        <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <Separator />

                  {/* Privacy */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Privacy</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                      </div>
                      <Switch
                        checked={settings.publicProfile}
                        onCheckedChange={(checked) => setSettings({ ...settings, publicProfile: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email</p>
                        <p className="text-sm text-muted-foreground">Display email on public profile</p>
                      </div>
                      <Switch
                        checked={settings.showEmail}
                        onCheckedChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "system", label: "System", icon: Smartphone },
                      ].map((theme) => (
                        <Button
                          key={theme.id}
                          variant={settings.theme === theme.id ? "default" : "outline"}
                          className="h-24 flex flex-col items-center justify-center gap-2"
                          onClick={() => setSettings({ ...settings, theme: theme.id })}
                        >
                          <theme.icon className="h-6 w-6" />
                          {theme.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Language</h3>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    >
                      <option value="en">English</option>
                      <option value="yo">Yoruba</option>
                      <option value="ha">Hausa</option>
                      <option value="ig">Igbo</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Password</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your password regularly</p>
                      </div>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">2FA</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={settings.twoFactorEnabled ? "default" : "secondary"}>
                          {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={settings.twoFactorEnabled}
                          onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-red-600">Danger Zone</h3>
                    <div className="flex items-center justify-between border border-red-200 rounded-lg p-4">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage your subscription and payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground">Free Tier</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Upgrade to Pro</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-2">
                        <CardContent className="p-4">
                          <p className="font-bold text-lg">Pro</p>
                          <p className="text-2xl font-bold">$9.99<span className="text-sm font-normal">/month</span></p>
                          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li>✓ Unlimited projects</li>
                            <li>✓ AI insights</li>
                            <li>✓ Advanced analytics</li>
                            <li>✓ Priority support</li>
                          </ul>
                          <Button className="w-full mt-4">Upgrade</Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="font-bold text-lg">Enterprise</p>
                          <p className="text-2xl font-bold">$29.99<span className="text-sm font-normal">/month</span></p>
                          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li>✓ Everything in Pro</li>
                            <li>✓ Team collaboration</li>
                            <li>✓ Custom integrations</li>
                            <li>✓ Dedicated support</li>
                          </ul>
                          <Button variant="outline" className="w-full mt-4">Contact Sales</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
