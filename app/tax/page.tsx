"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, DollarSign, FileText, Plus, Download, Receipt, Search } from "lucide-react"

interface Entry { id: string; date: string; description: string; category: string; amount: number; type: "income" | "expense"; deductible: boolean; receipt: boolean }

const mockEntries: Entry[] = [
  { id: "1", date: "2026-06-01", description: "Spotify streams", category: "streaming", amount: 1247, type: "income", deductible: false, receipt: false },
  { id: "2", date: "2026-06-01", description: "Apple Music streams", category: "streaming", amount: 892, type: "income", deductible: false, receipt: false },
  { id: "3", date: "2026-05-20", description: "Sync placement", category: "sync", amount: 3500, type: "income", deductible: false, receipt: false },
  { id: "4", date: "2026-06-10", description: "Live show", category: "live", amount: 1200, type: "income", deductible: false, receipt: false },
  { id: "5", date: "2026-06-05", description: "Microphone", category: "equipment", amount: 399, type: "expense", deductible: true, receipt: true },
  { id: "6", date: "2026-06-08", description: "Studio time", category: "studio", amount: 500, type: "expense", deductible: true, receipt: true },
  { id: "7", date: "2026-06-12", description: "Gas — Gig travel", category: "travel", amount: 85, type: "expense", deductible: true, receipt: true },
  { id: "8", date: "2026-06-20", description: "Legal review", category: "legal", amount: 750, type: "expense", deductible: true, receipt: true },
]

export default function TaxPage() {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all")
  const filtered = mockEntries.filter(e => filter === "all" || e.type === filter)
  const totalIncome = mockEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const totalExpenses = mockEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const deductible = mockEntries.filter(e => e.type === "expense" && e.deductible).reduce((s, e) => s + e.amount, 0)
  const net = totalIncome - totalExpenses
  const seTax = Math.round(net * 0.9235 * 0.153)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Tax</h1><p className="text-muted-foreground">Schedule C tracking for musicians</p></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export CSV</Button>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Entry</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Gross Income</p><p className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Deductible Expenses</p><p className="text-2xl font-bold text-red-500">-${deductible.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Net Profit (Schedule C)</p><p className="text-2xl font-bold">${net.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Est. Self-Employment Tax</p><p className="text-2xl font-bold text-orange-500">${seTax.toLocaleString()}</p></CardContent></Card>
        </div>

        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(entry => (
            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                <div>
                  <p className="text-sm font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {entry.deductible && <Badge variant="outline" className="text-xs text-green-500">Deductible</Badge>}
                {entry.receipt && <Badge variant="secondary" className="text-xs">Receipt</Badge>}
                <span className={`font-bold ${entry.type === "income" ? "text-green-500" : "text-red-500"}`}>
                  {entry.type === "income" ? "+" : "-"}${entry.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Tax Filing Guide</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Schedule C (Form 1040):</strong> Report income and expenses from your music business as self-employed.</p>
            <p><strong>1099-MISC/NEC:</strong> Every entity that pays you $600+ should send a 1099. Collect from label, publisher, PRO.</p>
            <p><strong>Quarterly Estimated Taxes:</strong> Pay quarterly (Apr 15, Jun 15, Sep 15, Jan 15) using Form 1040-ES.</p>
            <p><strong>Home Office:</strong> Deduct portion of rent/utilities if you have dedicated music workspace.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
