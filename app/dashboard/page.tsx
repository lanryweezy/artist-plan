"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard, DollarSign, TrendingUp, TrendingDown, Music, Globe,
  Users, Calendar, RefreshCw, Zap, ArrowUpRight, AlertCircle, CheckCircle,
  BarChart3, Target, Shield, Clock, ExternalLink
} from "lucide-react"
import { integrationManager } from "@/services/integrations"

// ====== DEMO DATA ======

const demoData = {
  earnings: {
    streaming: { spotify: 1247, appleMusic: 892, youtube: 634, soundcloud: 189, other: 234 },
    royalties: { performance: 892, mechanical: 445, sync: 3500, soundExchange: 423, neighboring: 156 },
    direct: { merch: 680, live: 2400, courses: 0, crowdfunding: 0 },
    total: 11257,
    lastMonth: 9834,
    change: 14.5,
  },
  analytics: {
    totalStreams: 19700,
    monthlyListeners: 2340,
    followers: 4521,
    topPlatforms: [
      { name: "Spotify", streams: 8420, growth: 12.5 },
      { name: "Apple Music", streams: 3240, growth: 8.3 },
      { name: "YouTube", streams: 5680, growth: 15.2 },
      { name: "SoundCloud", streams: 1890, growth: -2.1 },
    ],
    demographics: { "18-24": 28, "25-34": 35, "35-44": 22, "45+": 15 },
  },
  projects: { active: 5, total: 8, tasksComplete: 28, tasksTotal: 42 },
  fans: { total: 4521, vip: 12, superfan: 89, emailSubscribers: 342 },
  registrations: {
    composition: { ascap: true, bmi: false, mlc: false, hfa: false },
    recording: { soundexchange: false, youtubeCMS: false },
  },
  upcoming: [
    { title: "Release Midnight Dreams single", date: "2026-07-15", type: "release" },
    { title: "Submit to Spotify editorial", date: "2026-07-01", type: "marketing" },
    { title: "NEA Grant deadline", date: "2026-08-01", type: "grant" },
  ],
}

// ====== EARNINGS OVERVIEW ======

function EarningsOverview() {
  const [period, setPeriod] = useState<"month" | "year">("month")
  const earnings = demoData.earnings

  const byCategory = [
    { label: "Streaming", amount: Object.values(earnings.streaming).reduce((a, b) => a + b, 0), color: "text-blue-500", icon: Music },
    { label: "Royalties", amount: Object.values(earnings.royalties).reduce((a, b) => a + b, 0), color: "text-green-500", icon: TrendingUp },
    { label: "Direct Sales", amount: Object.values(earnings.direct).reduce((a, b) => a + b, 0), color: "text-purple-500", icon: DollarSign },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Earnings Overview</CardTitle>
          <div className="flex gap-1">
            <Button variant={period === "month" ? "default" : "outline"} size="sm" onClick={() => setPeriod("month")}>Month</Button>
            <Button variant={period === "year" ? "default" : "outline"} size="sm" onClick={() => setPeriod("year")}>Year</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-3xl font-bold">${earnings.total.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total earnings this month</p>
          <p className={`text-sm flex items-center justify-center gap-1 mt-1 ${earnings.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {earnings.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {earnings.change >= 0 ? "+" : ""}{earnings.change}% vs last month
          </p>
        </div>

        <div className="space-y-3">
          {byCategory.map(cat => (
            <div key={cat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <cat.icon className={`h-4 w-4 ${cat.color}`} />
                <span className="text-sm">{cat.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(cat.amount / earnings.total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium w-16 text-right">${cat.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">By Source</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(earnings.streaming).map(([platform, amount]) => (
              <div key={platform} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{platform.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-medium">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== STREAMING ANALYTICS ======

function StreamingAnalytics() {
  const analytics = demoData.analytics

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Streaming Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">{(analytics.totalStreams / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground">Total Streams</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">{(analytics.monthlyListeners / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground">Listeners</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">{(analytics.followers / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>

        <div className="space-y-2">
          {analytics.topPlatforms.map(p => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <span>{p.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{(p.streams / 1000).toFixed(1)}K</span>
                <span className={`text-xs ${p.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {p.growth >= 0 ? "+" : ""}{p.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ====== INTEGRATIONS STATUS ======

function IntegrationsStatus() {
  const summary = integrationManager.getSummary()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Integrations</CardTitle>
          <a href="/integrations"><Button variant="ghost" size="sm"><ExternalLink className="h-3 w-3" /></Button></a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Setup Progress</span>
          <span className="text-sm font-bold">{summary.setupPercentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${summary.setupPercentage}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>{summary.connected} connected</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            <span>{summary.essentialTotal - summary.essentialConnected} essential missing</span>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          {integrationManager.getRegistrations().filter(r => r.required).map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{r.agency}</span>
              {r.status === "connected" ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertCircle className="h-3 w-3 text-yellow-500" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ====== REVENUE BREAKDOWN ======

function RevenueBreakdown() {
  const streams = demoData.earnings.streaming
  const royalties = demoData.earnings.royalties

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          {Object.entries(streams).map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">${v.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 space-y-1">
          <p className="text-xs font-medium">Royalties</p>
          {Object.entries(royalties).map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">${v.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ====== UPCOMING ======

function Upcoming() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Upcoming</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {demoData.upcoming.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ====== FANS ======

function FansOverview() {
  const fans = demoData.fans
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Fans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold">{fans.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold text-yellow-500">{fans.vip}</p>
            <p className="text-xs text-muted-foreground">VIP</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold text-blue-500">{fans.superfan}</p>
            <p className="text-xs text-muted-foreground">Superfans</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <p className="text-lg font-bold text-purple-500">{fans.emailSubscribers}</p>
            <p className="text-xs text-muted-foreground">Email List</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== AI INSIGHTS ======

function AIInsights() {
  const insights = [
    { type: "warning", title: "Missing MLC Registration", desc: "You're not collecting streaming mechanical royalties", action: "/rights" },
    { type: "warning", title: "Missing SoundExchange", desc: "Not collecting from Pandora/SiriusXM", action: "/rights" },
    { type: "info", title: "YouTube CMS Available", desc: "Monetize fan videos using your music", action: "/integrations" },
    { type: "success", title: "Spotify Growth", desc: "Streams up 12.5% this month", action: "/royalties" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((ins, i) => (
          <a key={i} href={ins.action} className="flex items-start gap-2 p-2 border rounded hover:bg-muted/50 transition-colors">
            {ins.type === "warning" ? <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" /> :
             ins.type === "success" ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> :
             <Target className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />}
            <div>
              <p className="text-sm font-medium">{ins.title}</p>
              <p className="text-xs text-muted-foreground">{ins.desc}</p>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

// ====== QUICK ACTIONS ======

function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {[
          { label: "New Project", href: "/projects", icon: FolderOpen },
          { label: "Add Song", href: "/publishing", icon: Music },
          { label: "Record Expense", href: "/finances", icon: DollarSign },
          { label: "Add Contact", href: "/team", icon: Users },
        ].map(action => (
          <a key={action.label} href={action.href}>
            <Button variant="outline" className="w-full justify-start gap-2">
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

// ====== MAIN DASHBOARD ======

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back — here's your music business at a glance</p>
          </div>
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="money" className="gap-2"><DollarSign className="h-4 w-4" />Money</TabsTrigger>
            <TabsTrigger value="growth" className="gap-2"><TrendingUp className="h-4 w-4" />Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <EarningsOverview />
              <StreamingAnalytics />
              <IntegrationsStatus />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RevenueBreakdown />
              <FansOverview />
              <AIInsights />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Upcoming />
              <QuickActions />
            </div>
          </TabsContent>

          <TabsContent value="money" className="space-y-4">
            <EarningsOverview />
            <RevenueBreakdown />
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <StreamingAnalytics />
            <FansOverview />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
