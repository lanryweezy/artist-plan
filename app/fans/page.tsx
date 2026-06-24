"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Users,
  Heart,
  Star,
  Mail,
  DollarSign,
  Calendar,
  Music,
  TrendingUp,
  ExternalLink,
  CheckCircle,
  Target,
  BarChart3,
  Gift,
  MessageCircle
} from "lucide-react"

type FanTier = "listener" | "superfan" | "vip"
type FanSource = "streaming" | "social" | "live" | "email" | "merch" | "other"

interface Fan {
  id: string
  name: string
  email?: string
  tier: FanTier
  source: FanSource
  totalSpend: number
  eventsAttended: number
  lastEngagement: string
  tags: string[]
}

interface Campaign {
  id: string
  name: string
  type: "email" | "social" | "sms"
  sent: number
  opened: number
  clicked: number
  status: "draft" | "sent" | "completed"
}

const tierConfig: Record<FanTier, { label: string; color: string; icon: React.ElementType; description: string }> = {
  listener: { label: "Listener", color: "bg-gray-500/10 text-gray-500", icon: Music, description: "Follows your music on streaming platforms" },
  superfan: { label: "Superfan", color: "bg-blue-500/10 text-blue-500", icon: Heart, description: "Engages regularly, buys merch, attends shows" },
  vip: { label: "VIP", color: "bg-yellow-500/10 text-yellow-500", icon: Star, description: "Top supporters — high spend, high engagement" },
}

const mockFans: Fan[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@email.com", tier: "vip", source: "live", totalSpend: 850, eventsAttended: 12, lastEngagement: "2026-06-20", tags: ["merch buyer", "newsletter", "meet & greet"] },
  { id: "2", name: "James Rodriguez", email: "james@email.com", tier: "superfan", source: "streaming", totalSpend: 120, eventsAttended: 3, lastEngagement: "2026-06-18", tags: ["playlist curator", "social follower"] },
  { id: "3", name: "Emily Chen", email: "emily@email.com", tier: "superfan", source: "merch", totalSpend: 340, eventsAttended: 5, lastEngagement: "2026-06-15", tags: ["vinyl collector", "newsletter"] },
  { id: "4", name: "Marcus Johnson", tier: "listener", source: "streaming", totalSpend: 0, eventsAttended: 0, lastEngagement: "2026-06-10", tags: ["spotify listener"] },
  { id: "5", name: "Lisa Park", email: "lisa@email.com", tier: "vip", source: "email", totalSpend: 1200, eventsAttended: 18, lastEngagement: "2026-06-22", tags: ["founding fan", "beta tester", "ambassador"] },
  { id: "6", name: "David Kim", tier: "listener", source: "social", totalSpend: 25, eventsAttended: 1, lastEngagement: "2026-06-05", tags: ["instagram follower"] },
  { id: "7", name: "Rachel Torres", email: "rachel@email.com", tier: "superfan", source: "live", totalSpend: 280, eventsAttended: 7, lastEngagement: "2026-06-19", tags: ["tour regular", "merch buyer"] },
  { id: "8", name: "Alex Wright", tier: "listener", source: "streaming", totalSpend: 0, eventsAttended: 0, lastEngagement: "2026-06-01", tags: ["youtube subscriber"] },
]

const mockCampaigns: Campaign[] = [
  { id: "1", name: "New Single Announcement", type: "email", sent: 1247, opened: 892, clicked: 234, status: "completed" },
  { id: "2", name: "Tour presale for VIPs", type: "email", sent: 45, opened: 38, clicked: 31, status: "completed" },
  { id: "3", name: "Merch drop teaser", type: "social", sent: 2300, opened: 1800, clicked: 450, status: "sent" },
  { id: "4", name: "Birthday message blast", type: "email", sent: 89, opened: 67, clicked: 12, status: "completed" },
]

function FansTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState<FanTier | "all">("all")

  const filtered = mockFans.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = tierFilter === "all" || f.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const tierCounts = {
    listener: mockFans.filter(f => f.tier === "listener").length,
    superfan: mockFans.filter(f => f.tier === "superfan").length,
    vip: mockFans.filter(f => f.tier === "vip").length,
  }

  const totalSpend = mockFans.reduce((s, f) => s + f.totalSpend, 0)
  const totalEvents = mockFans.reduce((s, f) => s + f.eventsAttended, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{mockFans.length}</p>
            <p className="text-xs text-muted-foreground">Total Fans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold text-yellow-500">{tierCounts.vip}</p>
            <p className="text-xs text-muted-foreground">VIP Fans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Fan Spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{totalEvents}</p>
            <p className="text-xs text-muted-foreground">Events Attended</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search fans..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-56" />
        </div>
        {(["all", "vip", "superfan", "listener"] as const).map(tier => (
          <Button key={tier} variant={tierFilter === tier ? "default" : "outline"} size="sm" onClick={() => setTierFilter(tier)} className="capitalize">
            {tier}
          </Button>
        ))}
        <Button size="sm" className="ml-auto">
          <Plus className="h-4 w-4 mr-1" />
          Add Fan
        </Button>
      </div>

      <div className="grid gap-3">
        {filtered.map(fan => {
          const config = tierConfig[fan.tier]
          const TierIcon = config.icon
          return (
            <Card key={fan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {fan.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{fan.name}</p>
                      <p className="text-sm text-muted-foreground">{fan.email || "No email"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-1">
                      {fan.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {fan.tags.length > 2 && <Badge variant="outline" className="text-xs">+{fan.tags.length - 2}</Badge>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">${fan.totalSpend}</p>
                      <p className="text-xs text-muted-foreground">{fan.eventsAttended} events</p>
                    </div>
                    <Badge variant="outline" className={config.color}>
                      <TierIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SegmentsTab() {
  const segments = [
    { name: "VIP Supporters", query: "tier = vip", count: tierConfig.vip ? 2 : 0, color: "text-yellow-500", icon: Star },
    { name: "Superfans", query: "tier = superfan", count: 3, color: "text-blue-500", icon: Heart },
    { name: "Merch Buyers", query: "tags contains 'merch buyer'", count: 3, color: "text-green-500", icon: Gift },
    { name: "Newsletter Subscribers", query: "tags contains 'newsletter'", count: 3, color: "text-purple-500", icon: Mail },
    { name: "Event Regulars (3+ shows)", query: "eventsAttended >= 3", count: 4, color: "text-orange-500", icon: Calendar },
    { name: "High Spenders ($200+)", query: "totalSpend >= 200", count: 3, color: "text-green-500", icon: DollarSign },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {segments.map(seg => (
        <Card key={seg.name} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <seg.icon className={`h-5 w-5 ${seg.color}`} />
                </div>
                <div>
                  <p className="font-medium">{seg.name}</p>
                  <p className="text-xs text-muted-foreground">{seg.count} fans</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Target
                <Target className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CampaignsTab() {
  const openRate = mockCampaigns.reduce((s, c) => s + c.opened, 0) / mockCampaigns.reduce((s, c) => s + c.sent, 0) * 100
  const clickRate = mockCampaigns.reduce((s, c) => s + c.clicked, 0) / mockCampaigns.reduce((s, c) => s + c.sent, 0) * 100

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{mockCampaigns.reduce((s, c) => s + c.sent, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold text-green-500">{openRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Avg Open Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold text-blue-500">{clickRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Avg Click Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium">Recent Campaigns</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-3">
        {mockCampaigns.map(campaign => (
          <Card key={campaign.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {campaign.type === "email" ? <Mail className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{campaign.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">sent</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">{((campaign.opened / campaign.sent) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">opened</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-500">{((campaign.clicked / campaign.sent) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">clicked</p>
                  </div>
                  <Badge variant={campaign.status === "completed" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InsightsTab() {
  const insights = [
    { title: "VIP Engagement Drop", description: "Your VIP fans haven't engaged in 7+ days. Send a personal message or exclusive content.", type: "warning", action: "Send VIP email" },
    { title: "Superfan Conversion Opportunity", description: "3 listeners attended 3+ shows but haven't bought merch. They're prime for superfan conversion.", type: "info", action: "Create merch offer" },
    { title: "Merch Buyers Love Vinyl", description: "Your top 3 merch buyers all purchased vinyl. Consider a limited edition pressing.", type: "info", action: "Plan vinyl drop" },
    { title: "Tour VIP Upsell", description: "5 superfans attended 5+ shows. Offer them VIP packages for the next tour.", type: "success", action: "Create VIP package" },
  ]

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${insight.type === "warning" ? "bg-yellow-500/10" : insight.type === "success" ? "bg-green-500/10" : "bg-blue-500/10"}`}>
                  {insight.type === "warning" ? <AlertCircle className="h-4 w-4 text-yellow-500" /> :
                   insight.type === "success" ? <CheckCircle className="h-4 w-4 text-green-500" /> :
                   <Target className="h-4 w-4 text-blue-500" />}
                </div>
                <div>
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">{insight.action}</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function FansPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fans</h1>
          <p className="text-muted-foreground">Your fan CRM — understand, engage, and grow your audience</p>
        </div>

        <Tabs defaultValue="fans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fans" className="gap-2">
              <Users className="h-4 w-4" />
              All Fans
            </TabsTrigger>
            <TabsTrigger value="segments" className="gap-2">
              <Target className="h-4 w-4" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2">
              <Mail className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fans"><FansTab /></TabsContent>
          <TabsContent value="segments"><SegmentsTab /></TabsContent>
          <TabsContent value="campaigns"><CampaignsTab /></TabsContent>
          <TabsContent value="insights"><InsightsTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
