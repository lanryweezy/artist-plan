"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  FileText,
  Users,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Search
} from "lucide-react"

type DealType = "admin" | "co_publishing" | "exclusive" | "work_for_hire" | "individual" | "none"
type SplitStatus = "confirmed" | "pending" | "disputed"

interface Song {
  id: string
  title: string
  iswc?: string
  writers: { name: string; split: number; ipi?: string }[]
  publishers: { name: string; split: number; dealType: DealType }[]
  status: "registered" | "pending" | "unregistered"
  territory: string
}

interface PublishingDeal {
  id: string
  publisher: string
  type: DealType
  startDate: string
  endDate?: string
  split: number
  adminFee?: number
  advance?: number
  recoupmentStatus?: string
}

const mockSongs: Song[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    iswc: "T-345.678.432-1",
    writers: [
      { name: "Alex Rivera", split: 60, ipi: "00287456312" },
      { name: "Jordan Chen", split: 40, ipi: "00319876543" }
    ],
    publishers: [
      { name: "Alex Rivera Music (Self)", split: 60, dealType: "none" },
      { name: "Warner Chappell", split: 40, dealType: "co_publishing" }
    ],
    status: "registered",
    territory: "Worldwide"
  },
  {
    id: "2",
    title: "Electric Sunset",
    iswc: "T-789.123.456-7",
    writers: [
      { name: "Alex Rivera", split: 100, ipi: "00287456312" }
    ],
    publishers: [
      { name: "Alex Rivera Music", split: 100, dealType: "admin" }
    ],
    status: "registered",
    territory: "Worldwide"
  },
  {
    id: "3",
    title: "City Lights",
    writers: [
      { name: "Alex Rivera", split: 50, ipi: "00287456312" },
      { name: "Sam Williams", split: 50, ipi: "00456789012" }
    ],
    publishers: [
      { name: "Alex Rivera Music", split: 50, dealType: "none" },
      { name: "Williams Publishing", split: 50, dealType: "admin" }
    ],
    status: "unregistered",
    territory: "United States"
  },
  {
    id: "4",
    title: "Summer Nights",
    iswc: "T-111.222.333-4",
    writers: [
      { name: "Alex Rivera", split: 33, ipi: "00287456312" },
      { name: "Jordan Chen", split: 34, ipi: "00319876543" },
      { name: "Taylor Kim", split: 33, ipi: "00567890123" }
    ],
    publishers: [
      { name: "Kobalt Music", split: 100, dealType: "exclusive" }
    ],
    status: "registered",
    territory: "Worldwide"
  }
]

const mockDeals: PublishingDeal[] = [
  {
    id: "1",
    publisher: "Kobalt Music",
    type: "admin",
    startDate: "2024-06-01",
    endDate: "2029-06-01",
    split: 85,
    adminFee: 15,
    advance: 10000,
    recoupmentStatus: "Recouped"
  },
  {
    id: "2",
    publisher: "Warner Chappell",
    type: "co_publishing",
    startDate: "2025-01-15",
    endDate: "2030-01-15",
    split: 75,
    advance: 25000,
    recoupmentStatus: "$8,200 remaining"
  }
]

const dealTypeLabels: Record<DealType, string> = {
  admin: "Administration",
  co_publishing: "Co-Publishing",
  exclusive: "Exclusive Songwriting",
  work_for_hire: "Work for Hire",
  individual: "Individual Song",
  none: "Self-Published"
}

const dealTypeColors: Record<DealType, string> = {
  admin: "bg-blue-500/10 text-blue-500",
  co_publishing: "bg-purple-500/10 text-purple-500",
  exclusive: "bg-orange-500/10 text-orange-500",
  work_for_hire: "bg-red-500/10 text-red-500",
  individual: "bg-green-500/10 text-green-500",
  none: "bg-gray-500/10 text-gray-500"
}

function SongCatalogTab() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSongs = mockSongs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.writers.some(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const statusIcon = (status: Song["status"]) => {
    switch (status) {
      case "registered": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "unregistered": return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs, writers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Register Song
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredSongs.map((song) => (
          <Card key={song.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{song.title}</CardTitle>
                  <CardDescription>
                    {song.iswc ? `ISWC: ${song.iswc}` : "No ISWC assigned"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{song.territory}</Badge>
                  <Badge variant={song.status === "registered" ? "default" : "destructive"}>
                    {statusIcon(song.status)}
                    <span className="ml-1 capitalize">{song.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Writers</p>
                  {song.writers.map((writer, i) => (
                    <div key={i} className="flex items-center justify-between text-sm mb-1">
                      <span>{writer.name}</span>
                      <div className="flex items-center gap-2">
                        {writer.ipi && <span className="text-xs text-muted-foreground">IPI: {writer.ipi}</span>}
                        <Badge variant="secondary">{writer.split}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Publishers</p>
                  {song.publishers.map((pub, i) => (
                    <div key={i} className="flex items-center justify-between text-sm mb-1">
                      <span>{pub.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={dealTypeColors[pub.dealType]}>
                          {dealTypeLabels[pub.dealType]}
                        </Badge>
                        <Badge variant="secondary">{pub.split}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DealsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Publishing Deals</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid gap-4">
        {mockDeals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{deal.publisher}</CardTitle>
                  <CardDescription>{dealTypeLabels[deal.type]}</CardDescription>
                </div>
                <Badge variant="outline" className={dealTypeColors[deal.type]}>
                  {deal.type.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Writer Share</p>
                  <p className="font-medium text-lg">{deal.split}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{deal.adminFee ? "Admin Fee" : "Publisher Share"}</p>
                  <p className="font-medium">{deal.adminFee ? `${deal.adminFee}%` : `${100 - deal.split}%`}</p>
                </div>
                {deal.advance && (
                  <div>
                    <p className="text-muted-foreground">Advance</p>
                    <p className="font-medium">${deal.advance.toLocaleString()}</p>
                  </div>
                )}
                {deal.recoupmentStatus && (
                  <div>
                    <p className="text-muted-foreground">Recoupment</p>
                    <p className="font-medium">{deal.recoupmentStatus}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {new Date(deal.startDate).toLocaleDateString()} - {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : "Ongoing"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Publishing Deal Types</CardTitle>
          <CardDescription>Understanding your publishing options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-blue-500">Administration</p>
              <p className="text-sm text-muted-foreground">You keep 100% ownership. Publisher takes 10-25% admin fee off the top. Most common for indie artists.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-purple-500">Co-Publishing</p>
              <p className="text-sm text-muted-foreground">You get 50% writer + 25% publisher share (75% total). Publisher gets 25% publisher share. Good leverage deal.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-orange-500">Exclusive Songwriting</p>
              <p className="text-sm text-muted-foreground">You commit to writing X songs per year. All copyrights transfer to publisher. Traditional but declining.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-red-500">Work for Hire</p>
              <p className="text-sm text-muted-foreground">Publisher owns 100%. You get a one-time fee. No termination rights. Avoid unless film/TV commission.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SplitSheetsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Split Sheets & Splits</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Split Sheet
        </Button>
      </div>

      {mockSongs.map((song) => (
        <Card key={song.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{song.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {song.writers.map((writer, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {writer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{writer.name}</p>
                      {writer.ipi && <p className="text-xs text-muted-foreground">IPI: {writer.ipi}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-lg">{writer.split}%</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-2 border-t mt-2">
                <span className="text-sm font-medium">Total</span>
                <span className="font-bold">{song.writers.reduce((sum, w) => sum + w.split, 0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PublishingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Publishing</h1>
          <p className="text-muted-foreground">Manage your song catalog, publishing deals, and writer splits</p>
        </div>

        <Tabs defaultValue="catalog" className="space-y-4">
          <TabsList>
            <TabsTrigger value="catalog" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Song Catalog
            </TabsTrigger>
            <TabsTrigger value="deals" className="gap-2">
              <FileText className="h-4 w-4" />
              Deals
            </TabsTrigger>
            <TabsTrigger value="splits" className="gap-2">
              <Users className="h-4 w-4" />
              Split Sheets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <SongCatalogTab />
          </TabsContent>

          <TabsContent value="deals">
            <DealsTab />
          </TabsContent>

          <TabsContent value="splits">
            <SplitSheetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
