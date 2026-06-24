"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Mail, Phone, ExternalLink, Star } from "lucide-react"

interface Contact { id: string; name: string; company?: string; role: string; email?: string; phone?: string; rating: number }

const mockContacts: Contact[] = [
  { id: "1", name: "Marcus Johnson", company: "MJ Management", role: "manager", email: "marcus@mjmgmt.com", phone: "+1 310-555-0123", rating: 5 },
  { id: "2", name: "Sarah Chen", company: "Paradigm Agency", role: "agent", email: "schen@paradigm.com", rating: 4 },
  { id: "3", name: "David Kim", company: "Kim & Associates", role: "lawyer", email: "dkim@kimlaw.com", rating: 5 },
  { id: "4", name: "James Wright", role: "producer", email: "james@studio.com", rating: 5 },
  { id: "5", name: "Lisa Park", role: "engineer", email: "lisa@mixlab.com", rating: 4 },
]

const roleColors: Record<string, string> = { manager: "bg-purple-500/10 text-purple-500", agent: "bg-blue-500/10 text-blue-500", lawyer: "bg-red-500/10 text-red-500", producer: "bg-yellow-500/10 text-yellow-500", engineer: "bg-gray-500/10 text-gray-500" }

export default function TeamPage() {
  const [search, setSearch] = useState("")
  const filtered = mockContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Team</h1><p className="text-muted-foreground">Your professional contacts</p></div>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Contact</Button>
        </div>
        <div className="relative max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <div className="grid gap-3">
          {filtered.map(c => (
            <Card key={c.id} className="hover:shadow-md"><CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">{c.name.split(" ").map(n => n[0]).join("")}</div>
                  <div><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">{c.company || "Independent"} • {c.role}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < c.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />)}</div>
                  {c.email && <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Mail className="h-3.5 w-3.5" /></Button>}
                  {c.phone && <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Phone className="h-3.5 w-3.5" /></Button>}
                </div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
