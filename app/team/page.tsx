"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Briefcase,
  Music,
  Scale,
  Megaphone,
  MapPin
} from "lucide-react"

type ContactRole = "manager" | "agent" | "lawyer" | "publisher" | "label" | "producer" | "engineer" | "collaborator" | "promoter" | "other"

interface Contact {
  id: string
  name: string
  company?: string
  role: ContactRole
  email?: string
  phone?: string
  notes?: string
  rating: number
  lastContact: string
  activeDeals: number
}

const roleColors: Record<ContactRole, string> = {
  manager: "bg-purple-500/10 text-purple-500",
  agent: "bg-blue-500/10 text-blue-500",
  lawyer: "bg-red-500/10 text-red-500",
  publisher: "bg-green-500/10 text-green-500",
  label: "bg-orange-500/10 text-orange-500",
  producer: "bg-yellow-500/10 text-yellow-500",
  engineer: "bg-gray-500/10 text-gray-500",
  collaborator: "bg-teal-500/10 text-teal-500",
  promoter: "bg-pink-500/10 text-pink-500",
  other: "bg-slate-500/10 text-slate-500",
}

const mockContacts: Contact[] = [
  { id: "1", name: "Marcus Johnson", company: "MJ Management", role: "manager", email: "marcus@mjmgmt.com", phone: "+1 310-555-0123", notes: "Primary manager since 2024. 15% commission.", rating: 5, lastContact: "2026-06-20", activeDeals: 2 },
  { id: "2", name: "Sarah Chen", company: "Paradigm Agency", role: "agent", email: "schen@paradigm.com", phone: "+1 212-555-0456", notes: "Booking agent for North America tours.", rating: 4, lastContact: "2026-06-15", activeDeals: 1 },
  { id: "3", name: "David Kim", company: "Kim & Associates", role: "lawyer", email: "dkim@kimlaw.com", notes: "Entertainment attorney. Reviews all contracts.", rating: 5, lastContact: "2026-05-28", activeDeals: 0 },
  { id: "4", name: "Rachel Torres", company: "Kobalt Music", role: "publisher", email: "rtorres@kobalt.com", notes: "Publishing admin. 15% admin fee.", rating: 4, lastContact: "2026-06-10", activeDeals: 1 },
  { id: "5", name: "James Wright", company: "Self-employed", role: "producer", email: "james@studio.com", notes: "Produced 'Midnight Dreams' EP. 3% royalty.", rating: 5, lastContact: "2026-06-18", activeDeals: 1 },
  { id: "6", name: "Lisa Park", company: "Self-employed", role: "engineer", email: "lisa@mixlab.com", notes: "Mixing engineer. $500/day.", rating: 4, lastContact: "2026-06-12", activeDeals: 0 },
  { id: "7", name: "Sam Williams", company: "", role: "collaborator", email: "sam@music.com", notes: "Co-writer on 'City Lights'. 50/50 split.", rating: 5, lastContact: "2026-06-01", activeDeals: 1 },
  { id: "8", name: "Mike Thompson", company: "Live Nation", role: "promoter", email: "mthompson@livenation.com", notes: "Regional promoter for West Coast.", rating: 3, lastContact: "2026-04-20", activeDeals: 0 },
]

function TeamTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<ContactRole | "all">("all")

  const filteredContacts = mockContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesRole = roleFilter === "all" || c.role === roleFilter
    return matchesSearch && matchesRole
  })

  const groupedByRole = filteredContacts.reduce((acc, contact) => {
    if (!acc[contact.role]) acc[contact.role] = []
    acc[contact.role].push(contact)
    return acc
  }, {} as Record<ContactRole, Contact[]>)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          {(["all", "manager", "agent", "lawyer", "producer"] as const).map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter(role)}
              className="capitalize"
            >
              {role}
            </Button>
          ))}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {Object.entries(groupedByRole).map(([role, contacts]) => (
        <div key={role}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 capitalize flex items-center gap-2">
            <Badge variant="outline" className={roleColors[role as ContactRole]}>
              {role}
            </Badge>
            <span>({contacts.length})</span>
          </h3>
          <div className="grid gap-3">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {contact.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.company || "Independent"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < contact.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />
                        ))}
                      </div>
                      {contact.activeDeals > 0 && (
                        <Badge variant="secondary">{contact.activeDeals} active deal{contact.activeDeals > 1 ? "s" : ""}</Badge>
                      )}
                      <div className="flex gap-1">
                        {contact.email && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {contact.phone && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {contact.notes && (
                    <p className="text-sm text-muted-foreground mt-2 pl-13">{contact.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function RolesTab() {
  const roles = [
    { icon: Briefcase, title: "Personal Manager", description: "Oversees all aspects of career. Handles deals, strategy, team building.", typical_split: "15-20% of gross", when_needed: "When you're too busy to handle business yourself" },
    { icon: MapPin, title: "Booking Agent", description: "Books live shows and tours. Negotiates performance fees.", typical_split: "10% of tour proceeds", when_needed: "When you're ready to play regularly outside your local scene" },
    { icon: Scale, title: "Entertainment Lawyer", description: "Reviews contracts, handles legal disputes, protects your rights.", typical_split: "$300-500/hr or 5% of deals", when_needed: "Before signing ANY deal" },
    { icon: Music, title: "Publisher", description: "Licenses your compositions, collects mechanical & performance royalties.", typical_split: "15-25% admin fee or 50/50 co-pub", when_needed: "When you have songs being covered or placed" },
    { icon: Megaphone, title: "Publicist", description: "Gets press coverage, manages media relationships.", typical_split: "$2,000-5,000/month retainer", when_needed: "When releasing new music or touring" },
    { icon: Users, title: "Business Manager", description: "Handles finances, taxes, accounting.", typical_split: "5-10% of income", when_needed: "When income streams become complex" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Team — When to Build It</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <role.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Typical Cost</span>
                  <span className="font-medium">{role.typical_split}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">When Needed</span>
                  <span className="text-right max-w-[60%]">{role.when_needed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Key Rules from the Handbook</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Manager cannot be a booking agent</strong> — managers don't need licenses, agents do</p>
          <p>• <strong>Get everything in writing</strong> — "Your best friend today, worst enemy tomorrow"</p>
          <p>• <strong>Know the difference between net and gross</strong> — this affects how much you actually earn</p>
          <p>• <strong>Power of Attorney</strong> — common for managers to sign deals on your behalf, use carefully</p>
          <p>• <strong>Key Man Clause</strong> — lets you terminate if a specific person leaves the company</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground">Manage your professional contacts and team</p>
        </div>

        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contacts" className="gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Team Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <TeamTab />
          </TabsContent>

          <TabsContent value="roles">
            <RolesTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
