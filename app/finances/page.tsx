"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, DollarSign, TrendingUp, TrendingDown, Search, Download, Music, Globe, Users, Calendar } from "lucide-react"

type EntryType = "income" | "expense"
type IncomeCategory = "streaming" | "sync" | "live" | "merch" | "publishing" | "session" | "teaching" | "other"
type ExpenseCategory = "equipment" | "travel" | "studio" | "marketing" | "legal" | "insurance" | "home_office" | "education" | "other"

interface Entry { id: string; date: string; description: string; category: string; amount: number; source: string; type: EntryType }

const catColors: Record<string, string> = { streaming: "bg-blue-500/10 text-blue-500", sync: "bg-purple-500/10 text-purple-500", live: "bg-green-500/10 text-green-500", merch: "bg-orange-500/10 text-orange-500", publishing: "bg-yellow-500/10 text-yellow-500", session: "bg-teal-500/10 text-teal-500", equipment: "bg-blue-500/10 text-blue-500", travel: "bg-green-500/10 text-green-500", studio: "bg-purple-500/10 text-purple-500", marketing: "bg-orange-500/10 text-orange-500", legal: "bg-red-500/10 text-red-500" }

const mockEntries: Entry[] = [
  { id: "1", date: "2026-06-01", description: "Spotify streams — May", category: "streaming", amount: 1247, source: "DistroKid", type: "income" },
  { id: "2", date: "2026-06-01", description: "Apple Music streams — May", category: "streaming", amount: 892, source: "DistroKid", type: "income" },
  { id: "3", date: "2026-05-20", description: "Sync placement — Netflix ad", category: "sync", amount: 3500, source: "Publisher", type: "income" },
  { id: "4", date: "2026-06-10", description: "Live show @ Blue Note", category: "live", amount: 1200, source: "Direct", type: "income" },
  { id: "5", date: "2026-06-15", description: "T-shirt sales — Online store", category: "merch", amount: 680, source: "Shopify", type: "income" },
  { id: "6", date: "2026-06-20", description: "YouTube Content ID", category: "streaming", amount: 634, source: "YouTube", type: "income" },
  { id: "7", date: "2026-05-15", description: "Session work — Guest vocal", category: "session", amount: 750, source: "Direct", type: "income" },
  { id: "8", date: "2026-06-01", description: "Mechanical royalties — May", category: "publishing", amount: 234, source: "MLC", type: "income" },
  { id: "9", date: "2026-06-01", description: "Performance royalties — May", category: "publishing", amount: 178, source: "ASCAP", type: "income" },
  { id: "10", date: "2026-06-05", description: "New microphone (Shure SM7B)", category: "equipment", amount: 399, source: "Sweetwater", type: "expense" },
  { id: "11", date: "2026-06-08", description: "Studio time — Mixing session", category: "studio", amount: 500, source: "Sunset Sound", type: "expense" },
  { id: "12", date: "2026-06-12", description: "Gas — Gig travel", category: "travel", amount: 85, source: "Shell", type: "expense" },
  { id: "13", date: "2026-06-15", description: "Instagram ads — Single promotion", category: "marketing", amount: 150, source: "Meta", type: "expense" },
  { id: "14", date: "2026-06-20", description: "Legal review — Publishing deal", category: "legal", amount: 750, source: "Kim & Associates", type: "expense" },
]

export default function FinancesPage() {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all")
  const [search, setSearch] = useState("")

  const filtered = mockEntries.filter(e => {
    const matchType = filter === "all" || e.type === filter
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totalIncome = mockEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const totalExpenses = mockEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const net = totalIncome - totalExpenses

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Finances</h1><p className="text-muted-foreground">Track every dollar in and out</p></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Entry</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Income</p><p className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Expenses</p><p className="text-2xl font-bold text-red-500">-${totalExpenses.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Net Profit</p><p className={`text-2xl font-bold ${net >= 0 ? "text-green-500" : "text-red-500"}`}>${net.toLocaleString()}</p></CardContent></Card>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          {(["all", "income", "expense"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(entry => (
            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`text-xs ${catColors[entry.category] || ""}`}>{entry.category}</Badge>
                <div>
                  <p className="text-sm font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{entry.source} • {new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-bold ${entry.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {entry.type === "income" ? "+" : "-"}${entry.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
