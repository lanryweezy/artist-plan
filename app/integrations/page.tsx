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
  Link,
  Unlink,
  Settings,
  Check,
  X,
  ExternalLink,
  Search,
  RefreshCw,
  AlertCircle,
  Music,
  Globe,
  DollarSign,
  Radio,
  BarChart3,
  Mail,
  Shield,
  FileText,
  Video,
  Headphones,
  Disc,
  Users,
  Megaphone,
  ShoppingCart,
  Zap
} from "lucide-react"

type IntegrationCategory = "distribution" | "pro" | "mechanical" | "sound_recording" | "streaming" | "social" | "youtube" | "sync" | "email" | "payment" | "analytics" | "accounting" | "collaboration" | "fan_engagement" | "merch"

interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  status: "connected" | "disconnected" | "error" | "api_ready"
  importance: "essential" | "recommended" | "optional"
  whatItCollects: string
  howToRegister: string
  website: string
}

const allIntegrations: Integration[] = [
  // Distribution
  { id: "d1", name: "DistroKid", description: "Distribute music to 150+ streaming platforms", category: "distribution", status: "connected", importance: "essential", whatItCollects: "Streaming royalties, ISRC codes, DSP presence", howToRegister: "distrokid.com - $19.99/year", website: "distrokid.com" },
  { id: "d2", name: "TuneCore", description: "Digital music distribution and publishing admin", category: "distribution", status: "disconnected", importance: "essential", whatItCollects: "Streaming/download royalties, publishing admin", howToRegister: "tunecore.com - $9.99-$49.99/year", website: "tunecore.com" },
  { id: "d3", name: "CD Baby", description: "Distribution, publishing admin, and sync licensing", category: "distribution", status: "disconnected", importance: "essential", whatItCollects: "Streaming, download, sync, and publishing royalties", howToRegister: "cdbaby.com - $9.95 single, $49 album + 9% commission", website: "cdbaby.com" },
  { id: "d4", name: "AWAL", description: "Artist-friendly distribution (invite-only)", category: "distribution", status: "disconnected", importance: "recommended", whatItCollects: "Streaming and download royalties", howToRegister: "awal.com - Application required", website: "awal.com" },
  { id: "d5", name: "Stem", description: "Distribution with royalty splitting", category: "distribution", status: "disconnected", importance: "recommended", whatItCollects: "Streaming royalties, automatic royalty splits", howToRegister: "stem.is - 5% commission", website: "stem.is" },
  { id: "d6", name: "UnitedMasters", description: "Distribution with brand partnership opportunities", category: "distribution", status: "disconnected", importance: "optional", whatItCollects: "Streaming royalties, brand deal opportunities", howToRegister: "unitedmasters.com", website: "unitedmasters.com" },

  // PROs
  { id: "p1", name: "ASCAP", description: "Performance rights organization for songwriters/publishers", category: "pro", status: "disconnected", importance: "essential", whatItCollects: "Performance royalties from radio, TV, venues, streaming", howToRegister: "ascap.com - $50 one-time fee", website: "ascap.com" },
  { id: "p2", name: "BMI", description: "Performance rights organization for songwriters/publishers", category: "pro", status: "disconnected", importance: "essential", whatItCollects: "Performance royalties from radio, TV, venues, streaming", howToRegister: "bmi.com - Free to join", website: "bmi.com" },
  { id: "p3", name: "SESAC", description: "Private performance rights organization (invite-only)", category: "pro", status: "disconnected", importance: "optional", whatItCollects: "Performance royalties (higher rates, smaller roster)", howToRegister: "sesac.com - By invitation", website: "sesac.com" },
  { id: "p4", name: "GMR", description: "Global Music Rights (invite-only, ~70 writers)", category: "pro", status: "disconnected", importance: "optional", whatItCollects: "Performance royalties for top-tier writers", howToRegister: "globalmusicrights.com - By invitation", website: "globalmusicrights.com" },

  // Mechanical Rights
  { id: "m1", name: "MLC", description: "Mechanical Licensing Collective (digital streaming mechanicals)", category: "mechanical", status: "disconnected", importance: "essential", whatItCollects: "Mechanical royalties from Spotify, Apple Music, etc.", howToRegister: "themlc.com - Free", website: "themlc.com" },
  { id: "m2", name: "Harry Fox Agency", description: "Mechanical license administrator (physical + some digital)", category: "mechanical", status: "disconnected", importance: "essential", whatItCollects: "Mechanical royalties from physical sales, downloads", howToRegister: "harryfox.com - Publisher registration", website: "harryfox.com" },
  { id: "m3", name: "Music Reports", description: "Digital voluntary licenses (TikTok, Peloton, etc.)", category: "mechanical", status: "disconnected", importance: "recommended", whatItCollects: "Mechanical/sync royalties from non-traditional platforms", howToRegister: "musicreports.com - Submit metadata", website: "musicreports.com" },

  // Sound Recording Rights
  { id: "s1", name: "SoundExchange", description: "Non-interactive digital performance royalties (Pandora, SiriusXM)", category: "sound_recording", status: "disconnected", importance: "essential", whatItCollects: "45% featured artist, 50% label, 5% non-featured", howToRegister: "soundexchange.com - Free", website: "soundexchange.com" },

  // Streaming Platforms
  { id: "st1", name: "Spotify for Artists", description: "Streaming analytics, playlist pitching, artist profile", category: "streaming", status: "connected", importance: "essential", whatItCollects: "Stream counts, listener demographics, playlist data", howToRegister: "artists.spotify.com - Via distributor", website: "artists.spotify.com" },
  { id: "st2", name: "Apple Music for Artists", description: "Apple Music analytics and artist dashboard", category: "streaming", status: "connected", importance: "essential", whatItCollects: "Streams, downloads, Shazam data, chart positions", howToRegister: "artists.apple.com - Via distributor", website: "artists.apple.com" },
  { id: "st3", name: "Amazon Music for Artists", description: "Amazon Music analytics", category: "streaming", status: "disconnected", importance: "recommended", whatItCollects: "Streams, voice request data (Alexa)", howToRegister: "artists.amazon.com - Via distributor", website: "artists.amazon.com" },
  { id: "st4", name: "TikTok for Artists", description: "TikTok analytics and sound promotion", category: "streaming", status: "disconnected", importance: "recommended", whatItCollects: "Video usage, sound creation data, fan engagement", howToRegister: "artists.tiktok.com", website: "artists.tiktok.com" },

  // Social Media
  { id: "so1", name: "Instagram", description: "Visual content, Reels, Stories, fan engagement", category: "social", status: "connected", importance: "essential", whatItCollects: "Engagement metrics, follower growth, content performance", howToRegister: "instagram.com - Standard account", website: "instagram.com" },
  { id: "so2", name: "TikTok", description: "Short-form video content and viral reach", category: "social", status: "connected", importance: "essential", whatItCollects: "Video views, trending sounds, fan demographics", howToRegister: "tiktok.com", website: "tiktok.com" },
  { id: "so3", name: "Twitter/X", description: "Real-time engagement and industry networking", category: "social", status: "disconnected", importance: "recommended", whatItCollects: "Tweet impressions, follower growth, engagement", howToRegister: "x.com", website: "x.com" },
  { id: "so4", name: "Facebook", description: "Fan pages, events, and community building", category: "social", status: "disconnected", importance: "recommended", whatItCollects: "Page insights, event responses, fan demographics", howToRegister: "facebook.com - Business page", website: "facebook.com" },

  // YouTube
  { id: "y1", name: "YouTube CMS", description: "Content ID claiming, monetization, channel management", category: "youtube", status: "disconnected", importance: "essential", whatItCollects: "Video claims, ad revenue, Content ID matches, viewer data", howToRegister: "youtube.com - Via aggregator or direct application", website: "youtube.com" },
  { id: "y2", name: "YouTube for Artists", description: "YouTube analytics and artist features", category: "youtube", status: "disconnected", importance: "essential", whatItCollects: "View counts, subscriber growth, revenue, playlist adds", howToRegister: "artists.youtube.com", website: "artists.youtube.com" },
  { id: "y3", name: "VEVO", description: "Premium music video distribution (label required)", category: "youtube", status: "disconnected", importance: "optional", whatItCollects: "Music video views, premium ad revenue", howToRegister: "vevo.com - Via label or aggregator", website: "vevo.com" },

  // Sync Licensing
  { id: "sy1", name: "Songtradr", description: "Sync licensing marketplace for film, TV, ads, games", category: "sync", status: "disconnected", importance: "recommended", whatItCollects: "Sync placement offers, licensing fees", howToRegister: "songtradr.com - Free to join", website: "songtradr.com" },
  { id: "sy2", name: "Musicbed", description: "Premium sync licensing for film and advertising", category: "sync", status: "disconnected", importance: "recommended", whatItCollects: "High-value sync placements", howToRegister: "musicbed.com - Application required", website: "musicbed.com" },
  { id: "sy3", name: "LyricFind", description: "Lyric licensing and distribution to major platforms", category: "sync", status: "disconnected", importance: "recommended", whatItCollects: "Lyric display royalties (50% of ad revenue from lyric sites)", howToRegister: "lyricfind.com - Via publisher or distributor", website: "lyricfind.com" },

  // Email/CRM
  { id: "e1", name: "Mailchimp", description: "Email marketing campaigns and fan newsletters", category: "email", status: "disconnected", importance: "recommended", whatItCollects: "Email open rates, click rates, subscriber growth", howToRegister: "mailchimp.com - Free up to 500 contacts", website: "mailchimp.com" },
  { id: "e2", name: "ConvertKit", description: "Email marketing built for creators", category: "email", status: "disconnected", importance: "optional", whatItCollects: "Subscriber engagement, automation workflows", howToRegister: "convertkit.com - Free up to 1,000 subscribers", website: "convertkit.com" },

  // Payment
  { id: "pa1", name: "Stripe", description: "Online payment processing for merch and tickets", category: "payment", status: "disconnected", importance: "essential", whatItCollects: "Payment processing, transaction history", howToRegister: "stripe.com - 2.9% + $0.30 per transaction", website: "stripe.com" },
  { id: "pa2", name: "PayPal", description: "Online payments and invoicing", category: "payment", status: "disconnected", importance: "recommended", whatItCollects: "Payment processing, invoicing", howToRegister: "paypal.com", website: "paypal.com" },
  { id: "pa3", name: "Shopify", description: "E-commerce platform for merch stores", category: "payment", status: "disconnected", importance: "recommended", whatItCollects: "Merch sales, inventory, customer data", howToRegister: "shopify.com - $29/month", website: "shopify.com" },
  { id: "pa4", name: "Bandcamp", description: "Direct-to-fan sales platform", category: "payment", status: "disconnected", importance: "recommended", whatItCollects: "Direct sales, fan email addresses, merch sales", howToRegister: "bandcamp.com - 15% commission", website: "bandcamp.com" },

  // Analytics
  { id: "an1", name: "Chartmetric", description: "Cross-platform music analytics and career intelligence", category: "analytics", status: "disconnected", importance: "recommended", whatItCollects: "Cross-platform streaming, social, and chart data", howToRegister: "chartmetric.com - Free tier available", website: "chartmetric.com" },
  { id: "an2", name: "Soundcharts", description: "Music industry market intelligence", category: "analytics", status: "disconnected", importance: "optional", whatItCollects: "Chart positions, radio airplay, social data", howToRegister: "soundcharts.com", website: "soundcharts.com" },
  { id: "an3", name: "Viberate", description: "Music analytics and booking platform", category: "analytics", status: "disconnected", importance: "optional", whatItCollects: "Booking data, venue analytics, artist rankings", howToRegister: "viberate.com", website: "viberate.com" },

  // Accounting
  { id: "ac1", name: "QuickBooks", description: "Accounting and tax preparation for musicians", category: "accounting", status: "disconnected", importance: "recommended", whatItCollects: "Income/expenses, 1099s, tax deductions", howToRegister: "quickbooks.com - $30/month", website: "quickbooks.com" },
  { id: "ac2", name: "FreshBooks", description: "Invoicing and expense tracking for freelancers", category: "accounting", status: "disconnected", importance: "optional", whatItCollects: "Invoices, expenses, time tracking", howToRegister: "freshbooks.com - $17/month", website: "freshbooks.com" },

  // Collaboration
  { id: "co1", name: "Splice", description: "Sample marketplace and DAW collaboration", category: "collaboration", status: "disconnected", importance: "recommended", whatItCollects: "Sample usage, project files, credits", howToRegister: "splice.com - $7.99/month", website: "splice.com" },
  { id: "co2", name: "BandLab", description: "Free online DAW and collaboration platform", category: "collaboration", status: "disconnected", importance: "optional", whatItCollects: "Project files, collaboration history", howToRegister: "bandlab.com - Free", website: "bandlab.com" },
  { id: "co3", name: "Soundtrap", description: "Online DAW by Spotify for collaboration", category: "collaboration", status: "disconnected", importance: "optional", whatItCollects: "Project files, Spotify integration", howToRegister: "soundtrap.com - $7.99/month", website: "soundtrap.com" },

  // Fan Engagement
  { id: "f1", name: "Patreon", description: "Membership platform for exclusive fan content", category: "fan_engagement", status: "disconnected", importance: "recommended", whatItCollects: "Recurring revenue, subscriber data, engagement", howToRegister: "patreon.com - 5-12% commission", website: "patreon.com" },
  { id: "f2", name: "Bandzoogle", description: "Musician website builder with built-in store", category: "fan_engagement", status: "disconnected", importance: "optional", whatItCollects: "Website traffic, email signups, merch sales", howToRegister: "bandzoogle.com - $9.99/month", website: "bandzoogle.com" },

  // Merch
  { id: "me1", name: "Printful", description: "Print-on-demand merch fulfillment", category: "merch", status: "disconnected", importance: "recommended", whatItCollects: "Merch orders, inventory, fulfillment tracking", howToRegister: "printful.com - Free (no upfront cost)", website: "printful.com" },
  { id: "me2", name: "Spring (Teespring)", description: "Print-on-demand merch platform", category: "merch", status: "disconnected", importance: "recommended", whatItCollects: "Merch sales, social merch integration", howToRegister: "spri.ng - Free", website: "spri.ng" },
]

const categoryLabels: Record<IntegrationCategory, string> = {
  distribution: "Distribution",
  pro: "Performance Rights",
  mechanical: "Mechanical Rights",
  sound_recording: "Sound Recording Rights",
  streaming: "Streaming Analytics",
  social: "Social Media",
  youtube: "YouTube/Video",
  sync: "Sync Licensing",
  email: "Email Marketing",
  payment: "Payment/E-commerce",
  analytics: "Analytics",
  accounting: "Accounting",
  collaboration: "Collaboration",
  fan_engagement: "Fan Engagement",
  merch: "Merch",
}

const importanceColors: Record<string, string> = {
  essential: "bg-red-500/10 text-red-500",
  recommended: "bg-blue-500/10 text-blue-500",
  optional: "bg-gray-500/10 text-gray-500",
}

const categoryIcons: Record<IntegrationCategory, React.ElementType> = {
  distribution: Disc,
  pro: Shield,
  mechanical: FileText,
  sound_recording: Music,
  streaming: Headphones,
  social: Globe,
  youtube: Video,
  sync: Film,
  email: Mail,
  payment: DollarSign,
  analytics: BarChart3,
  accounting: FileText,
  collaboration: Users,
  fan_engagement: Heart,
  merch: ShoppingCart,
}

function OverviewTab() {
  const connected = allIntegrations.filter(i => i.status === "connected").length
  const essentialDisconnected = allIntegrations.filter(i => i.importance === "essential" && i.status !== "connected").length
  const categories = Array.from(new Set(allIntegrations.map(i => i.category)))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{connected}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{essentialDisconnected}</p>
                <p className="text-xs text-muted-foreground">Essential (Not Connected)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{allIntegrations.length}</p>
                <p className="text-xs text-muted-foreground">Total Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {essentialDisconnected > 0 && (
        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Essential Integrations Missing
            </CardTitle>
            <CardDescription>These are critical for collecting all your royalties and managing your career</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {allIntegrations.filter(i => i.importance === "essential" && i.status !== "connected").map(int => (
                <div key={int.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.whatItCollects}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How Royalties Flow — Complete Map</CardTitle>
          <CardDescription>Based on Exploration.io and Passman's handbook</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-blue-500 mb-2">Composition Side (Songwriter/Publisher)</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>PRO (ASCAP/BMI/SESAC/GMR)</strong> → Performance royalties from radio, TV, venues, streaming</li>
                <li>• <strong>MLC</strong> → Streaming mechanicals (Spotify, Apple Music, Amazon, etc.)</li>
                <li>• <strong>HFA</strong> → Physical mechanicals (CD, vinyl) + some digital</li>
                <li>• <strong>Music Reports</strong> → Non-traditional platforms (TikTok, Peloton, etc.)</li>
                <li>• <strong>Sync Fees</strong> → Direct from music publisher for film/TV/ad placements</li>
                <li>• <strong>LyricFind</strong> → Lyric display royalties</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-green-500 mb-2">Master Side (Recording Artist/Label)</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Distributor (DistroKid/TuneCore/etc.)</strong> → Streaming and download royalties from DSPs</li>
                <li>• <strong>SoundExchange</strong> → Non-interactive digital (Pandora, SiriusXM, internet radio)</li>
                <li>• <strong>YouTube CMS</strong> → Content ID monetization and ad revenue</li>
                <li>• <strong>VEVO</strong> → Premium music video distribution</li>
                <li>• <strong>Neighboring Rights</strong> → Foreign collection societies via distributor</li>
                <li>• <strong>Songtradr/Musicbed</strong> → Sync fees for master recordings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(cat => {
          const catIntegrations = allIntegrations.filter(i => i.category === cat)
          const CatIcon = categoryIcons[cat] || Globe
          return (
            <Card key={cat}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CatIcon className="h-4 w-4" />
                  {categoryLabels[cat]}
                  <Badge variant="secondary" className="ml-auto">{catIntegrations.filter(i => i.status === "connected").length}/{catIntegrations.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {catIntegrations.map(int => (
                    <div key={int.id} className="flex items-center justify-between text-sm py-1">
                      <span>{int.name}</span>
                      <Badge variant={int.status === "connected" ? "default" : "outline"} className="text-xs">
                        {int.status === "connected" ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function CatalogTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | "all">("all")
  const [importanceFilter, setImportanceFilter] = useState<string>("all")

  const filtered = allIntegrations.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || i.category === categoryFilter
    const matchesImportance = importanceFilter === "all" || i.importance === importanceFilter
    return matchesSearch && matchesCategory && matchesImportance
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search integrations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as IntegrationCategory | "all")}
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={importanceFilter}
          onChange={e => setImportanceFilter(e.target.value)}
        >
          <option value="all">All Importance</option>
          <option value="essential">Essential</option>
          <option value="recommended">Recommended</option>
          <option value="optional">Optional</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(int => {
          const isEssential = int.importance === "essential"
          return (
            <Card key={int.id} className={isEssential && int.status !== "connected" ? "border-red-500/30" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{int.name}</CardTitle>
                  <Badge variant="outline" className={importanceColors[int.importance]}>
                    {int.importance}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{categoryLabels[int.category]}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{int.description}</p>
                <div>
                  <p className="text-xs font-medium">What it collects:</p>
                  <p className="text-xs text-muted-foreground">{int.whatItCollects}</p>
                </div>
                <div>
                  <p className="text-xs font-medium">How to register:</p>
                  <p className="text-xs text-muted-foreground">{int.howToRegister}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={int.status === "connected" ? "default" : "secondary"}>
                    {int.status === "connected" ? "Connected" : "Not Connected"}
                  </Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`https://${int.website}`} target="_blank" rel="noopener noreferrer">
                      {int.status === "connected" ? "Configure" : "Register"} <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Film(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  )
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">Connect every platform an independent artist needs</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="catalog" className="gap-2">
              <Globe className="h-4 w-4" />
              Full Catalog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="catalog"><CatalogTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
