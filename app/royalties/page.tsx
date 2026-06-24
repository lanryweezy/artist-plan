"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Music,
  Radio,
  Video,
  Download,
  Globe,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  FileText,
  BarChart3
} from "lucide-react"

interface RoyaltyStream {
  name: string
  amount: number
  change: number
  icon: React.ElementType
  color: string
  collected: boolean
  lastPayment?: string
  source: string
}

const royaltyStreams: RoyaltyStream[] = [
  { name: "Mechanical (Streaming)", amount: 1247, change: 12, icon: Music, color: "text-blue-500", collected: true, lastPayment: "2026-06-01", source: "MLC / HFA" },
  { name: "Performance (Radio)", amount: 892, change: -3, icon: Radio, color: "text-green-500", collected: true, lastPayment: "2026-05-15", source: "ASCAP / BMI" },
  { name: "Sync Fees", amount: 3500, change: 100, icon: Video, color: "text-purple-500", collected: true, lastPayment: "2026-04-20", source: "Direct" },
  { name: "SoundExchange", amount: 423, change: 8, icon: Radio, color: "text-orange-500", collected: true, lastPayment: "2026-05-30", source: "SoundExchange" },
  { name: "Mechanical (Downloads)", amount: 89, change: -15, icon: Download, color: "text-red-500", collected: true, lastPayment: "2026-06-01", source: "HFA" },
  { name: "YouTube / Content ID", amount: 634, change: 22, icon: Video, color: "text-red-500", collected: true, lastPayment: "2026-06-15", source: "YouTube CMS" },
  { name: "Neighboring Rights", amount: 156, change: 0, icon: Globe, color: "text-teal-500", collected: false, source: "Foreign PROs" },
  { name: "Lyric Licensing", amount: 42, change: 5, icon: FileText, color: "text-yellow-500", collected: true, lastPayment: "2026-06-01", source: "LyricFind" },
]

const uncollectedStreams = [
  { source: "MLC", description: "Digital streaming mechanicals", action: "Register at themlc.com", status: "missing_metadata" as const },
  { source: "SoundExchange", description: "Non-interactive digital performance", action: "Register at soundexchange.com", status: "not_registered" as const },
  { source: "Foreign PROs", description: "International performance royalties", action: "Register via ASCAP/BMI reciprocal agreements", status: "partial" as const },
  { source: "YouTube CMS", description: "Content ID monetization", action: "Set up YouTube CMS channel", status: "not_registered" as const },
  { source: "HFA", description: "Physical & digital mechanicals", action: "Register at harryfox.com", status: "missing_metadata" as const },
  { source: "Music Reports", description: "Digital voluntary licenses (TikTok, etc)", action: "Submit metadata to Music Reports", status: "partial" as const },
]

const statusColors = {
  registered: "bg-green-500/10 text-green-500",
  not_registered: "bg-red-500/10 text-red-500",
  missing_metadata: "bg-yellow-500/10 text-yellow-500",
  partial: "bg-blue-500/10 text-blue-500",
}

const statusLabels = {
  registered: "Active",
  not_registered: "Not Registered",
  missing_metadata: "Missing Metadata",
  partial: "Partial",
}

function OverviewTab() {
  const totalCollected = royaltyStreams.filter(s => s.collected).reduce((sum, s) => sum + s.amount, 0)
  const totalUncollected = royaltyStreams.filter(s => !s.collected).reduce((sum, s) => sum + s.amount, 0)
  const avgChange = Math.round(royaltyStreams.reduce((sum, s) => sum + s.change, 0) / royaltyStreams.length)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected (MTD)</p>
                <p className="text-3xl font-bold">${totalCollected.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {avgChange > 0 ? `+${avgChange}%` : `${avgChange}%`} avg
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uncollected</p>
                <p className="text-3xl font-bold text-yellow-500">${totalUncollected.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">From unregistered sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Streams</p>
                <p className="text-3xl font-bold">{royaltyStreams.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Active royalty sources</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {royaltyStreams.map((stream) => (
          <Card key={stream.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-muted rounded-lg ${stream.color}`}>
                    <stream.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{stream.name}</p>
                    <p className="text-sm text-muted-foreground">{stream.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {stream.lastPayment && (
                    <p className="text-xs text-muted-foreground">Last: {new Date(stream.lastPayment).toLocaleDateString()}</p>
                  )}
                  <div className="text-right">
                    <p className="font-bold text-lg">${stream.amount.toLocaleString()}</p>
                    <p className={`text-sm flex items-center gap-1 justify-end ${stream.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {stream.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stream.change >= 0 ? "+" : ""}{stream.change}%
                    </p>
                  </div>
                  <Badge variant={stream.collected ? "default" : "destructive"}>
                    {stream.collected ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                    {stream.collected ? "Collected" : "Uncollected"}
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

function CollectionTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Royalty Collection Sources</h3>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <div className="grid gap-4">
        {uncollectedStreams.map((stream) => (
          <Card key={stream.source}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{stream.source}</p>
                  <p className="text-sm text-muted-foreground">{stream.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={statusColors[stream.status]}>
                    {statusLabels[stream.status]}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {stream.action.includes("http") ? (
                      <a href={`https://${stream.action.split("at ")[1]}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        Register <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      stream.action
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How Royalties Flow</CardTitle>
          <CardDescription>Understanding where your money comes from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-blue-500 mb-1">Composition Side (Songwriter)</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Mechanical royalties → MLC, HFA, Music Reports</li>
                <li>Performance royalties → ASCAP, BMI, SESAC, GMR</li>
                <li>Sync fees → Direct from music publisher</li>
                <li>Print/lyric royalties → LyricFind, publisher</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-green-500 mb-1">Master Side (Recording Artist)</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Artist royalties → Record label</li>
                <li>SoundExchange → Non-interactive streaming</li>
                <li>YouTube CMS → Content ID monetization</li>
                <li>Neighboring rights → Foreign collection societies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RatesTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Current Royalty Rates (US)</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mechanical Royalties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Physical/Digital Download (&lt;5 min)</span>
              <span className="font-bold">$0.091 per copy</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Physical/Digital Download (&gt;5 min)</span>
              <span className="font-bold">$0.0175 per minute</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Ringtones</span>
              <span className="font-bold">$0.24 per ringtone</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Interactive Streaming</span>
              <span className="font-bold">~$0.003-0.005 per stream</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">SoundExchange (Non-Interactive)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Featured Artist</span>
              <span className="font-bold">45%</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Master Owner (Label)</span>
              <span className="font-bold">50%</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Non-Featured Artists</span>
              <span className="font-bold">5%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">SiriusXM pays ~15.5% of revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance (PROs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Writer Share</span>
              <span className="font-bold">50%</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Publisher Share</span>
              <span className="font-bold">50%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">ASCAP/BMI rates set by consent decrees. SESAC/GMR negotiate directly.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sync Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>TV Network (feature use)</span>
              <span className="font-bold">$5,000-50,000+</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>TV Network (background)</span>
              <span className="font-bold">$1,000-5,000</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>National Commercial</span>
              <span className="font-bold">$25,000-500,000+</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Independent Film</span>
              <span className="font-bold">$500-5,000</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Sync fees are negotiated — no statutory rates. Most favored nations (MFN) applies.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RoyaltiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Royalties</h1>
          <p className="text-muted-foreground">Track all your royalty streams and collection sources</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="collection" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Collection Status
            </TabsTrigger>
            <TabsTrigger value="rates" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Current Rates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="collection">
            <CollectionTab />
          </TabsContent>

          <TabsContent value="rates">
            <RatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
