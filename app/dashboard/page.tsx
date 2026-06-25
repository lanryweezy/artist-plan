"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard, DollarSign, TrendingUp, TrendingDown, Music, Globe,
  Users, Calendar, RefreshCw, Zap, AlertCircle, CheckCircle, Target,
  ArrowUpRight, Clock, ExternalLink, Shield, BarChart3, ArrowRight, FolderOpen
} from "lucide-react"
import { integrationManager } from "@/services/integrations"

// ====== DEMO DATA ======

const D = {
  earnings: { total: 11257, lastMonth: 9834, change: 14.5, streaming: 3200, royalties: 4971, direct: 3086 },
  analytics: { streams: 19700, listeners: 2340, followers: 4521, platforms: [{ n: "Spotify", s: 8420, g: 12.5 }, { n: "Apple Music", s: 3240, g: 8.3 }, { n: "YouTube", s: 5680, g: 15.2 }, { n: "SoundCloud", s: 1890, g: -2.1 }] },
  projects: { active: 5, tasksComplete: 28, tasksTotal: 42 },
  fans: { total: 4521, vip: 12, superfan: 89, email: 342 },
  registrations: { missing: ["MLC", "SoundExchange", "YouTube CMS", "US Copyright Office"] },
  upcoming: [
    { title: "Release Midnight Dreams single", date: "2026-07-15", type: "release" },
    { title: "Submit to Spotify editorial", date: "2026-07-01", type: "marketing" },
    { title: "NEA Grant deadline", date: "2026-08-01", type: "grant" },
  ],
  aiInsights: [
    { type: "danger", title: "Missing MLC Registration", desc: "You're not collecting streaming mechanical royalties. Estimated $200-500/month lost.", action: "/rights" },
    { type: "danger", title: "Missing SoundExchange", desc: "Not collecting from Pandora/SiriusXM. Estimated $100-1,000/quarter lost.", action: "/rights" },
    { type: "warning", title: "YouTube CMS Not Set Up", desc: "Missing revenue from fan videos using your music.", action: "/integrations" },
    { type: "success", title: "Spotify Growth", desc: "Streams up 12.5% this month. Your audience is growing.", action: "/royalties" },
    { type: "info", title: "Sync Opportunity", desc: "Your style fits indie film placements. Consider sync licensing.", action: "/intelligence" },
  ],
}

// ====== METRIC CARD ======

function MetricCard({ title, value, change, changeType, icon: Icon, description, href }: {
  title: string; value: string; change: string; changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType; description: string; href?: string
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs flex items-center gap-1 mt-1 ${changeType === "positive" ? "text-green-500" : changeType === "negative" ? "text-red-500" : "text-muted-foreground"}`}>
              {changeType === "positive" ? <TrendingUp className="h-3 w-3" /> : changeType === "negative" ? <TrendingDown className="h-3 w-3" /> : null}
              {change}
            </p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== EARNINGS PANEL ======

function EarningsPanel() {
  const e = D.earnings
  const streams = [
    { name: "Spotify", amount: 1247, pct: 39 },
    { name: "Apple Music", amount: 892, pct: 28 },
    { name: "YouTube", amount: 634, pct: 20 },
    { name: "Other", amount: 427, pct: 13 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Earnings</CardTitle>
          <a href="/royalties"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="h-3 w-3 ml-1" /></Button></a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-3xl font-bold">${e.total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This month</p>
          <p className="text-xs text-green-500 flex items-center justify-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />+{e.change}% vs last month
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Streaming</span><span className="font-medium">${e.streaming.toLocaleString()}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Royalties</span><span className="font-medium">${e.royalties.toLocaleString()}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Direct Sales</span><span className="font-medium">${e.direct.toLocaleString()}</span></div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs font-medium mb-2">Top Platforms</p>
          {streams.map(s => (
            <div key={s.name} className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{s.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }} /></div>
                <span className="w-12 text-right">${s.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ====== REGISTRATION ALERT ======

function RegistrationAlert() {
  const summary = integrationManager.getSummary()
  const missing = D.registrations.missing

  if (missing.length === 0) return null

  return (
    <Card className="border-red-500/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-500">{missing.length} registrations missing — money left on the table</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {missing.map(m => (
                <Badge key={m} variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/30">{m}</Badge>
              ))}
            </div>
            <a href="/analytics" className="text-xs text-primary mt-2 inline-flex items-center gap-1 hover:underline">
              Fix now <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== AI INSIGHTS ======

function AIInsightsPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />AI Insights</CardTitle>
          <a href="/analytics"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="h-3 w-3 ml-1" /></Button></a>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {D.aiInsights.map((ins, i) => (
          <a key={i} href={ins.action} className="flex items-start gap-2 p-2 border rounded hover:bg-muted/50 transition-colors">
            {ins.type === "danger" ? <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> :
             ins.type === "warning" ? <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" /> :
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

// ====== UPCOMING ======

function UpcomingPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Upcoming</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {D.upcoming.map((item, i) => (
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

// ====== QUICK STATS ======

function QuickStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-3"><div className="text-center"><p className="text-xl font-bold">{D.analytics.streams.toLocaleString()}</p><p className="text-xs text-muted-foreground">Streams</p></div></Card>
      <Card className="p-3"><div className="text-center"><p className="text-xl font-bold">{D.analytics.followers.toLocaleString()}</p><p className="text-xs text-muted-foreground">Followers</p></div></Card>
      <Card className="p-3"><div className="text-center"><p className="text-xl font-bold">{D.projects.active}</p><p className="text-xs text-muted-foreground">Projects</p></div></Card>
      <Card className="p-3"><div className="text-center"><p className="text-xl font-bold">{D.fans.vip}</p><p className="text-xs text-muted-foreground">VIP Fans</p></div></Card>
    </div>
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
            <p className="text-muted-foreground">Your music career at a glance</p>
          </div>
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
        </div>

        <RegistrationAlert />
        <QuickStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <EarningsPanel />
          </div>
          <div>
            <AIInsightsPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UpcomingPanel />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: "New Project", href: "/projects", icon: FolderOpen },
                { label: "Add Song", href: "/publishing", icon: Music },
                { label: "Record Income", href: "/finances", icon: DollarSign },
                { label: "AI Assistant", href: "/ai", icon: Zap },
              ].map(a => (
                <a key={a.label} href={a.href}>
                  <Button variant="outline" className="w-full justify-start gap-2"><a.icon className="h-4 w-4" />{a.label}</Button>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

