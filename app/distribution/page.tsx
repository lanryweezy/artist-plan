"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Music,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Search,
  RefreshCw,
  Disc,
  Radio,
  Headphones
} from "lucide-react"

interface DSPStatus {
  name: string
  icon: React.ElementType
  status: "active" | "pending" | "not_registered" | "error"
  tracks: number
  lastUpdate: string
  type: "streaming" | "download" | "social"
}

interface ISRCRecord {
  id: string
  code: string
  title: string
  album: string
  artist: string
  releaseDate: string
  dspCount: number
}

const dspStatuses: DSPStatus[] = [
  { name: "Spotify", icon: Music, status: "active", tracks: 24, lastUpdate: "2026-06-20", type: "streaming" },
  { name: "Apple Music", icon: Music, status: "active", tracks: 24, lastUpdate: "2026-06-20", type: "streaming" },
  { name: "YouTube Music", icon: Music, status: "active", tracks: 22, lastUpdate: "2026-06-18", type: "streaming" },
  { name: "Tidal", icon: Music, status: "active", tracks: 20, lastUpdate: "2026-06-15", type: "streaming" },
  { name: "Amazon Music", icon: Music, status: "active", tracks: 24, lastUpdate: "2026-06-20", type: "streaming" },
  { name: "Deezer", icon: Music, status: "active", tracks: 24, lastUpdate: "2026-06-20", type: "streaming" },
  { name: "Pandora", icon: Radio, status: "pending", tracks: 0, lastUpdate: "", type: "streaming" },
  { name: "SoundCloud", icon: Music, status: "active", tracks: 18, lastUpdate: "2026-06-10", type: "streaming" },
  { name: "Bandcamp", icon: Music, status: "active", tracks: 24, lastUpdate: "2026-06-20", type: "download" },
  { name: "iTunes", icon: Music, status: "active", tracks: 24, lastUpdate: "2026-06-20", type: "download" },
  { name: "Beatport", icon: Music, status: "not_registered", tracks: 0, lastUpdate: "", type: "download" },
  { name: "TikTok", icon: Music, status: "active", tracks: 12, lastUpdate: "2026-06-15", type: "social" },
  { name: "Instagram", icon: Music, status: "active", tracks: 8, lastUpdate: "2026-06-12", type: "social" },
  { name: "Facebook", icon: Music, status: "active", tracks: 8, lastUpdate: "2026-06-12", type: "social" },
]

const mockISRCs: ISRCRecord[] = [
  { id: "1", code: "QZAB42600001", title: "Midnight Dreams", album: "Midnight Dreams - Single", artist: "Alex Rivera", releaseDate: "2026-03-15", dspCount: 12 },
  { id: "2", code: "QZAB42600002", title: "Electric Sunset", album: "Electric Sunset - Single", artist: "Alex Rivera", releaseDate: "2026-04-20", dspCount: 11 },
  { id: "3", code: "QZAB42600003", title: "City Lights", album: "City Lights - Single", artist: "Alex Rivera ft. Sam Williams", releaseDate: "2026-05-10", dspCount: 10 },
  { id: "4", code: "QZAB42600004", title: "Summer Nights", album: "Summer Nights - EP", artist: "Alex Rivera", releaseDate: "2026-06-01", dspCount: 9 },
  { id: "5", code: "QZAB42600005", title: "Neon Dreams", album: "Summer Nights - EP", artist: "Alex Rivera", releaseDate: "2026-06-01", dspCount: 9 },
]

function OverviewTab() {
  const activeDSPs = dspStatuses.filter(d => d.status === "active").length
  const pendingDSPs = dspStatuses.filter(d => d.status === "pending").length
  const totalTracks = mockISRCs.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{activeDSPs}</p>
                <p className="text-xs text-muted-foreground">Active DSPs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Disc className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalTracks}</p>
                <p className="text-xs text-muted-foreground">Tracks Distributed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingDSPs}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{dspStatuses.filter(d => d.status === "not_registered").length}</p>
                <p className="text-xs text-muted-foreground">Not Registered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribution Status</CardTitle>
          <CardDescription>Where your music is available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {["streaming", "download", "social"].map((type) => (
              <div key={type}>
                <p className="text-sm font-medium text-muted-foreground mb-2 capitalize">{type} Platforms</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {dspStatuses.filter(d => d.type === type).map((dsp) => (
                    <div key={dsp.name} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <dsp.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{dsp.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dsp.tracks > 0 && <span className="text-xs text-muted-foreground">{dsp.tracks} tracks</span>}
                        <Badge variant={dsp.status === "active" ? "default" : dsp.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                          {dsp.status === "active" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                          {dsp.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ISRCTab() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredISRCs = mockISRCs.filter(isrc =>
    isrc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    isrc.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or ISRC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate ISRC
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredISRCs.map((isrc) => (
          <Card key={isrc.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Disc className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{isrc.title}</p>
                    <p className="text-sm text-muted-foreground">{isrc.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-sm">{isrc.code}</p>
                    <p className="text-xs text-muted-foreground">Released: {new Date(isrc.releaseDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">{isrc.dspCount} DSPs</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>ISRC Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>What:</strong> 12-digit code for each unique sound recording</p>
          <p><strong>Format:</strong> Country (2) + Registrant (3) + Year (2) + Designation (5)</p>
          <p><strong>Example:</strong> USCA21001262 (Katy Perry - Firework)</p>
          <p><strong>Get yours:</strong> USISRC.org ($95 one-time for registrant code) or via distributor</p>
          <p><strong>Important:</strong> Same recording = same ISRC forever. Remixes and covers need new ISRCs.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function MetadataTab() {
  const checks = [
    { name: "ISRC codes assigned to all tracks", status: "pass" as const, count: "24/24" },
    { name: "Song titles match across DSPs", status: "pass" as const, count: "24/24" },
    { name: "Artist name consistency", status: "pass" as const, count: "24/24" },
    { name: "Album artwork uploaded", status: "pass" as const, count: "6/6" },
    { name: "Genre tags assigned", status: "pass" as const, count: "24/24" },
    { name: "Copyright owner info", status: "warning" as const, count: "20/24" },
    { name: "Lyrics submitted", status: "fail" as const, count: "12/24" },
    { name: "ISWC codes registered", status: "warning" as const, count: "3/4" },
    { name: "MLC registration", status: "fail" as const, count: "0/4" },
    { name: "YouTube Content ID claims", status: "warning" as const, count: "18/24" },
  ]

  const passed = checks.filter(c => c.status === "pass").length
  const warnings = checks.filter(c => c.status === "warning").length
  const failed = checks.filter(c => c.status === "fail").length
  const score = Math.round((passed / checks.length) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Metadata Health Score</CardTitle>
              <CardDescription>Based on {checks.length} checks across your catalog</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{score}%</p>
              <p className="text-sm text-muted-foreground">{passed} passed, {warnings} warnings, {failed} failed</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === "pass" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {check.status === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  {check.status === "fail" && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <span className="text-sm font-medium">{check.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{check.count}</span>
                  <Badge variant={check.status === "pass" ? "default" : check.status === "warning" ? "secondary" : "destructive"}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Metadata Matters</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>According to the Exploration.io handbook, unclaimed royalties due to bad metadata sit in "black box" pools that get distributed by market share — meaning major labels get your money.</p>
          <p><strong>Key metadata to keep clean:</strong></p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>ISRC codes (sound recordings) — how streams are tracked</li>
            <li>ISWC codes (compositions) — how performance royalties are tracked</li>
            <li>IPI numbers — how writers are identified across PROs</li>
            <li>Publisher splits — who gets paid what percentage</li>
            <li>Territory rights — where you control the music</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function DistributionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Distribution</h1>
          <p className="text-muted-foreground">Track DSP presence, ISRC codes, and metadata health</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Globe className="h-4 w-4" />
              DSP Status
            </TabsTrigger>
            <TabsTrigger value="isrc" className="gap-2">
              <Disc className="h-4 w-4" />
              ISRC Codes
            </TabsTrigger>
            <TabsTrigger value="metadata" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Metadata Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="isrc">
            <ISRCTab />
          </TabsContent>

          <TabsContent value="metadata">
            <MetadataTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
