"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Clock,
  DollarSign,
  FileText,
  Music,
  Globe,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  Plus
} from "lucide-react"

type RegistrationStatus = "not_started" | "in_progress" | "submitted" | "active" | "needs_update"
type SideType = "composition" | "sound_recording" | "both"

interface CollectionAgency {
  id: string
  name: string
  acronym: string
  side: SideType
  collects: string
  description: string
  fee: string
  howToRegister: string
  website: string
  required: boolean
  status: RegistrationStatus
  lastChecked?: string
  notes?: string
}

const agencies: CollectionAgency[] = [
  // PROs (Composition Side)
  {
    id: "ascap",
    name: "American Society of Composers, Authors and Publishers",
    acronym: "ASCAP",
    side: "composition",
    collects: "Performance royalties from radio, TV, venues, streaming, digital",
    description: "Non-profit PRO governed by consent decrees. Collects blanket license fees from music users and distributes to writers/publishers. 50/50 writer/publisher split.",
    fee: "$50 one-time application fee",
    howToRegister: "ascap.com → Become a Member → Choose Writer or Publisher → Fill application → Pay fee → Register songs",
    website: "ascap.com",
    required: true,
    status: "not_started"
  },
  {
    id: "bmi",
    name: "Broadcast Music, Inc.",
    acronym: "BMI",
    side: "composition",
    collects: "Performance royalties from radio, TV, venues, streaming, digital",
    description: "Non-profit PRO governed by consent decrees. Writer shares shown as 100% (vs ASCAP's 50%). Two-year affiliation terms.",
    fee: "Free to join",
    howToRegister: "bmi.com → Create BMI.com Account → Register as Writer or Publisher → Submit song registrations",
    website: "bmi.com",
    required: true,
    status: "not_started"
  },
  {
    id: "sesac",
    name: "Society of European Stage Authors and Composers",
    acronym: "SESAC",
    side: "composition",
    collects: "Performance royalties (private company, negotiates own rates)",
    description: "Private, for-profit PRO. Smaller roster of top-tier writers. Higher per-play rates than ASCAP/BMI. By invitation only.",
    fee: "Free (invite only)",
    howToRegister: "sesac.com → By invitation only. Must be invited to affiliate.",
    website: "sesac.com",
    required: false,
    status: "not_started"
  },
  {
    id: "gmr",
    name: "Global Music Rights",
    acronym: "GMR",
    side: "composition",
    collects: "Performance royalties (~70 top-tier writers)",
    description: "Private PRO founded by Irving Azoff. Represents only ~70 writers. Not governed by consent decrees — negotiates directly.",
    fee: "Free (invite only)",
    howToRegister: "globalmusicrights.com → By invitation only.",
    website: "globalmusicrights.com",
    required: false,
    status: "not_started"
  },
  // Mechanical Rights (Composition Side)
  {
    id: "mlc",
    name: "Mechanical Licensing Collective",
    acronym: "MLC",
    side: "composition",
    collects: "Mechanical royalties from interactive streaming (Spotify, Apple Music, Amazon, etc.)",
    description: "Created by 2018 Music Modernization Act. Administers blanket mechanical license for digital service providers. US-only for now.",
    fee: "Free",
    howToRegister: "themlc.com → Create Account → Register as Self-Publisher or via Publisher → Register songs with metadata → Verify ownership splits",
    website: "themlc.com",
    required: true,
    status: "not_started"
  },
  {
    id: "hfa",
    name: "Harry Fox Agency",
    acronym: "HFA",
    side: "composition",
    collects: "Mechanical royalties from physical sales + some digital (non-digital phonorecord deliveries)",
    description: "Largest mechanical rights administrator in US. Owned by SESAC. Issues licenses for physical reproductions. Commission: 11.5%.",
    fee: "Publisher affiliation required",
    howToRegister: "harryfox.com → Become an Affiliate → Submit publisher info → Register songs via eSong or CWR → Must have commercially released song in past year",
    website: "harryfox.com",
    required: true,
    status: "not_started"
  },
  {
    id: "music_reports",
    name: "Music Reports",
    acronym: "MRI",
    side: "composition",
    collects: "Mechanical/sync royalties from non-traditional platforms (TikTok, Peloton, Amazon music videos, etc.)",
    description: "Private company. Handles digital voluntary licenses. No commission — 100% pass-through to rights holders.",
    fee: "Free",
    howToRegister: "musicreports.com → Submit metadata via Excel template → Review and sign licensing agreements → Register songs in Songdex database",
    website: "musicreports.com",
    required: true,
    status: "not_started"
  },
  {
    id: "cmrra",
    name: "Canadian Musical Reproduction Rights Agency",
    acronym: "CMRRA",
    side: "composition",
    collects: "Mechanical royalties in Canada",
    description: "Canadian mechanical rights society. Now owned by SoundExchange (via SXWorks). Collects for Canadian digital and physical sales.",
    fee: "Free",
    howToRegister: "cmrra.ca → Register as publisher → Submit song metadata",
    website: "cmrra.ca",
    required: false,
    status: "not_started"
  },
  // Sound Recording Side
  {
    id: "soundexchange",
    name: "SoundExchange",
    acronym: "SX",
    side: "sound_recording",
    collects: "Non-interactive digital performance royalties (Pandora, SiriusXM, internet radio, cable/satellite music services)",
    description: "Only organization designated by Congress to collect digital performance royalties for sound recordings. 45% featured artist / 50% label / 5% non-featured.",
    fee: "Free",
    howToRegister: "soundexchange.com → Create Account → Register as Artist or Label → Register sound recordings → Submit Letter of Direction for producers",
    website: "soundexchange.com",
    required: true,
    status: "not_started"
  },
  {
    id: "youtube_cms",
    name: "YouTube Content Management System",
    acronym: "YT CMS",
    side: "both",
    collects: "Content ID claims, ad revenue from user-generated content, channel monetization",
    description: "YouTube's system for rights holders to claim and monetize videos using their music. Requires aggregator or direct application.",
    fee: "Free (via aggregator or direct)",
    howToRegister: "youtube.com → Apply via aggregator (Exploration, CD Baby, etc.) OR direct application → Upload reference files → Set policies (monetize/track/block)",
    website: "youtube.com",
    required: true,
    status: "not_started"
  },
  {
    id: "vevo",
    name: "VEVO",
    acronym: "VEVO",
    side: "sound_recording",
    collects: "Premium music video ad revenue",
    description: "Joint venture between Universal, Sony, Google. Premium music video distribution. Must be a label or work with one.",
    fee: "Via label/aggregator",
    howToRegister: "vevo.com → Through record label or aggregator → Upload music videos → Premium ad sales",
    website: "vevo.com",
    required: false,
    status: "not_started"
  },
  {
    id: "lyricfind",
    name: "LyricFind",
    acronym: "LF",
    side: "composition",
    collects: "Lyric display royalties from lyric websites and platforms",
    description: "Leading lyric licensing company. Distributes lyrics to Amazon, Google, YouTube, Deezer, Pandora, iHeartRadio. Publishers get ~50% of ad revenue.",
    fee: "Free (via publisher/distributor)",
    howToRegister: "lyricfind.com → Register via publisher or distributor → Submit lyrics for approved songs",
    website: "lyricfind.com",
    required: false,
    status: "not_started"
  },
  {
    id: "us_copyright",
    name: "US Copyright Office",
    acronym: "USCO",
    side: "both",
    collects: "Copyright registration (not royalties — legal protection)",
    description: "Register compositions and sound recordings for legal protection. Required to file infringement suits. Establishes prima facie ownership.",
    fee: "$35-45 online registration",
    howToRegister: "copyright.gov → eCO system → Select form (PA for compositions, SR for sound recordings) → Pay fee → Submit deposit copy",
    website: "copyright.gov",
    required: true,
    status: "not_started"
  },
]

const statusColors: Record<RegistrationStatus, string> = {
  not_started: "bg-gray-500/10 text-gray-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  submitted: "bg-blue-500/10 text-blue-500",
  active: "bg-green-500/10 text-green-500",
  needs_update: "bg-orange-500/10 text-orange-500",
}

const statusIcons: Record<RegistrationStatus, React.ElementType> = {
  not_started: AlertCircle,
  in_progress: Clock,
  submitted: Clock,
  active: CheckCircle,
  needs_update: AlertCircle,
}

function TrackerTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterSide, setFilterSide] = useState<SideType | "all" | "required">("all")

  const filtered = agencies.filter(a => {
    if (filterSide === "all") return true
    if (filterSide === "required") return a.required
    return a.side === filterSide
  })

  const compositionAgencies = filtered.filter(a => a.side === "composition")
  const recordingAgencies = filtered.filter(a => a.side === "sound_recording")
  const bothAgencies = filtered.filter(a => a.side === "both")

  const activeCount = agencies.filter(a => a.status === "active").length
  const totalCount = agencies.length
  const requiredMissing = agencies.filter(a => a.required && a.status === "not_started").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Registrations</p>
            <p className="text-3xl font-bold text-green-500">{activeCount}/{totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Required Missing</p>
            <p className="text-3xl font-bold text-red-500">{requiredMissing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Composition Side</p>
            <p className="text-3xl font-bold">{agencies.filter(a => a.side === "composition").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Recording Side</p>
            <p className="text-3xl font-bold">{agencies.filter(a => a.side === "sound_recording" || a.side === "both").length}</p>
          </CardContent>
        </Card>
      </div>

      {requiredMissing > 0 && (
        <Card className="border-red-500/50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              You are missing {requiredMissing} required registrations — this means uncollected royalties
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap">
        {(["all", "required", "composition", "sound_recording"] as const).map((side) => (
          <Button
            key={side}
            variant={filterSide === side ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSide(side)}
            className="capitalize"
          >
            {side === "all" ? "All" : side === "required" ? "Required Only" : side === "composition" ? "Composition Side" : "Recording Side"}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((agency) => {
          const StatusIcon = statusIcons[agency.status]
          const isExpanded = expandedId === agency.id

          return (
            <Card key={agency.id} className={agency.required && agency.status === "not_started" ? "border-red-500/30" : ""}>
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : agency.id)}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${agency.status === "active" ? "text-green-500" : agency.status === "not_started" && agency.required ? "text-red-500" : "text-muted-foreground"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{agency.acronym}</p>
                        <Badge variant="outline" className="text-xs capitalize">{agency.side === "both" ? "Both" : agency.side === "composition" ? "Composition" : "Recording"}</Badge>
                        {agency.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{agency.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={statusColors[agency.status]}>
                      {agency.status.replace("_", " ")}
                    </Badge>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">What it collects:</p>
                      <p>{agency.collects}</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">Description:</p>
                      <p className="text-muted-foreground">{agency.description}</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">Fee:</p>
                      <p>{agency.fee}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs text-muted-foreground mb-1">How to register:</p>
                      <p className="font-mono text-xs">{agency.howToRegister}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`https://${agency.website}`} target="_blank" rel="noopener noreferrer">
                          Visit {agency.acronym} <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark as {agency.status === "active" ? "Needs Update" : "Active"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function GuideTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Complete Registration Checklist
          </CardTitle>
          <CardDescription>Based on Exploration.io handbook and Passman</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Step 1: Register with a PRO (Performance Royalties)</h4>
            <p className="text-sm text-muted-foreground mb-2">Choose ONE: ASCAP or BMI (you can't be in both). Register as both writer AND publisher (if self-published).</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• ASCAP: $50 one-time. Year-to-year terms.</p>
              <p>• BMI: Free. Two-year terms.</p>
              <p>• SESAC/GMR: By invitation only (higher rates, smaller roster).</p>
              <p className="text-red-500 font-medium">⚠️ Without a PRO, you collect ZERO performance royalties from radio, TV, venues, and streaming.</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Step 2: Register with the MLC (Streaming Mechanicals)</h4>
            <p className="text-sm text-muted-foreground mb-2">Free. Register as self-publisher or via your publisher. Submit song metadata including ISWC codes.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• themlc.com — Create account → Register songs → Verify ownership splits</p>
              <p className="text-red-500 font-medium">⚠️ Without MLC registration, streaming mechanical royalties go to "black box" pools distributed by market share (major labels get your money).</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Step 3: Register with HFA (Physical Mechanicals)</h4>
            <p className="text-sm text-muted-foreground mb-2">Publisher affiliation required. Must have commercially released song in past year.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• harryfox.com → Affiliate application → Submit metadata via eSong or CWR</p>
              <p>• HFA commission: 11.5% of all payments collected</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Step 4: Register with Music Reports (Non-Traditional Platforms)</h4>
            <p className="text-sm text-muted-foreground mb-2">Free. Handles TikTok, Peloton, Amazon music videos, and other non-traditional platforms.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• musicreports.com → Submit metadata → Sign licensing agreements</p>
              <p>• No commission — 100% pass-through to rights holders</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Step 5: Register with SoundExchange (Non-Interactive Digital)</h4>
            <p className="text-sm text-muted-foreground mb-2">Free. Only designated organization for non-interactive digital performance royalties.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• soundexchange.com → Register as artist OR label → Register sound recordings</p>
              <p>• 45% featured artist / 50% label / 5% non-featured artists</p>
              <p className="text-red-500 font-medium">⚠️ Without SoundExchange, you collect ZERO from Pandora, SiriusXM, and internet radio.</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Step 6: Set up YouTube CMS (Content ID)</h4>
            <p className="text-sm text-muted-foreground mb-2">Apply via aggregator (CD Baby, DistroKid, etc.) or direct application to YouTube.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• Upload reference files (audio fingerprints)</p>
              <p>• Set policies: Monetize, Track, Block, or Takedown</p>
              <p>• Monetize = ads placed on videos using your music, you get revenue</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Step 7: Register with US Copyright Office</h4>
            <p className="text-sm text-muted-foreground mb-2">$35-45 per registration. Not required for copyright to exist, but provides legal protection.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• copyright.gov → eCO system → PA form (compositions) or SR form (sound recordings)</p>
              <p>• Benefits: Prima facie ownership, ability to sue, statutory damages if registered within 3 months of publication</p>
              <p className="text-red-500 font-medium">⚠️ Without registration, you cannot file infringement suits in federal court.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens If You Don't Register</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="p-3 border border-red-500/30 rounded-lg">
            <p className="font-medium text-red-500">Without PRO registration:</p>
            <p className="text-muted-foreground">You collect $0 from radio, TV, venues, and streaming performance royalties. ASCAP/BMI file 200+ infringement lawsuits annually.</p>
          </div>
          <div className="p-3 border border-red-500/30 rounded-lg">
            <p className="font-medium text-red-500">Without MLC registration:</p>
            <p className="text-muted-foreground">Streaming mechanical royalties go to "black box" — distributed by market share to major labels. Your money goes to them.</p>
          </div>
          <div className="p-3 border border-red-500/30 rounded-lg">
            <p className="font-medium text-red-500">Without SoundExchange:</p>
            <p className="text-muted-foreground">You collect $0 from Pandora, SiriusXM, and internet radio. This is free money sitting unclaimed.</p>
          </div>
          <div className="p-3 border border-red-500/30 rounded-lg">
            <p className="font-medium text-red-500">Without Copyright Office registration:</p>
            <p className="text-muted-foreground">You cannot file infringement suits. If someone steals your song, you have no legal recourse in federal court.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata You Need for Every Registration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium mb-2">Composition Metadata</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• ISWC code (from ASCAP or MLC)</li>
                <li>• Song title</li>
                <li>• Writer name(s) and IPI numbers</li>
                <li>• Publisher name(s)</li>
                <li>• Ownership splits (%)</li>
                <li>• Territory of control</li>
                <li>• PRO affiliation per writer</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium mb-2">Sound Recording Metadata</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• ISRC code (from distributor)</li>
                <li>• Track title</li>
                <li>• Artist name</li>
                <li>• Record label name</li>
                <li>• Release date</li>
                <li>• Territory</li>
                <li>• Audio file (WAV/MP3 for Content ID)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EarningsTab() {
  const potentialEarnings = [
    { source: "PRO (Performance)", perMonth: "$50-500+", frequency: "Quarterly", example: "ASCAP pays ~6 months after quarter ends" },
    { source: "MLC (Streaming Mechanicals)", perMonth: "$100-2000+", frequency: "Monthly", example: "Based on stream count and ownership share" },
    { source: "HFA (Physical Mechanicals)", perMonth: "$10-100+", frequency: "Quarterly", example: "For CD/vinyl sales" },
    { source: "SoundExchange (Non-Interactive)", perMonth: "$20-500+", frequency: "Quarterly", example: "Pandora, SiriusXM plays" },
    { source: "YouTube CMS", perMonth: "$50-1000+", frequency: "Monthly", example: "Content ID ad revenue" },
    { source: "LyricFind", perMonth: "$5-50+", frequency: "Quarterly", example: "Lyric display royalties" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Potential Royalty Sources You May Be Missing</CardTitle>
          <CardDescription>Estimates based on independent artist averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {potentialEarnings.map((source) => (
              <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{source.source}</p>
                  <p className="text-sm text-muted-foreground">{source.example}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{source.perMonth}/mo</p>
                  <p className="text-xs text-muted-foreground">{source.frequency}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Total potential uncollected: $300-$4,000+/month</p>
            <p className="text-sm text-muted-foreground">These are rough estimates. Actual amounts depend on your catalog size, streaming numbers, and radio play.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The "Black Box" Problem</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>According to the Exploration.io handbook, when royalties can't be matched to a rights holder, they go into "black box" pools.</p>
          <p>These pools are distributed by <strong>market share</strong> — meaning major labels get YOUR unclaimed money.</p>
          <p className="font-medium">The only way to prevent this: Register with every collection agency and keep your metadata clean.</p>
          <p className="text-muted-foreground">ISRC codes identify recordings. ISWC codes identify compositions. IPI numbers identify writers. Without these, you're invisible to the system.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rights & Registration</h1>
          <p className="text-muted-foreground">Track your registrations with every collection agency to collect all royalties</p>
        </div>

        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tracker" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Registration Tracker
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <FileText className="h-4 w-4" />
              Registration Guide
            </TabsTrigger>
            <TabsTrigger value="earnings" className="gap-2">
              <DollarSign className="h-4 w-4" />
              What You're Missing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker"><TrackerTab /></TabsContent>
          <TabsContent value="guide"><GuideTab /></TabsContent>
          <TabsContent value="earnings"><EarningsTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
