"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Search, Music, Percent, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface Song { id: string; title: string; isrc?: string; iswc?: string; writers: { name: string; split: number; ipi?: string }[]; publishers: { name: string; split: number; deal: string }[]; status: "registered" | "pending" | "unregistered" }

const mockSongs: Song[] = [
  { id: "1", title: "Midnight Dreams", isrc: "QZAB42600001", iswc: "T-345.678.432-1", writers: [{ name: "Alex Rivera", split: 60, ipi: "00287456312" }, { name: "Jordan Chen", split: 40, ipi: "00319876543" }], publishers: [{ name: "Alex Rivera Music", split: 60, deal: "self" }, { name: "Warner Chappell", split: 40, deal: "co-pub" }], status: "registered" },
  { id: "2", title: "Electric Sunset", iswc: "T-789.123.456-7", writers: [{ name: "Alex Rivera", split: 100, ipi: "00287456312" }], publishers: [{ name: "Alex Rivera Music", split: 100, deal: "admin" }], status: "registered" },
  { id: "3", title: "City Lights", writers: [{ name: "Alex Rivera", split: 50, ipi: "00287456312" }, { name: "Sam Williams", split: 50, ipi: "00456789012" }], publishers: [{ name: "Alex Rivera Music", split: 50, deal: "self" }, { name: "Williams Publishing", split: 50, deal: "admin" }], status: "unregistered" },
]

export default function PublishingPage() {
  const [search, setSearch] = useState("")
  const filtered = mockSongs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Publishing</h1><p className="text-muted-foreground">Your song catalog, splits, and deals</p></div>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Song</Button>
        </div>

        <div className="relative max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search songs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>

        <div className="grid gap-4">
          {filtered.map(song => (
            <Card key={song.id} className={song.status !== "registered" ? "border-yellow-500/30" : ""}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {song.isrc && `ISRC: ${song.isrc}`}
                        {song.iswc && ` • ISWC: ${song.iswc}`}
                        {!song.isrc && !song.iswc && "No codes assigned"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={song.status === "registered" ? "default" : "destructive"} className="text-xs">
                    {song.status === "registered" ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                    {song.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Writers</p>
                    {song.writers.map((w, i) => (
                      <div key={i} className="flex justify-between"><span>{w.name}</span><span className="font-medium">{w.split}%</span></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Publishers</p>
                    {song.publishers.map((p, i) => (
                      <div key={i} className="flex justify-between"><span>{p.name}</span><Badge variant="outline" className="text-xs">{p.split}% {p.deal}</Badge></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
