"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, TrendingDown, Music, Globe, Radio, Video, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

const streams = [
  { name: "Spotify", amount: 1247, change: 12.5, collected: true, source: "DistroKid" },
  { name: "Apple Music", amount: 892, change: 8.3, collected: true, source: "DistroKid" },
  { name: "YouTube", amount: 634, change: 15.2, collected: true, source: "YouTube CMS" },
  { name: "SoundCloud", amount: 189, change: -2.1, collected: true, source: "DistroKid" },
  { name: "Other DSPs", amount: 234, change: 5.0, collected: true, source: "DistroKid" },
]

const royalties = [
  { name: "Performance (ASCAP)", amount: 561, frequency: "Quarterly", collected: true, source: "ASCAP" },
  { name: "Mechanical (MLC)", amount: 445, frequency: "Monthly", collected: false, source: "Not registered" },
  { name: "SoundExchange", amount: 423, frequency: "Quarterly", collected: false, source: "Not registered" },
  { name: "Sync Fees", amount: 3500, frequency: "Per placement", collected: true, source: "Publisher" },
  { name: "Neighboring Rights", amount: 156, frequency: "Quarterly", collected: false, source: "Not registered" },
]

export default function RoyaltiesPage() {
  const totalStreaming = streams.reduce((s, r) => s + r.amount, 0)
  const totalRoyalties = royalties.reduce((s, r) => s + r.amount, 0)
  const total = totalStreaming + totalRoyalties
  const uncollected = royalties.filter(r => !r.collected).reduce((s, r) => s + r.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Royalties</h1><p className="text-muted-foreground">Every penny from every source</p></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold">${total.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Streaming</p><p className="text-2xl font-bold">${totalStreaming.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Royalties</p><p className="text-2xl font-bold">${totalRoyalties.toLocaleString()}</p></CardContent></Card>
          <Card className={uncollected > 0 ? "border-red-500/30" : ""}><CardContent className="p-4"><p className="text-xs text-muted-foreground">Uncollected</p><p className={`text-2xl font-bold ${uncollected > 0 ? "text-red-500" : "text-green-500"}`}>${uncollected.toLocaleString()}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="streaming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="streaming" className="gap-2"><Music className="h-4 w-4" />Streaming</TabsTrigger>
            <TabsTrigger value="royalties" className="gap-2"><DollarSign className="h-4 w-4" />Royalties</TabsTrigger>
            <TabsTrigger value="rates" className="gap-2"><BarChart3 className="h-4 w-4" />Rates</TabsTrigger>
          </TabsList>

          <TabsContent value="streaming" className="space-y-3">
            {streams.map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.source}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs ${s.change >= 0 ? "text-green-500" : "text-red-500"}`}>{s.change >= 0 ? "+" : ""}{s.change}%</span>
                  <span className="font-bold">${s.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="royalties" className="space-y-3">
            {royalties.map(r => (
              <div key={r.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {r.collected ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                  <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.frequency} • {r.source}</p></div>
                </div>
                <span className="font-bold">${r.amount.toLocaleString()}</span>
              </div>
            ))}
            {uncollected > 0 && (
              <Card className="border-red-500/30">
                <CardContent className="p-3">
                  <p className="text-sm text-red-500 font-medium">${uncollected.toLocaleString()} in uncollected royalties</p>
                  <a href="/rights" className="text-xs text-primary hover:underline">Register now to collect →</a>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rates">
            <div className="grid gap-3 md:grid-cols-2">
              <Card><CardContent className="p-4 space-y-2 text-sm"><p className="font-medium">Mechanical (Physical/Download)</p><p className="text-muted-foreground">$0.091 per copy (&lt;5 min) • $0.0175/min (&gt;5 min)</p><p className="text-muted-foreground">Source: Copyright Royalty Board</p></CardContent></Card>
              <Card><CardContent className="p-4 space-y-2 text-sm"><p className="font-medium">Mechanical (Streaming)</p><p className="text-muted-foreground">~$0.003-0.005 per stream (varies by platform)</p><p className="text-muted-foreground">Collected by MLC</p></CardContent></Card>
              <Card><CardContent className="p-4 space-y-2 text-sm"><p className="font-medium">Performance</p><p className="text-muted-foreground">50/50 writer/publisher split. Rates set by consent decrees (ASCAP/BMI).</p></CardContent></Card>
              <Card><CardContent className="p-4 space-y-2 text-sm"><p className="font-medium">SoundExchange</p><p className="text-muted-foreground">45% artist / 50% label / 5% non-featured. Non-interactive only.</p></CardContent></Card>
              <Card><CardContent className="p-4 space-y-2 text-sm"><p className="font-medium">Sync Fees</p><p className="text-muted-foreground">Fully negotiable. National commercial: $25K-500K+. TV: $5K-50K+.</p></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

