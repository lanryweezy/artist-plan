"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, TrendingDown, Music, Radio, Video, FileText, Download, Plus, Search, Calculator, Globe, AlertCircle, CheckCircle } from "lucide-react"

// Finances Tab
function FinancesTab() {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all")
  const entries = [
    { id: "1", date: "2026-06-01", desc: "Spotify streams", cat: "streaming", amount: 1247, source: "DistroKid", type: "income" },
    { id: "2", date: "2026-06-01", desc: "Apple Music streams", cat: "streaming", amount: 892, source: "DistroKid", type: "income" },
    { id: "3", date: "2026-05-20", desc: "Sync placement - Netflix", cat: "sync", amount: 3500, source: "Publisher", type: "income" },
    { id: "4", date: "2026-06-10", desc: "Live show @ Blue Note", cat: "live", amount: 1200, source: "Direct", type: "income" },
    { id: "5", date: "2026-06-05", desc: "Microphone (Shure SM7B)", cat: "equipment", amount: 399, source: "Sweetwater", type: "expense" },
    { id: "6", date: "2026-06-08", desc: "Studio time", cat: "studio", amount: 500, source: "Sunset Sound", type: "expense" },
    { id: "7", date: "2026-06-20", desc: "Legal review", cat: "legal", amount: 750, source: "Kim & Associates", type: "expense" },
  ]
  const filtered = entries.filter(e => filter === "all" || e.type === filter)
  const income = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const expenses = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const net = income - expenses

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Income</p><p className="text-2xl font-bold text-green-500">${income.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Expenses</p><p className="text-2xl font-bold text-red-500">-${expenses.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Net Profit</p><p className={`text-2xl font-bold ${net >= 0 ? "text-green-500" : "text-red-500"}`}>${net.toLocaleString()}</p></CardContent></Card>
      </div>
      <div className="flex gap-2">
        {(["all", "income", "expense"] as const).map(f => <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>)}
      </div>
      <div className="space-y-2">
        {filtered.map(e => (
          <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">{e.cat}</Badge>
              <div><p className="text-sm font-medium">{e.desc}</p><p className="text-xs text-muted-foreground">{e.source} • {new Date(e.date).toLocaleDateString()}</p></div>
            </div>
            <span className={`font-bold ${e.type === "income" ? "text-green-500" : "text-red-500"}`}>{e.type === "income" ? "+" : "-"}${e.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Royalties Tab
function RoyaltiesTab() {
  const streams = [
    { name: "Spotify", amount: 1247, change: 12.5 },
    { name: "Apple Music", amount: 892, change: 8.3 },
    { name: "YouTube", amount: 634, change: 15.2 },
    { name: "SoundCloud", amount: 189, change: -2.1 },
  ]
  const royalties = [
    { name: "Performance (ASCAP)", amount: 561, collected: true },
    { name: "Mechanical (MLC)", amount: 445, collected: false },
    { name: "SoundExchange", amount: 423, collected: false },
    { name: "Sync Fees", amount: 3500, collected: true },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Streaming</p><p className="text-lg font-bold">${streams.reduce((s, r) => s + r.amount, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Royalties</p><p className="text-lg font-bold">${royalties.reduce((s, r) => s + r.amount, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">${(streams.reduce((s, r) => s + r.amount, 0) + royalties.reduce((s, r) => s + r.amount, 0)).toLocaleString()}</p></CardContent></Card>
        <Card className="border-red-500/30"><CardContent className="p-3"><p className="text-xs text-muted-foreground">Uncollected</p><p className="text-lg font-bold text-red-500">${royalties.filter(r => !r.collected).reduce((s, r) => s + r.amount, 0).toLocaleString()}</p></CardContent></Card>
      </div>
      <h4 className="font-medium text-sm">Streaming by Platform</h4>
      <div className="space-y-2">
        {streams.map(s => (
          <div key={s.name} className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">{s.name}</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${s.change >= 0 ? "text-green-500" : "text-red-500"}`}>{s.change >= 0 ? "+" : ""}{s.change}%</span>
              <span className="font-medium text-sm">${s.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      <h4 className="font-medium text-sm">Royalty Sources</h4>
      <div className="space-y-2">
        {royalties.map(r => (
          <div key={r.name} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              {r.collected ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">{r.name}</span>
            </div>
            <span className="font-medium text-sm">${r.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Tax Tab
function TaxTab() {
  const totalIncome = 9924
  const deductible = 1649
  const net = totalIncome - deductible
  const seTax = Math.round(net * 0.9235 * 0.153)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Gross Income</p><p className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Deductible</p><p className="text-2xl font-bold text-red-500">-${deductible.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Net (Schedule C)</p><p className="text-2xl font-bold">${net.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Est. SE Tax</p><p className="text-2xl font-bold text-orange-500">${seTax.toLocaleString()}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Tax Filing Guide</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Schedule C:</strong> Report income/expenses from music business as self-employed.</p>
          <p><strong>1099-MISC/NEC:</strong> Collect from every entity paying you $600+.</p>
          <p><strong>Quarterly Estimates:</strong> Pay Apr 15, Jun 15, Sep 15, Jan 15 using Form 1040-ES.</p>
          <p><strong>Home Office:</strong> Deduct portion of rent/utilities if you have dedicated music workspace.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MoneyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Money</h1><p className="text-muted-foreground">Income, royalties, and tax tracking</p></div>
        <Tabs defaultValue="finances" className="space-y-4">
          <TabsList>
            <TabsTrigger value="finances" className="gap-2"><DollarSign className="h-4 w-4" />Finances</TabsTrigger>
            <TabsTrigger value="royalties" className="gap-2"><TrendingUp className="h-4 w-4" />Royalties</TabsTrigger>
            <TabsTrigger value="tax" className="gap-2"><FileText className="h-4 w-4" />Tax</TabsTrigger>
          </TabsList>
          <TabsContent value="finances"><FinancesTab /></TabsContent>
          <TabsContent value="royalties"><RoyaltiesTab /></TabsContent>
          <TabsContent value="tax"><TaxTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
