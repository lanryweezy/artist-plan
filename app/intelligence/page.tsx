"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  BarChart3, Target, Zap, RefreshCw, ArrowRight, Minus, Plus, Info, Users
} from "lucide-react"

// ====== DEAL SIMULATOR ======

function DealSimulator() {
  const [years, setYears] = useState(5)
  const [labelAdvance, setLabelAdvance] = useState(75000)
  const [labelRoyalty, setLabelRoyalty] = useState(14)
  const [indieStreaming, setIndieStreaming] = useState(5000)
  const [indieGrowth, setIndieGrowth] = useState(20)
  const [marketingBudget, setMarketingBudget] = useState(20000)
  const [tourRevenue, setTourRevenue] = useState(40000)

  // Calculate indie scenario
  const indieData = Array.from({ length: years }, (_, i) => {
    const streaming = indieStreaming * Math.pow(1 + indieGrowth / 100, i)
    const touring = tourRevenue
    const merch = streaming * 0.3
    const total = streaming + touring + merch
    return { year: i + 1, streaming, touring, merch, total, cumulative: 0 }
  })
  indieData.forEach((d, i) => {
    d.cumulative = indieData.slice(0, i + 1).reduce((s, x) => s + x.total, 0)
  })

  // Calculate label scenario
  const labelData = Array.from({ length: years }, (_, i) => {
    const streaming = indieStreaming * Math.pow(1 + indieGrowth / 100, i)
    const artistShare = streaming * (labelRoyalty / 100)
    const touring = tourRevenue * 0.7 // Label takes 30% of touring (360 deal)
    const merch = streaming * 0.2 // Label takes 40% of merch
    const total = artistShare + touring + merch
    return { year: i + 1, streaming: artistShare, touring, merch, total, cumulative: 0 }
  })
  labelData.forEach((d, i) => {
    d.cumulative = labelData.slice(0, i + 1).reduce((s, x) => s + x.total, 0)
  })

  const indieTotal = indieData[indieData.length - 1].cumulative
  const labelTotal = labelData[labelData.length - 1].cumulative
  const netAfterAdvance = labelTotal - labelAdvance
  const difference = indieTotal - netAfterAdvance

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Deal Simulator</CardTitle>
          <CardDescription>Compare staying independent vs signing a label deal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="text-xs text-muted-foreground">Timeline (years)</label><Input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Label Advance</label><Input type="number" value={labelAdvance} onChange={e => setLabelAdvance(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Label Royalty %</label><Input type="number" value={labelRoyalty} onChange={e => setLabelRoyalty(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Indie Streaming/mo</label><Input type="number" value={indieStreaming} onChange={e => setIndieStreaming(Number(e.target.value))} className="h-8" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-muted-foreground">Indie Growth %/year</label><Input type="number" value={indieGrowth} onChange={e => setIndieGrowth(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Tour Revenue/year</label><Input type="number" value={tourRevenue} onChange={e => setTourRevenue(Number(e.target.value))} className="h-8" /></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Indie Scenario */}
        <Card className="border-green-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-green-500">Stay Independent</CardTitle>
              <Badge className="bg-green-500/10 text-green-500">{years} Years</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center p-4 bg-green-500/5 rounded-lg">
              <p className="text-3xl font-bold text-green-500">${indieTotal.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total estimated income</p>
            </div>
            <div className="space-y-1 text-xs">
              {indieData.map(d => (
                <div key={d.year} className="flex justify-between">
                  <span>Year {d.year}</span>
                  <span className="font-medium">${d.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t text-xs space-y-1">
              <p className="font-medium">Pros:</p>
              <p className="text-muted-foreground">• Keep 100% of all revenue streams</p>
              <p className="text-muted-foreground">• Own your masters forever</p>
              <p className="text-muted-foreground">• No recoupment obligations</p>
              <p className="text-muted-foreground">• Full creative control</p>
            </div>
          </CardContent>
        </Card>

        {/* Label Scenario */}
        <Card className="border-red-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-red-500">Sign Label Deal</CardTitle>
              <Badge className="bg-red-500/10 text-red-500">{labelAdvance.toLocaleString()} Advance</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center p-4 bg-red-500/5 rounded-lg">
              <p className="text-3xl font-bold text-red-500">${netAfterAdvance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Net after advance repayment</p>
            </div>
            <div className="space-y-1 text-xs">
              {labelData.map(d => (
                <div key={d.year} className="flex justify-between">
                  <span>Year {d.year}</span>
                  <span className="font-medium">${d.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t text-xs space-y-1">
              <p className="font-medium">Cons:</p>
              <p className="text-muted-foreground">• Keep only {labelRoyalty}% of streaming</p>
              <p className="text-muted-foreground">• Label takes 30% of touring (360)</p>
              <p className="text-muted-foreground">• Label takes 40% of merch (360)</p>
              <p className="text-muted-foreground">• Advance must be repaid from royalties</p>
              <p className="text-muted-foreground">• Label owns your masters</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={difference > 0 ? "border-green-500/30" : "border-red-500/30"}>
        <CardContent className="p-4">
          <div className="text-center">
            <p className={`text-3xl font-bold ${difference > 0 ? "text-green-500" : "text-red-500"}`}>
              {difference > 0 ? "+" : ""}${difference.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {difference > 0
                ? "You earn MORE staying independent over this period"
                : "The label deal earns more over this period (but you lose ownership)"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Breakeven: {difference > 0 ? "Never — indie wins" : `${Math.ceil(labelAdvance / (indieTotal - netAfterAdvance))} years`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ====== REVENUE INTELLIGENCE ======

function RevenueIntelligence() {
  const [streams, setStreams] = useState(19700)
  const [shows, setShows] = useState(12)
  const [avgShowRev, setAvgShowRev] = useState(1200)
  const [merchRevenue, setMerchRevenue] = useState(4500)
  const [syncFees, setSyncFees] = useState(2500)
  const [royalties, setRoyalties] = useState(1800)
  const [courses, setCourses] = useState(0)

  const totalRevenue = streams * 0.004 + shows * avgShowRev + merchRevenue + syncFees + royalties + courses

  const breakdown = [
    { source: "Streaming", amount: streams * 0.004, color: "bg-blue-500" },
    { source: "Live Shows", amount: shows * avgShowRev, color: "bg-green-500" },
    { source: "Merch", amount: merchRevenue, color: "bg-purple-500" },
    { source: "Sync", amount: syncFees, color: "bg-orange-500" },
    { source: "Royalties", amount: royalties, color: "bg-yellow-500" },
    { source: "Other", amount: courses, color: "bg-gray-500" },
  ].sort((a, b) => b.amount - a.amount)

  const topSource = breakdown[0]
  const lowSource = breakdown[breakdown.length - 1]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Revenue Intelligence</CardTitle>
          <CardDescription>Analyze your revenue mix and find the biggest opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><label className="text-xs text-muted-foreground">Monthly Streams</label><Input type="number" value={streams} onChange={e => setStreams(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Shows/Year</label><Input type="number" value={shows} onChange={e => setShows(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Avg Show Revenue</label><Input type="number" value={avgShowRev} onChange={e => setAvgShowRev(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Merch Revenue/Year</label><Input type="number" value={merchRevenue} onChange={e => setMerchRevenue(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Sync Fees/Year</label><Input type="number" value={syncFees} onChange={e => setSyncFees(Number(e.target.value))} className="h-8" /></div>
            <div><label className="text-xs text-muted-foreground">Royalties/Year</label><Input type="number" value={royalties} onChange={e => setRoyalties(Number(e.target.value))} className="h-8" /></div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total estimated annual revenue</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Revenue Mix</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map(b => (
              <div key={b.source} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${b.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{b.source}</span>
                    <span className="font-medium">${b.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1">
                    <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.amount / totalRevenue) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{((b.amount / totalRevenue) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <p className="text-sm font-medium text-green-500 flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Double down on: {topSource.source}</p>
              <p className="text-xs text-muted-foreground mt-1">{topSource.source} is your biggest revenue source at {((topSource.amount / totalRevenue) * 100).toFixed(0)}%. Focus resources here.</p>
            </div>
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-500 flex items-center gap-1"><Target className="h-4 w-4" /> Growth opportunity: {lowSource.source}</p>
              <p className="text-xs text-muted-foreground mt-1">{lowSource.source} is only {((lowSource.amount / totalRevenue) * 100).toFixed(0)}%. Small improvements here have big impact.</p>
            </div>
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-sm font-medium text-blue-500 flex items-center gap-1"><DollarSign className="h-4 w-4" /> Diversification alert</p>
              <p className="text-xs text-muted-foreground mt-1">Streaming is {((breakdown[0].amount / totalRevenue) * 100) > 50 ? "over 50%" : "under 50%"} of revenue. {((breakdown[0].amount / totalRevenue) * 100) > 50 ? "You're too dependent on streaming. Diversify into sync, live, and merch." : "Good diversification. Maintain balance across streams."}</p>
            </div>
            <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
              <p className="text-sm font-medium text-purple-500 flex items-center gap-1"><Users className="h-4 w-4" /> Fan monetization</p>
              <p className="text-xs text-muted-foreground mt-1">Merch at {((merchRevenue / totalRevenue) * 100).toFixed(0)}% — industry average is 25-35% for touring artists. {merchRevenue / shows < 400 ? "Increase merch variety and pricing." : "Strong merch performance."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ====== MAIN PAGE ======

export default function IntelligencePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Intelligence</h1>
          <p className="text-muted-foreground">AI-powered decisions for your music career</p>
        </div>

        <Tabs defaultValue="deal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deal" className="gap-2"><Calculator className="h-4 w-4" />Deal Simulator</TabsTrigger>
            <TabsTrigger value="revenue" className="gap-2"><BarChart3 className="h-4 w-4" />Revenue Intelligence</TabsTrigger>
          </TabsList>

          <TabsContent value="deal"><DealSimulator /></TabsContent>
          <TabsContent value="revenue"><RevenueIntelligence /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
