"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Heart, Star, Mail, DollarSign, Search, Plus, Music, Calendar, TrendingUp, Target, BarChart3, AlertCircle, CheckCircle } from "lucide-react"

type Tier = "listener" | "superfan" | "vip"
interface Fan { id: string; name: string; email?: string; tier: Tier; spend: number; events: number; lastActive: string; tags: string[] }

const tierConfig: Record<Tier, { label: string; color: string; icon: React.ElementType }> = {
  listener: { label: "Listener", color: "bg-gray-500/10 text-gray-500", icon: Music },
  superfan: { label: "Superfan", color: "bg-blue-500/10 text-blue-500", icon: Heart },
  vip: { label: "VIP", color: "bg-yellow-500/10 text-yellow-500", icon: Star },
}

const mockFans: Fan[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@email.com", tier: "vip", spend: 850, events: 12, lastActive: "2026-06-20", tags: ["merch buyer", "newsletter"] },
  { id: "2", name: "James Rodriguez", email: "james@email.com", tier: "superfan", spend: 120, events: 3, lastActive: "2026-06-18", tags: ["playlist curator"] },
  { id: "3", name: "Emily Chen", email: "emily@email.com", tier: "superfan", spend: 340, events: 5, lastActive: "2026-06-15", tags: ["vinyl collector"] },
  { id: "4", name: "Marcus Johnson", tier: "listener", spend: 0, events: 0, lastActive: "2026-06-10", tags: ["spotify listener"] },
  { id: "5", name: "Lisa Park", email: "lisa@email.com", tier: "vip", spend: 1200, events: 18, lastActive: "2026-06-22", tags: ["founding fan", "ambassador"] },
]

export default function FansPage() {
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all")
  const filtered = mockFans.filter(f => (tierFilter === "all" || f.tier === tierFilter) && f.name.toLowerCase().includes(search.toLowerCase()))
  const totalSpend = mockFans.reduce((s, f) => s + f.spend, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Fans</h1><p className="text-muted-foreground">Your fan CRM — understand, engage, grow</p></div>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Fan</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-3"><p className="text-2xl font-bold">{mockFans.length}</p><p className="text-xs text-muted-foreground">Total Fans</p></CardContent></Card>
          <Card><CardContent className="p-3"><p className="text-2xl font-bold text-yellow-500">{mockFans.filter(f => f.tier === "vip").length}</p><p className="text-xs text-muted-foreground">VIP</p></CardContent></Card>
          <Card><CardContent className="p-3"><p className="text-2xl font-bold text-blue-500">{mockFans.filter(f => f.tier === "superfan").length}</p><p className="text-xs text-muted-foreground">Superfans</p></CardContent></Card>
          <Card><CardContent className="p-3"><p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Spend</p></CardContent></Card>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search fans..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          {(["all", "vip", "superfan", "listener"] as const).map(t => (
            <Button key={t} variant={tierFilter === t ? "default" : "outline"} size="sm" onClick={() => setTierFilter(t)} className="capitalize">{t}</Button>
          ))}
        </div>
        <div className="grid gap-3">
          {filtered.map(fan => {
            const tc = tierConfig[fan.tier]
            const TI = tc.icon
            return (
              <Card key={fan.id} className="hover:shadow-md"><CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">{fan.name.split(" ").map(n => n[0]).join("")}</div>
                    <div><p className="font-medium">{fan.name}</p><p className="text-sm text-muted-foreground">{fan.email || "No email"}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right"><p className="font-medium">${fan.spend}</p><p className="text-xs text-muted-foreground">{fan.events} events</p></div>
                    <Badge variant="outline" className={tc.color}><TI className="h-3 w-3 mr-1" />{tc.label}</Badge>
                  </div>
                </div>
              </CardContent></Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
