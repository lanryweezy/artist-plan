"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ExternalLink, Search, CheckCircle, XCircle, ChevronRight, ChevronDown, ArrowRight, Globe, BarChart3, Zap, DollarSign, Shield, Music, Video } from "lucide-react"

type IntegrationCategory = "distribution" | "pro" | "mechanical" | "sound_recording" | "youtube" | "payment" | "email" | "analytics" | "social"

interface Integration { id: string; name: string; description: string; valueProp: string; category: IntegrationCategory; status: "connected" | "disconnected"; importance: "essential" | "recommended"; connectType: "oauth" | "manual" | "signup"; side: "composition" | "recording" | "both"; whatItCollects: string; connectSteps: string[]; estimatedImpact: string; payoutCadence?: string; website: string }

const allIntegrations: Integration[] = [
  { id: "d1", name: "DistroKid", description: "Distribute music to 150+ platforms", valueProp: "Get your music on every streaming platform", category: "distribution", status: "disconnected", importance: "essential", connectType: "signup", side: "recording", whatItCollects: "Streaming/download royalties", connectSteps: ["Create account at distrokid.com", "Pay $19.99/year", "Upload music"], estimatedImpact: "Unlock all streaming revenue", payoutCadence: "Monthly", website: "distrokid.com" },
  { id: "d2", name: "CD Baby", description: "Distribution + publishing + sync", valueProp: "All-in-one for indie artists", category: "distribution", status: "disconnected", importance: "essential", connectType: "signup", side: "both", whatItCollects: "Streaming, download, sync, publishing", connectSteps: ["Create account at cdbaby.com", "Choose plan", "Upload music"], estimatedImpact: "Full distribution + publishing", payoutCadence: "Weekly", website: "cdbaby.com" },
  { id: "p1", name: "ASCAP", description: "Performance rights organization", valueProp: "Collect from radio, TV, venues", category: "pro", status: "disconnected", importance: "essential", connectType: "manual", side: "composition", whatItCollects: "Performance royalties", connectSteps: ["Go to ascap.com", "Become a Member", "Pay $50", "Register songs"], estimatedImpact: "Without this: $0 from radio, TV, live", payoutCadence: "Quarterly", website: "ascap.com" },
  { id: "p2", name: "BMI", description: "Performance rights organization", valueProp: "Collect from radio, TV, venues", category: "pro", status: "disconnected", importance: "essential", connectType: "manual", side: "composition", whatItCollects: "Performance royalties", connectSteps: ["Go to bmi.com", "Create account (free)", "Register songs"], estimatedImpact: "Without this: $0 from radio, TV, live", payoutCadence: "Quarterly", website: "bmi.com" },
  { id: "m1", name: "MLC", description: "Mechanical Licensing Collective", valueProp: "Collect streaming mechanicals", category: "mechanical", status: "disconnected", importance: "essential", connectType: "manual", side: "composition", whatItCollects: "Streaming mechanicals (Spotify, Apple, Amazon)", connectSteps: ["Go to themlc.com", "Create account (free)", "Register songs"], estimatedImpact: "Without this: mechanicals go to 'black box'", payoutCadence: "Monthly", website: "themlc.com" },
  { id: "s1", name: "SoundExchange", description: "Non-interactive digital performance", valueProp: "Collect from Pandora, SiriusXM", category: "sound_recording", status: "disconnected", importance: "essential", connectType: "manual", side: "recording", whatItCollects: "45% artist / 50% label / 5% non-featured", connectSteps: ["Go to soundexchange.com", "Create account (free)", "Register recordings"], estimatedImpact: "Without this: $0 from satellite/internet radio", payoutCadence: "Quarterly", website: "soundexchange.com" },
  { id: "y1", name: "YouTube CMS", description: "Content ID & monetization", valueProp: "Earn from every video using your music", category: "youtube", status: "disconnected", importance: "essential", connectType: "manual", side: "both", whatItCollects: "Content ID claims, ad revenue", connectSteps: ["Apply via distributor or aggregator", "Upload reference files", "Set policies"], estimatedImpact: "Monetize every YouTube video with your music", payoutCadence: "Monthly", website: "youtube.com" },
  { id: "pa1", name: "Stripe", description: "Payment processing", valueProp: "Accept payments for merch/tickets", category: "payment", status: "disconnected", importance: "recommended", connectType: "oauth", side: "recording", whatItCollects: "Payment processing", connectSteps: ["Go to stripe.com", "Create account", "Connect bank"], estimatedImpact: "Enable merch store and ticket sales", payoutCadence: "2-day rolling", website: "stripe.com" },
  { id: "e1", name: "Mailchimp", description: "Email marketing", valueProp: "Build and email your fan list", category: "email", status: "disconnected", importance: "recommended", connectType: "manual", side: "recording", whatItCollects: "Email metrics", connectSteps: ["Create account (free up to 500)", "Get API key", "Paste in settings"], estimatedImpact: "Direct fan relationships you own", website: "mailchimp.com" },
  { id: "an1", name: "Spotify for Artists", description: "Streaming analytics", valueProp: "See who's listening and where", category: "analytics", status: "disconnected", importance: "essential", connectType: "manual", side: "recording", whatItCollects: "Stream counts, demographics", connectSteps: ["Go to artists.spotify.com", "Claim profile", "Data flows via distributor"], estimatedImpact: "Understand your audience", website: "artists.spotify.com" },
]

const categoryLabels: Record<string, string> = { distribution: "Distribution", pro: "Performance Rights", mechanical: "Mechanical Rights", sound_recording: "Sound Recording", youtube: "YouTube", payment: "Payment", email: "Email Marketing", analytics: "Analytics", social: "Social Media" }
const categoryDescriptions: Record<string, string> = { distribution: "Get music onto platforms", pro: "Collect performance royalties", mechanical: "Collect streaming mechanicals", sound_recording: "Collect from non-interactive digital", youtube: "Monetize on YouTube", payment: "Accept fan payments", email: "Build fan relationships", analytics: "Track audience", social: "Reach fans" }
const sideColors: Record<string, string> = { composition: "bg-blue-500/10 text-blue-500 border-blue-500/30", recording: "bg-green-500/10 text-green-500 border-green-500/30", both: "bg-purple-500/10 text-purple-500 border-purple-500/30" }

function ReadinessPanel() {
  const compAll = allIntegrations.filter(i => i.side === "composition" || i.side === "both")
  const recAll = allIntegrations.filter(i => i.side === "recording" || i.side === "both")
  const compConnected = compAll.filter(i => i.status === "connected").length
  const recConnected = recAll.filter(i => i.status === "connected").length
  const essentialMissing = allIntegrations.filter(i => i.importance === "essential" && i.status === "disconnected").length

  return (
    <Card className="border-primary/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">Setup Progress</p>
          <p className="text-sm text-muted-foreground">{allIntegrations.filter(i => i.status === "connected").length} connected</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-2 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-500 font-medium">Composition ({compConnected}/{compAll.length})</p>
            <div className="h-1.5 bg-muted rounded-full mt-1"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(compConnected/compAll.length)*100}%` }} /></div>
          </div>
          <div className="p-2 border border-green-500/30 rounded-lg">
            <p className="text-xs text-green-500 font-medium">Recording ({recConnected}/{recAll.length})</p>
            <div className="h-1.5 bg-muted rounded-full mt-1"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(recConnected/recAll.length)*100}%` }} /></div>
          </div>
        </div>
        {essentialMissing > 0 && <p className="text-xs text-yellow-500">{essentialMissing} essential integrations missing</p>}
        <div className="space-y-1">
          {[
            { label: "Registered with PRO", check: allIntegrations.some(i => i.category === "pro" && i.status === "connected") },
            { label: "Registered with MLC", check: allIntegrations.some(i => i.id === "m1" && i.status === "connected") },
            { label: "Registered with SoundExchange", check: allIntegrations.some(i => i.id === "s1" && i.status === "connected") },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {item.check ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function WizardTab() {
  const [step, setStep] = useState(0)
  const steps = [
    { title: "Distributor", subtitle: "Get music on platforms", integrations: allIntegrations.filter(i => i.category === "distribution"), why: "Without distribution, your music isn't available anywhere." },
    { title: "Performance Rights", subtitle: "Collect from radio/TV/venues", integrations: allIntegrations.filter(i => i.category === "pro"), why: "Without a PRO, you earn $0 from radio, TV, and live." },
    { title: "Mechanical Rights", subtitle: "Collect streaming mechanicals", integrations: allIntegrations.filter(i => i.category === "mechanical"), why: "Without MLC, streaming mechanicals go to 'black box'." },
    { title: "SoundExchange", subtitle: "Collect from non-interactive digital", integrations: allIntegrations.filter(i => i.category === "sound_recording"), why: "Without SoundExchange, $0 from Pandora/SiriusXM." },
    { title: "YouTube", subtitle: "Monetize every video", integrations: allIntegrations.filter(i => i.category === "youtube"), why: "Without YouTube CMS, miss revenue from fan videos." },
    { title: "Payments", subtitle: "Accept fan money", integrations: allIntegrations.filter(i => i.category === "payment"), why: "Direct sales have highest margins (85-100% vs streaming 30-50%)." },
  ]
  const s = steps[step]
  const connected = allIntegrations.filter(i => i.status === "connected").length
  const essential = allIntegrations.filter(i => i.importance === "essential").length

  return (
    <div className="space-y-4">
      <Card className="border-primary/30"><CardContent className="p-3"><div className="flex items-center justify-between"><div><p className="font-medium">Setup Progress</p><p className="text-sm text-muted-foreground">{connected}/{essential} essential connected</p></div><p className="text-2xl font-bold text-primary">{Math.round((connected/essential)*100)}%</p></div><div className="h-2 bg-muted rounded-full mt-2"><div className="h-full bg-primary rounded-full" style={{ width: `${(connected/essential)*100}%` }} /></div></CardContent></Card>
      <div className="flex gap-2 overflow-x-auto pb-2">{steps.map((s, i) => (<button key={i} onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{i < step ? <CheckCircle className="h-4 w-4" /> : <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">{i+1}</span>}{s.title}</button>))}</div>
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>{s.title}</CardTitle><CardDescription>{s.subtitle}</CardDescription></div><Badge variant="outline">Step {step+1}/{steps.length}</Badge></div></CardHeader>
        <CardContent className="space-y-3">
          <p className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">Why: {s.why}</p>
          {s.integrations.map(int => (
            <div key={int.id} className={`p-4 border rounded-lg ${int.status === "connected" ? "border-green-500/30 bg-green-500/5" : ""}`}>
              <div className="flex items-center justify-between"><div><p className="font-medium">{int.name}</p><p className="text-sm text-muted-foreground">{int.valueProp}</p></div><Badge variant={int.status === "connected" ? "default" : "outline"}>{int.status === "connected" ? "Connected" : "Not Connected"}</Badge></div>
              {int.status !== "connected" && <div className="mt-3 text-xs text-muted-foreground"><p className="font-medium mb-1">How to connect:</p><ol className="list-decimal list-inside space-y-1">{int.connectSteps.map((s, i) => <li key={i}>{s}</li>)}</ol><p className="text-primary font-medium mt-2">Impact: {int.estimatedImpact}</p>{int.payoutCadence && <p>Payout: {int.payoutCadence}</p>}</div>}
            </div>
          ))}
          <div className="flex justify-between pt-4 border-t"><Button variant="ghost" onClick={() => setStep(Math.max(0, step-1))} disabled={step===0}>Previous</Button><Button onClick={() => setStep(Math.min(steps.length-1, step+1))} disabled={step===steps.length-1}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button></div>
        </CardContent>
      </Card>
    </div>
  )
}

function CatalogTab() {
  const [search, setSearch] = useState("")
  const [importance, setImportance] = useState<string>("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = allIntegrations.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchImp = importance === "all" || i.importance === importance
    return matchSearch && matchImp
  })

  const categories = [...new Set(filtered.map(i => i.category))]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <select className="px-3 py-2 border rounded-md text-sm bg-background" value={importance} onChange={e => setImportance(e.target.value)}><option value="all">All</option><option value="essential">Essential</option><option value="recommended">Recommended</option></select>
      </div>
      {categories.map(cat => (
        <Card key={cat}>
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(expanded === cat ? null : cat)}>
            <div className="flex items-center justify-between"><div><CardTitle className="text-sm">{categoryLabels[cat]}</CardTitle><CardDescription className="text-xs">{categoryDescriptions[cat]}</CardDescription></div><div className="flex items-center gap-2"><Badge variant="secondary" className="text-xs">{filtered.filter(i => i.category === cat).length}</Badge>{expanded === cat ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</div></div>
          </CardHeader>
          {expanded === cat && <CardContent><div className="grid gap-2">{filtered.filter(i => i.category === cat).map(int => (
            <div key={int.id} className={`p-3 border rounded-lg ${int.status === "connected" ? "border-green-500/30 bg-green-500/5" : ""}`}>
              <div className="flex items-center justify-between">
                <div><p className="font-medium text-sm">{int.name}</p><p className="text-xs text-muted-foreground">{int.valueProp}</p></div>
                <div className="flex items-center gap-2"><Badge variant="outline" className={`text-xs ${sideColors[int.side]}`}>{int.side === "both" ? "Both" : int.side}</Badge><Badge variant={int.status === "connected" ? "default" : "outline"}>{int.status === "connected" ? "Connected" : "Not Connected"}</Badge></div>
              </div>
              <div className="mt-2 p-2 bg-primary/5 rounded text-xs"><p className="text-primary font-medium">Impact: {int.estimatedImpact}</p></div>
            </div>
          ))}</div></CardContent>}
        </Card>
      ))}
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Integrations</h1><p className="text-muted-foreground">Connect every platform an independent artist needs</p></div>
        <Tabs defaultValue="wizard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="wizard" className="gap-2"><Zap className="h-4 w-4" />Get Connected</TabsTrigger>
            <TabsTrigger value="catalog" className="gap-2"><Globe className="h-4 w-4" />Catalog</TabsTrigger>
          </TabsList>
          <TabsContent value="wizard" className="space-y-6"><ReadinessPanel /><WizardTab /></TabsContent>
          <TabsContent value="catalog"><CatalogTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
