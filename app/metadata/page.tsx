"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  RefreshCw,
  FileText,
  Shield,
  Music,
  Globe,
  Database,
  Zap
} from "lucide-react"

type CheckStatus = "pass" | "warning" | "fail" | "missing"

interface MetadataCheck {
  id: string
  name: string
  description: string
  status: CheckStatus
  impact: string
  fix: string
  agency?: string
}

interface SongMetadata {
  id: string
  title: string
  isrc?: string
  iswc?: string
  ipi?: string
  writerSplits?: number
  publisherSplits?: number
  territory?: string
  checks: MetadataCheck[]
}

const mockSongs: SongMetadata[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    isrc: "QZAB42600001",
    iswc: "T-345.678.432-1",
    ipi: "00287456312",
    writerSplits: 100,
    publisherSplits: 100,
    territory: "Worldwide",
    checks: [
      { id: "c1", name: "ISRC assigned", description: "Sound recording identifier", status: "pass", impact: "Required for streaming tracking", fix: "Assign via distributor", agency: "Distributor" },
      { id: "c2", name: "ISWC registered", description: "Composition identifier", status: "pass", impact: "Required for performance royalty tracking", fix: "Register with ASCAP or MLC", agency: "ASCAP/MLC" },
      { id: "c3", name: "IPI number linked", description: "Writer identification", status: "pass", impact: "Required for PRO royalty distribution", fix: "Register with PRO", agency: "ASCAP/BMI" },
      { id: "c4", name: "Writer splits total 100%", description: "All writers accounted for", status: "pass", impact: "Missing splits = uncollected royalties", fix: "Update split sheet" },
      { id: "c5", name: "Publisher splits total 100%", description: "All publishers accounted for", status: "pass", impact: "Missing publisher = mechanical royalties to black box", fix: "Register with MLC/HFA" },
      { id: "c6", name: "MLC registration", description: "Registered with Mechanical Licensing Collective", status: "pass", impact: "Streaming mechanicals collected", fix: "Register at themlc.com", agency: "MLC" },
      { id: "c7", name: "HFA registration", description: "Registered with Harry Fox Agency", status: "warning", impact: "Physical mechanicals may not be collected", fix: "Register at harryfox.com", agency: "HFA" },
      { id: "c8", name: "YouTube Content ID", description: "Referenced in YouTube CMS", status: "pass", impact: "Content ID claims and monetization", fix: "Upload via aggregator", agency: "YouTube" },
      { id: "c9", name: "Lyrics submitted", description: "Lyrics available for licensing", status: "pass", impact: "Lyric display royalties", fix: "Submit via distributor or LyricFind", agency: "LyricFind" },
      { id: "c10", name: "Copyright registered", description: "Registered with US Copyright Office", status: "warning", impact: "Cannot file infringement suits without registration", fix: "Register at copyright.gov ($35-45)", agency: "USCO" },
    ]
  },
  {
    id: "2",
    title: "Electric Sunset",
    isrc: "QZAB42600002",
    writerSplits: 100,
    publisherSplits: 100,
    territory: "Worldwide",
    checks: [
      { id: "c1", name: "ISRC assigned", description: "Sound recording identifier", status: "pass", impact: "Required for streaming tracking", fix: "Assign via distributor", agency: "Distributor" },
      { id: "c2", name: "ISWC registered", description: "Composition identifier", status: "missing", impact: "Performance royalties may not be tracked", fix: "Register with ASCAP or MLC", agency: "ASCAP/MLC" },
      { id: "c3", name: "IPI number linked", description: "Writer identification", status: "pass", impact: "Required for PRO royalty distribution", fix: "Register with PRO", agency: "ASCAP/BMI" },
      { id: "c4", name: "Writer splits total 100%", description: "All writers accounted for", status: "pass", impact: "Missing splits = uncollected royalties", fix: "Update split sheet" },
      { id: "c5", name: "Publisher splits total 100%", description: "All publishers accounted for", status: "pass", impact: "Missing publisher = mechanical royalties to black box", fix: "Register with MLC/HFA" },
      { id: "c6", name: "MLC registration", description: "Registered with Mechanical Licensing Collective", status: "fail", impact: "NO streaming mechanicals collected", fix: "Register at themlc.com IMMEDIATELY", agency: "MLC" },
      { id: "c7", name: "HFA registration", description: "Registered with Harry Fox Agency", status: "fail", impact: "NO physical mechanicals collected", fix: "Register at harryfox.com", agency: "HFA" },
      { id: "c8", name: "YouTube Content ID", description: "Referenced in YouTube CMS", status: "warning", impact: "May not be monetized on YouTube", fix: "Upload via aggregator", agency: "YouTube" },
      { id: "c9", name: "Lyrics submitted", description: "Lyrics available for licensing", status: "missing", impact: "No lyric display royalties", fix: "Submit via distributor", agency: "LyricFind" },
      { id: "c10", name: "Copyright registered", description: "Registered with US Copyright Office", status: "missing", impact: "Cannot file infringement suits", fix: "Register at copyright.gov", agency: "USCO" },
    ]
  },
  {
    id: "3",
    title: "City Lights",
    isrc: "QZAB42600003",
    writerSplits: 100,
    publisherSplits: 100,
    checks: [
      { id: "c1", name: "ISRC assigned", description: "Sound recording identifier", status: "pass", impact: "Required for streaming tracking", fix: "Assign via distributor", agency: "Distributor" },
      { id: "c2", name: "ISWC registered", description: "Composition identifier", status: "pass", impact: "Performance royalties tracked", fix: "Register with ASCAP or MLC", agency: "ASCAP/MLC" },
      { id: "c3", name: "IPI number linked", description: "Writer identification", status: "pass", impact: "Required for PRO royalty distribution", fix: "Register with PRO", agency: "ASCAP/BMI" },
      { id: "c4", name: "Writer splits total 100%", description: "All writers accounted for", status: "pass", impact: "Missing splits = uncollected royalties", fix: "Update split sheet" },
      { id: "c5", name: "Publisher splits total 100%", description: "All publishers accounted for", status: "pass", impact: "Missing publisher = mechanical royalties to black box", fix: "Register with MLC/HFA" },
      { id: "c6", name: "MLC registration", description: "Registered with Mechanical Licensing Collective", status: "pass", impact: "Streaming mechanicals collected", fix: "Register at themlc.com", agency: "MLC" },
      { id: "c7", name: "HFA registration", description: "Registered with Harry Fox Agency", status: "pass", impact: "Physical mechanicals collected", fix: "Register at harryfox.com", agency: "HFA" },
      { id: "c8", name: "YouTube Content ID", description: "Referenced in YouTube CMS", status: "pass", impact: "Content ID claims and monetization", fix: "Upload via aggregator", agency: "YouTube" },
      { id: "c9", name: "Lyrics submitted", description: "Lyrics available for licensing", status: "pass", impact: "Lyric display royalties", fix: "Submit via distributor", agency: "LyricFind" },
      { id: "c10", name: "Copyright registered", description: "Registered with US Copyright Office", status: "pass", impact: "Full legal protection", fix: "Register at copyright.gov", agency: "USCO" },
    ]
  },
]

const statusColors: Record<CheckStatus, string> = {
  pass: "bg-green-500/10 text-green-500",
  warning: "bg-yellow-500/10 text-yellow-500",
  fail: "bg-red-500/10 text-red-500",
  missing: "bg-red-500/10 text-red-500",
}

const statusIcons: Record<CheckStatus, React.ElementType> = {
  pass: CheckCircle,
  warning: AlertCircle,
  fail: XCircle,
  missing: XCircle,
}

function CheckerTab() {
  const [selectedSong, setSelectedSong] = useState<string | null>(null)

  const overallStats = {
    total: mockSongs.reduce((s, song) => s + song.checks.length, 0),
    pass: mockSongs.reduce((s, song) => s + song.checks.filter(c => c.status === "pass").length, 0),
    warning: mockSongs.reduce((s, song) => s + song.checks.filter(c => c.status === "warning").length, 0),
    fail: mockSongs.reduce((s, song) => s + song.checks.filter(c => c.status === "fail").length, 0),
    missing: mockSongs.reduce((s, song) => s + song.checks.filter(c => c.status === "missing").length, 0),
  }
  const score = Math.round((overallStats.pass / overallStats.total) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Metadata Health</CardTitle>
              <CardDescription>{overallStats.pass}/{overallStats.total} checks passing across {mockSongs.length} songs</CardDescription>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"}`}>{score}%</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">{overallStats.pass} pass</Badge>
                <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500">{overallStats.warning} warn</Badge>
                <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500">{overallStats.fail + overallStats.missing} fail</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {mockSongs.map(song => {
        const songPass = song.checks.filter(c => c.status === "pass").length
        const songFail = song.checks.filter(c => c.status === "fail" || c.status === "missing").length
        const songScore = Math.round((songPass / song.checks.length) * 100)

        return (
          <Card key={song.id} className={songFail > 0 ? "border-red-500/30" : ""}>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => setSelectedSong(selectedSong === song.id ? null : song.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{song.title}</CardTitle>
                  <CardDescription>
                    {song.isrc && `ISRC: ${song.isrc}`}
                    {song.iswc && ` • ISWC: ${song.iswc}`}
                    {song.ipi && ` • IPI: ${song.ipi}`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${songScore >= 80 ? "text-green-500" : songScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>{songScore}%</span>
                </div>
              </div>
            </CardHeader>

            {(selectedSong === song.id || songFail > 0) && (
              <CardContent>
                <div className="space-y-2">
                  {song.checks.map(check => {
                    const CheckIcon = statusIcons[check.status]
                    return (
                      <div key={check.id} className={`flex items-center justify-between p-2 border rounded ${check.status === "fail" || check.status === "missing" ? "border-red-500/30 bg-red-500/5" : ""}`}>
                        <div className="flex items-center gap-2">
                          <CheckIcon className={`h-4 w-4 ${check.status === "pass" ? "text-green-500" : check.status === "warning" ? "text-yellow-500" : "text-red-500"}`} />
                          <div>
                            <p className="text-sm font-medium">{check.name}</p>
                            <p className="text-xs text-muted-foreground">{check.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {check.agency && <Badge variant="outline" className="text-xs">{check.agency}</Badge>}
                          {(check.status === "fail" || check.status === "missing") && (
                            <Badge variant="destructive" className="text-xs">Fix: {check.fix}</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function GuideTab() {
  const checks = [
    {
      title: "ISRC (International Standard Recording Code)",
      what: "12-digit code for each unique sound recording",
      why: "How streams are tracked across all DSPs. Without it, your streams don't count.",
      how: "Assign via distributor (DistroKid, TuneCore, etc.) or purchase at USISRC.org ($95 one-time)",
      critical: true
    },
    {
      title: "ISWC (International Standard Musical Work Code)",
      what: "10-digit code for each composition/song",
      why: "How performance royalties are tracked. Links compositions to PRO registrations.",
      how: "Assigned by ASCAP (US) or local ISWC agency. Register with PRO to get one.",
      critical: true
    },
    {
      title: "IPI (Interested Party Information) Number",
      what: "Unique identifier for songwriters and publishers",
      why: "How you're identified across PROs globally. Like a social security number for songwriters.",
      how: "Assigned when you register with ASCAP or BMI.",
      critical: true
    },
    {
      title: "Writer Splits",
      what: "Percentage ownership each writer has in a song",
      why: "Without accurate splits, royalties go to wrong people or get stuck in black box.",
      how: "Submit split sheets to PRO, MLC, and HFA. Must total 100%.",
      critical: true
    },
    {
      title: "Publisher Splits",
      what: "Percentage ownership each publisher has",
      why: "Missing publisher info = mechanical royalties go to black box (major labels get your money).",
      how: "Register with MLC, HFA, and Music Reports. Must total 100%.",
      critical: true
    },
    {
      title: "Territory Rights",
      what: "Which countries you control the music in",
      why: "Wrong territory = someone else collects your royalties in that market.",
      how: "Specify territory in all registrations. Worldwide is common for independent artists.",
      critical: false
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Metadata Fields Every Song Needs
          </CardTitle>
          <CardDescription>Based on Exploration.io handbook — "The more clean metadata the better"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checks.map(check => (
            <div key={check.title} className={`p-3 border rounded-lg ${check.critical ? "border-red-500/30" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium">{check.title}</p>
                {check.critical && <Badge variant="destructive" className="text-xs">Critical</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-1"><strong>What:</strong> {check.what}</p>
              <p className="text-sm text-muted-foreground mb-1"><strong>Why:</strong> {check.why}</p>
              <p className="text-sm"><strong>How:</strong> {check.how}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Black Box Problem (Exploration.io)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>When streaming platforms can't match a song to a rights holder, the royalties go into "black box" pools.</p>
          <p>These pools are distributed by <strong>market share</strong> — meaning major labels get your unclaimed money.</p>
          <p className="font-medium">The only solution: Clean metadata across every platform.</p>
          <div className="p-3 bg-muted rounded-lg mt-3">
            <p className="font-medium mb-1">Key registrations to prevent black box:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• MLC (streaming mechanicals)</li>
              <li>• HFA (physical mechanicals)</li>
              <li>• Music Reports (non-traditional platforms)</li>
              <li>• ASCAP/BMI (performance royalties)</li>
              <li>• SoundExchange (non-interactive digital)</li>
              <li>• YouTube CMS (Content ID)</li>
              <li>• US Copyright Office (legal protection)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MetadataPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Metadata Health</h1>
          <p className="text-muted-foreground">Check your song metadata across all platforms to ensure you're getting paid</p>
        </div>

        <Tabs defaultValue="checker" className="space-y-4">
          <TabsList>
            <TabsTrigger value="checker" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Checker
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <FileText className="h-4 w-4" />
              Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checker"><CheckerTab /></TabsContent>
          <TabsContent value="guide"><GuideTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
