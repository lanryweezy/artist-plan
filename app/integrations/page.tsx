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
  Zap,
  Film,
  Heart,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  Target,
  Zap as ZapIcon,
  DollarSign as DollarIcon,
  Users as UsersIcon,
  ShoppingCart as CartIcon
} from "lucide-react"

type IntegrationCategory = "distribution" | "pro" | "mechanical" | "sound_recording" | "streaming" | "social" | "youtube" | "sync" | "email" | "payment" | "analytics" | "accounting" | "collaboration" | "fan_engagement" | "merch"
type ConnectType = "oauth" | "manual" | "signup"
type GoalType = "get_paid" | "grow_fans" | "sell_merch"

interface Integration {
  id: string
  name: string
  description: string
  valueProp: string
  category: IntegrationCategory
  status: "connected" | "disconnected"
  importance: "essential" | "recommended" | "optional"
  connectType: ConnectType
  goals: GoalType[]
  side: "composition" | "recording" | "both"
  whatItCollects: string
  connectSteps: string[]
  estimatedImpact: string
  payoutCadence?: string
  website: string
  enabledFeatures?: string[]
}

const allIntegrations: Integration[] = [
  // Distribution
  { id: "d1", name: "DistroKid", description: "Distribute music to 150+ platforms", valueProp: "Get your music on every streaming platform", category: "distribution", status: "disconnected", importance: "essential", connectType: "signup", goals: ["get_paid"], side: "recording", whatItCollects: "Streaming/download royalties, ISRC codes", connectSteps: ["Create account at distrokid.com", "Pay $19.99/year", "Upload music with metadata", "Music goes live in 2-5 days"], estimatedImpact: "Unlock all streaming revenue", payoutCadence: "Monthly", website: "distrokid.com", enabledFeatures: ["royalties", "distribution"] },
  { id: "d2", name: "TuneCore", description: "Distribution + publishing admin", valueProp: "Distribute and collect publishing royalties", category: "distribution", status: "disconnected", importance: "essential", connectType: "signup", goals: ["get_paid"], side: "both", whatItCollects: "Streaming/download royalties + publishing admin", connectSteps: ["Create account at tunecore.com", "Choose distribution or publishing plan", "Upload music"], estimatedImpact: "Distribution + publishing in one place", payoutCadence: "Monthly", website: "tunecore.com", enabledFeatures: ["royalties", "publishing"] },
  { id: "d3", name: "CD Baby", description: "Distribution, publishing, sync licensing", valueProp: "All-in-one for indie artists", category: "distribution", status: "disconnected", importance: "essential", connectType: "signup", goals: ["get_paid"], side: "both", whatItCollects: "Streaming, download, sync, and publishing royalties", connectSteps: ["Create account at cdbaby.com", "Choose single ($9.95) or album ($49)", "Upload music and metadata"], estimatedImpact: "Full distribution + publishing admin", payoutCadence: "Weekly", website: "cdbaby.com", enabledFeatures: ["royalties", "publishing", "sync"] },

  // PROs
  { id: "p1", name: "ASCAP", description: "Performance rights organization", valueProp: "Collect royalties from radio, TV, venues, streaming", category: "pro", status: "disconnected", importance: "essential", connectType: "manual", goals: ["get_paid"], side: "composition", whatItCollects: "Performance royalties from all public uses", connectSteps: ["Go to ascap.com", "Click 'Become a Member'", "Pay $50 one-time fee", "Register as Writer AND Publisher", "Register all your songs"], estimatedImpact: "Unlock performance royalties — without this you earn $0 from radio, TV, and live venues", payoutCadence: "Quarterly (6 months after quarter)", website: "ascap.com", enabledFeatures: ["royalties"] },
  { id: "p2", name: "BMI", description: "Performance rights organization", valueProp: "Collect royalties from radio, TV, venues, streaming", category: "pro", status: "disconnected", importance: "essential", connectType: "manual", goals: ["get_paid"], side: "composition", whatItCollects: "Performance royalties from all public uses", connectSteps: ["Go to bmi.com", "Create BMI.com account", "Register as Writer or Publisher", "Register all your songs"], estimatedImpact: "Unlock performance royalties — without this you earn $0 from radio, TV, and live venues", payoutCadence: "Quarterly (6 months after quarter)", website: "bmi.com", enabledFeatures: ["royalties"] },

  // Mechanical
  { id: "m1", name: "MLC", description: "Mechanical Licensing Collective", valueProp: "Collect streaming mechanical royalties", category: "mechanical", status: "disconnected", importance: "essential", connectType: "manual", goals: ["get_paid"], side: "composition", whatItCollects: "Mechanical royalties from Spotify, Apple Music, Amazon, etc.", connectSteps: ["Go to themlc.com", "Create account (free)", "Register as Self-Publisher", "Register songs with ISWC codes", "Verify ownership splits"], estimatedImpact: "Without this, streaming mechanicals go to 'black box' — major labels get your money", payoutCadence: "Monthly", website: "themlc.com", enabledFeatures: ["royalties"] },

  // Sound Recording
  { id: "s1", name: "SoundExchange", description: "Non-interactive digital performance royalties", valueProp: "Collect from Pandora, SiriusXM, internet radio", category: "sound_recording", status: "disconnected", importance: "essential", connectType: "manual", goals: ["get_paid"], side: "recording", whatItCollects: "45% featured artist, 50% label, 5% non-featured", connectSteps: ["Go to soundexchange.com", "Create account (free)", "Register as Artist OR Label", "Register sound recordings", "Submit Letter of Direction for producers"], estimatedImpact: "Without this, you earn $0 from Pandora, SiriusXM, and internet radio", payoutCadence: "Quarterly", website: "soundexchange.com", enabledFeatures: ["royalties"] },

  // YouTube
  { id: "y1", name: "YouTube CMS", description: "Content ID claiming & monetization", valueProp: "Earn from every video using your music", category: "youtube", status: "disconnected", importance: "essential", connectType: "manual", goals: ["get_paid", "grow_fans"], side: "both", whatItCollects: "Content ID claims, ad revenue, viewer data", connectSteps: ["Apply via distributor (CD Baby, DistroKid) or aggregator", "Upload reference files (audio fingerprints)", "Set policies: Monetize, Track, or Block", "Start earning from user-generated content"], estimatedImpact: "Monetize every YouTube video that uses your music", payoutCadence: "Monthly", website: "youtube.com", enabledFeatures: ["royalties", "analytics"] },

  // Payment
  { id: "pa1", name: "Stripe", description: "Online payment processing", valueProp: "Accept payments for merch, tickets, and downloads", category: "payment", status: "disconnected", importance: "recommended", connectType: "oauth", goals: ["sell_merch"], side: "recording", whatItCollects: "Payment processing, transaction history", connectSteps: ["Go to stripe.com", "Create account", "Connect bank account", "Enable in Artist Plan"], estimatedImpact: "Enable merch store, ticket sales, and digital downloads", payoutCadence: "2-day rolling", website: "stripe.com", enabledFeatures: ["merch", "finances"] },

  // Social
  { id: "so1", name: "Instagram", description: "Visual content and fan engagement", valueProp: "Reach fans with Reels, Stories, and posts", category: "social", status: "disconnected", importance: "recommended", connectType: "manual", goals: ["grow_fans"], side: "recording", whatItCollects: "Engagement metrics, follower growth", connectSteps: ["Ensure Business/Creator account", "Connect via Instagram Graph API", "Authorize Artist Plan"], estimatedImpact: "Track engagement and schedule content", website: "instagram.com", enabledFeatures: ["marketing", "content"] },

  // Email
  { id: "e1", name: "Mailchimp", description: "Email marketing for fan newsletters", valueProp: "Build and email your fan list", category: "email", status: "disconnected", importance: "recommended", connectType: "manual", goals: ["grow_fans"], side: "recording", whatItCollects: "Email open rates, subscriber growth", connectSteps: ["Create account at mailchimp.com (free up to 500 contacts)", "Get API key from Account Settings", "Paste API key in Artist Plan settings"], estimatedImpact: "Build direct fan relationships — you own this list", website: "mailchimp.com", enabledFeatures: ["marketing"] },

  // Analytics
  { id: "an1", name: "Spotify for Artists", description: "Streaming analytics dashboard", valueProp: "See who's listening and where", category: "analytics", status: "disconnected", importance: "essential", connectType: "manual", goals: ["grow_fans"], side: "recording", whatItCollects: "Stream counts, listener demographics, playlist data", connectSteps: ["Go to artists.spotify.com", "Claim your artist profile", "Data flows automatically via distributor"], estimatedImpact: "Understand your audience to make better decisions", website: "artists.spotify.com", enabledFeatures: ["analytics"] },
]

const sideColors = {
  composition: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  recording: "bg-green-500/10 text-green-500 border-green-500/30",
  both: "bg-purple-500/10 text-purple-500 border-purple-500/30",
}

const goalIcons: Record<GoalType, React.ElementType> = {
  get_paid: DollarIcon,
  grow_fans: UsersIcon,
  sell_merch: CartIcon,
}

const goalLabels: Record<GoalType, string> = {
  get_paid: "Get Paid",
  grow_fans: "Grow Fans",
  sell_merch: "Sell Merch",
}

// ====== SETUP WIZARD ======

function SetupWizardTab() {
  const [currentStep, setCurrentStep] = useState(0)

  const wizardSteps = [
    {
      title: "Distributor",
      subtitle: "Get your music on streaming platforms",
      description: "A distributor puts your music on Spotify, Apple Music, Amazon, and 100+ other platforms. This is step one — without it, none of the other integrations matter.",
      integrations: allIntegrations.filter(i => i.category === "distribution"),
      whyMatters: "Without distribution, your music isn't available anywhere. Everything else builds on this.",
    },
    {
      title: "Performance Rights (PRO)",
      subtitle: "Collect royalties from radio, TV, and venues",
      description: "A PRO (ASCAP or BMI) collects performance royalties whenever your song is played on radio, TV, in restaurants, at concerts, or on streaming services.",
      integrations: allIntegrations.filter(i => i.category === "pro"),
      whyMatters: "Without a PRO, you earn $0 from live performances, radio play, and streaming performance royalties.",
    },
    {
      title: "Mechanical Rights",
      subtitle: "Collect streaming mechanical royalties",
      description: "The MLC collects mechanical royalties from digital streaming services. This is separate from performance royalties.",
      integrations: allIntegrations.filter(i => i.category === "mechanical"),
      whyMatters: "Without MLC registration, your streaming mechanicals go to 'black box' pools distributed by market share — meaning major labels get your money.",
    },
    {
      title: "SoundExchange",
      subtitle: "Collect from non-interactive streaming",
      description: "SoundExchange collects royalties from Pandora, SiriusXM, and internet radio — services where listeners can't choose specific songs.",
      integrations: allIntegrations.filter(i => i.category === "sound_recording"),
      whyMatters: "Without SoundExchange, you earn $0 from satellite radio and internet radio.",
    },
    {
      title: "YouTube CMS",
      subtitle: "Monetize every video using your music",
      description: "YouTube Content ID detects when your music is used in videos and lets you earn ad revenue from them.",
      integrations: allIntegrations.filter(i => i.category === "youtube"),
      whyMatters: "Without YouTube CMS, you miss revenue from fan videos, covers, and user-generated content.",
    },
    {
      title: "Payments",
      subtitle: "Accept money from fans",
      description: "Connect Stripe or PayPal to sell merch, tickets, and digital downloads directly to fans.",
      integrations: allIntegrations.filter(i => i.category === "payment"),
      whyMatters: "Direct-to-fan sales have the highest margins. You keep 85-100% vs 30-50% on streaming.",
    },
  ]

  const step = wizardSteps[currentStep]
  const completedSteps = allIntegrations.filter(i => i.status === "connected").length
  const totalEssential = allIntegrations.filter(i => i.importance === "essential").length
  const progress = Math.round((completedSteps / totalEssential) * 100)

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card className="border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Setup Progress</p>
              <p className="text-sm text-muted-foreground">{completedSteps} of {totalEssential} essential integrations connected</p>
            </div>
            <p className="text-2xl font-bold text-primary">{progress}%</p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {wizardSteps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              i === currentStep ? "bg-primary text-primary-foreground" :
              i < currentStep ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {i < currentStep ? <Check className="h-4 w-4" /> : <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">{i + 1}</span>}
            {s.title}
          </button>
        ))}
      </div>

      {/* Current step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription>{step.subtitle}</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">Step {currentStep + 1} of {wizardSteps.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{step.description}</p>

          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium text-primary flex items-center gap-2">
              <Target className="h-4 w-4" />
              Why this matters
            </p>
            <p className="text-sm text-muted-foreground mt-1">{step.whyMatters}</p>
          </div>

          <div className="space-y-3">
            {step.integrations.map(int => (
              <div key={int.id} className={`p-4 border rounded-lg ${int.status === "connected" ? "border-green-500/30 bg-green-500/5" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{int.name}</p>
                    <p className="text-sm text-muted-foreground">{int.valueProp}</p>
                  </div>
                  <Badge variant={int.status === "connected" ? "default" : "outline"}>
                    {int.status === "connected" ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                {int.status !== "connected" && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">How to connect:</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      {int.connectSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    <p className="text-xs text-primary font-medium mt-2">Impact: {int.estimatedImpact}</p>
                    {int.payoutCadence && (
                      <p className="text-xs text-muted-foreground">Payout: {int.payoutCadence}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(Math.min(wizardSteps.length - 1, currentStep + 1))} disabled={currentStep === wizardSteps.length - 1}>
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ====== READINESS PANEL ======

function ReadinessPanel() {
  const compositionIntegrations = allIntegrations.filter(i => i.side === "composition" || i.side === "both")
  const recordingIntegrations = allIntegrations.filter(i => i.side === "recording" || i.side === "both")
  const compConnected = compositionIntegrations.filter(i => i.status === "connected").length
  const recConnected = recordingIntegrations.filter(i => i.status === "connected").length

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Readiness Check</CardTitle>
        <CardDescription>What's covered and what's missing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-500">Composition Side</p>
              <span className="text-sm font-bold">{compConnected}/{compositionIntegrations.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Songwriter/Publisher royalties</p>
            <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(compConnected / compositionIntegrations.length) * 100}%` }} />
            </div>
          </div>
          <div className="p-3 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-500">Recording Side</p>
              <span className="text-sm font-bold">{recConnected}/{recordingIntegrations.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Artist/Label royalties</p>
            <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(recConnected / recordingIntegrations.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-2">Quick Checklist</p>
          <div className="space-y-2">
            {[
              { label: "Registered with a PRO (ASCAP or BMI)", check: allIntegrations.some(i => i.category === "pro" && i.status === "connected") },
              { label: "Registered with MLC for streaming mechanicals", check: allIntegrations.some(i => i.id === "m1" && i.status === "connected") },
              { label: "Registered with SoundExchange", check: allIntegrations.some(i => i.id === "s1" && i.status === "connected") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.check ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== ROYALTY FLOW DIAGRAM ======

function RoyaltyFlowDiagram() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null)

  const nodes = [
    { id: "song", label: "Your Song", type: "source" },
    { id: "composition", label: "Composition", type: "copyright", children: ["pro", "mlc", "sync"] },
    { id: "recording", label: "Sound Recording", type: "copyright", children: ["distributor", "soundexchange", "youtube"] },
    { id: "pro", label: "PRO (ASCAP/BMI)", type: "collector", revenue: "Performance Royalties", detail: "Radio, TV, venues, streaming", integration: "p1" },
    { id: "mlc", label: "MLC", type: "collector", revenue: "Mechanical Royalties", detail: "Spotify, Apple Music, Amazon", integration: "m1" },
    { id: "sync", label: "Sync Licenses", type: "collector", revenue: "Sync Fees", detail: "Film, TV, ads, games", integration: null },
    { id: "distributor", label: "Distributor", type: "collector", revenue: "Streaming Revenue", detail: "All DSPs", integration: "d1" },
    { id: "soundexchange", label: "SoundExchange", type: "collector", revenue: "Digital Performance", detail: "Pandora, SiriusXM", integration: "s1" },
    { id: "youtube", label: "YouTube CMS", type: "collector", revenue: "Content ID Revenue", detail: "Ad revenue from videos", integration: "y1" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">How Royalties Flow</CardTitle>
        <CardDescription>Click any node to learn more</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Composition Side */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-blue-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Composition Side (Songwriter/Publisher)
            </p>
            {nodes.filter(n => ["pro", "mlc", "sync"].includes(n.id)).map(node => {
              const int = node.integration ? allIntegrations.find(i => i.id === node.integration) : null
              const isConnected = int?.status === "connected"
              return (
                <div
                  key={node.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${isConnected ? "border-green-500/30 bg-green-500/5" : "hover:border-primary/50"}`}
                  onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isConnected ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{node.revenue}</span>
                  </div>
                  {expandedNode === node.id && (
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground space-y-1">
                      <p>{node.detail}</p>
                      {int && !isConnected && (
                        <p className="text-primary font-medium">→ {int.estimatedImpact}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Recording Side */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-green-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Recording Side (Artist/Label)
            </p>
            {nodes.filter(n => ["distributor", "soundexchange", "youtube"].includes(n.id)).map(node => {
              const int = node.integration ? allIntegrations.find(i => i.id === node.integration) : null
              const isConnected = int?.status === "connected"
              return (
                <div
                  key={node.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${isConnected ? "border-green-500/30 bg-green-500/5" : "hover:border-primary/50"}`}
                  onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isConnected ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{node.revenue}</span>
                  </div>
                  {expandedNode === node.id && (
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground space-y-1">
                      <p>{node.detail}</p>
                      {int && !isConnected && (
                        <p className="text-primary font-medium">→ {int.estimatedImpact}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== FULL CATALOG ======

function CatalogTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | "all">("all")
  const [importanceFilter, setImportanceFilter] = useState<string>("all")
  const [goalFilter, setGoalFilter] = useState<GoalType | "all">("all")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filtered = allIntegrations.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || i.category === categoryFilter
    const matchesImportance = importanceFilter === "all" || i.importance === importanceFilter
    const matchesGoal = goalFilter === "all" || i.goals.includes(goalFilter)
    return matchesSearch && matchesCategory && matchesImportance && matchesGoal
  })

  const categories = [...new Set(filtered.map(i => i.category))]

  const categoryLabels: Record<string, string> = {
    distribution: "Distribution",
    pro: "Performance Rights",
    mechanical: "Mechanical Rights",
    sound_recording: "Sound Recording Rights",
    streaming: "Streaming Analytics",
    social: "Social Media",
    youtube: "YouTube & Video",
    sync: "Sync Licensing",
    email: "Email Marketing",
    payment: "Payment & E-commerce",
    analytics: "Analytics",
    accounting: "Accounting",
    collaboration: "Collaboration",
    fan_engagement: "Fan Engagement",
    merch: "Merch",
  }

  const categoryDescriptions: Record<string, string> = {
    distribution: "Get your music onto streaming platforms and stores",
    pro: "Collect royalties from radio, TV, venues, and streaming performances",
    mechanical: "Collect royalties from reproduction of your compositions",
    sound_recording: "Collect royalties for digital performance of your recordings",
    streaming: "Track your streaming performance and audience",
    social: "Reach and engage your fanbase",
    youtube: "Monetize your music on YouTube",
    sync: "License your music for film, TV, and ads",
    email: "Build direct relationships with fans",
    payment: "Accept money from fans directly",
    analytics: "Understand your audience and performance",
    accounting: "Track finances and prepare for taxes",
    collaboration: "Create music with others",
    fan_engagement: "Build recurring fan revenue",
    merch: "Sell merchandise to fans",
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search integrations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <select className="px-3 py-2 border rounded-md text-sm bg-background" value={importanceFilter} onChange={e => setImportanceFilter(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="essential">Essential Only</option>
          <option value="recommended">Recommended</option>
          <option value="optional">Optional</option>
        </select>
        <select className="px-3 py-2 border rounded-md text-sm bg-background" value={goalFilter} onChange={e => setGoalFilter(e.target.value as GoalType | "all")}>
          <option value="all">All Goals</option>
          <option value="get_paid">Get Paid</option>
          <option value="grow_fans">Grow Fans</option>
          <option value="sell_merch">Sell Merch</option>
        </select>
      </div>

      {/* Category groups */}
      {categories.map(cat => {
        const catIntegrations = filtered.filter(i => i.category === cat)
        const isExpanded = expandedCategory === cat || expandedCategory === null
        const connectedCount = catIntegrations.filter(i => i.status === "connected").length

        return (
          <Card key={cat}>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpandedCategory(isExpanded && categories.length > 1 ? cat : null)}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{categoryLabels[cat] || cat}</CardTitle>
                  <CardDescription>{categoryDescriptions[cat]}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{connectedCount}/{catIntegrations.length}</Badge>
                  {categories.length > 1 && (
                    isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent>
                <div className="grid gap-3">
                  {catIntegrations.map(int => (
                    <IntegrationCard key={int.id} integration={int} />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

// ====== INTEGRATION CARD ======

function IntegrationCard({ integration }: { integration: Integration }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`p-4 border rounded-lg transition-colors ${integration.status === "connected" ? "border-green-500/30 bg-green-500/5" : integration.importance === "essential" ? "border-yellow-500/20" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{integration.name}</p>
            {integration.importance === "essential" && (
              <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Essential</Badge>
            )}
            <Badge variant="outline" className={`text-xs ${sideColors[integration.side]}`}>
              {integration.side === "both" ? "Both" : integration.side === "composition" ? "Songwriter" : "Artist"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{integration.valueProp}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={integration.status === "connected" ? "default" : "outline"}>
            {integration.status === "connected" ? "Connected" : "Not Connected"}
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t space-y-3 text-sm">
          <p className="text-muted-foreground">{integration.description}</p>

          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs font-medium text-primary">Impact: {integration.estimatedImpact}</p>
            {integration.payoutCadence && (
              <p className="text-xs text-muted-foreground mt-1">Payout cadence: {integration.payoutCadence}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">How to connect ({integration.connectType === "oauth" ? "Automatic" : "Manual setup"}):</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              {integration.connectSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {integration.enabledFeatures && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Enables in Artist Plan:</p>
              <div className="flex gap-1 flex-wrap">
                {integration.enabledFeatures.map(f => (
                  <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>
          )}

          <Button size="sm" variant="outline" asChild>
            <a href={`https://${integration.website}`} target="_blank" rel="noopener noreferrer">
              Visit {integration.name} <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

// ====== MAIN PAGE ======

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect every platform an independent artist needs</p>
        </div>

        <Tabs defaultValue="wizard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="wizard" className="gap-2">
              <ZapIcon className="h-4 w-4" />
              Get Connected
            </TabsTrigger>
            <TabsTrigger value="catalog" className="gap-2">
              <Globe className="h-4 w-4" />
              Full Catalog
            </TabsTrigger>
            <TabsTrigger value="flow" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Royalty Flow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="space-y-6">
            <ReadinessPanel />
            <SetupWizardTab />
          </TabsContent>

          <TabsContent value="catalog"><CatalogTab /></TabsContent>

          <TabsContent value="flow"><RoyaltyFlowDiagram /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
