"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus, ExternalLink, Search, CheckCircle, XCircle, ChevronRight, ChevronDown,
  ArrowRight, Globe, BarChart3, Zap, DollarSign, Shield, Music, Video,
  RefreshCw, AlertCircle, Loader2, Settings, Link2, Unlink
} from "lucide-react"
import { integrationManager, type IntegrationDefinition, type IntegrationState, type DataType } from "@/services/integrations"

// ====== READINESS PANEL ======

function ReadinessPanel() {
  const summary = integrationManager.getSummary()

  return (
    <Card className="border-primary/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Setup Progress</p>
            <p className="text-sm text-muted-foreground">{summary.connected} of {summary.essentialTotal} essential connected</p>
          </div>
          <p className="text-2xl font-bold text-primary">{summary.setupPercentage}%</p>
        </div>
        <div className="h-2 bg-muted rounded-full"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${summary.setupPercentage}%` }} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-2 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-500 font-medium">Composition ({summary.compositionConnected}/{summary.compositionTotal})</p>
            <div className="h-1.5 bg-muted rounded-full mt-1"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(summary.compositionConnected/summary.compositionTotal)*100}%` }} /></div>
          </div>
          <div className="p-2 border border-green-500/30 rounded-lg">
            <p className="text-xs text-green-500 font-medium">Recording ({summary.recordingConnected}/{summary.recordingTotal})</p>
            <div className="h-1.5 bg-muted rounded-full mt-1"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(summary.recordingConnected/summary.recordingTotal)*100}%` }} /></div>
          </div>
        </div>
        <div className="space-y-1">
          {integrationManager.getRegistrations().filter(r => r.required).map((reg, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {reg.status === "connected" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
              <span>{reg.agency}</span>
              <Badge variant="outline" className={`text-xs ml-auto ${reg.side === "composition" ? "text-blue-500" : "text-green-500"}`}>{reg.side}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ====== WIZARD ======

function WizardTab() {
  const [step, setStep] = useState(0)
  const [connectStates, setConnectStates] = useState<Record<string, boolean>>({})

  const steps = [
    { title: "Distributor", subtitle: "Get music on platforms", categories: ["distribution"] as const, why: "Without distribution, your music isn't available anywhere." },
    { title: "Performance Rights", subtitle: "Collect from radio/TV/venues", categories: ["pro"] as const, why: "Without a PRO, you earn $0 from radio, TV, and live." },
    { title: "Mechanical Rights", subtitle: "Collect streaming mechanicals", categories: ["mechanical"] as const, why: "Without MLC, streaming mechanicals go to 'black box'." },
    { title: "Sound Recording", subtitle: "Collect from non-interactive digital", categories: ["sound_recording"] as const, why: "Without SoundExchange, $0 from Pandora/SiriusXM." },
    { title: "YouTube & Analytics", subtitle: "Monetize and track performance", categories: ["youtube", "analytics"] as const, why: "Miss revenue from fan videos without YouTube CMS." },
    { title: "Payments & Email", subtitle: "Accept money and build fan relationships", categories: ["payment", "email"] as const, why: "Direct sales have highest margins (85-100%)." },
  ]

  const s = steps[step]
  const integrations = integrationManager.getAll().filter(i => s.categories.includes(i.category as any))
  const summary = integrationManager.getSummary()

  return (
    <div className="space-y-4">
      <Card className="border-primary/30"><CardContent className="p-3"><div className="flex items-center justify-between"><div><p className="font-medium">Setup Progress</p><p className="text-sm text-muted-foreground">{summary.connected} connected</p></div><p className="text-2xl font-bold text-primary">{summary.setupPercentage}%</p></div><div className="h-2 bg-muted rounded-full mt-2"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${summary.setupPercentage}%` }} /></div></CardContent></Card>
      <div className="flex gap-2 overflow-x-auto pb-2">{steps.map((s, i) => (<button key={i} onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{i < step ? <CheckCircle className="h-4 w-4" /> : <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">{i+1}</span>}{s.title}</button>))}</div>
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>{s.title}</CardTitle><CardDescription>{s.subtitle}</CardDescription></div><Badge variant="outline">Step {step+1}/{steps.length}</Badge></div></CardHeader>
        <CardContent className="space-y-3">
          <p className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">Why: {s.why}</p>
          {integrations.map(int => (
            <IntegrationCard key={int.id} integration={int} />
          ))}
          <div className="flex justify-between pt-4 border-t"><Button variant="ghost" onClick={() => setStep(Math.max(0, step-1))} disabled={step===0}>Previous</Button><Button onClick={() => setStep(Math.min(steps.length-1, step+1))} disabled={step===steps.length-1}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button></div>
        </CardContent>
      </Card>
    </div>
  )
}

// ====== INTEGRATION CARD ======

function IntegrationCard({ integration }: { integration: IntegrationDefinition & { state: IntegrationState } }) {
  const [expanded, setExpanded] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const isConnected = integration.state.status === "connected"

  const handleConnect = async () => {
    setIsConnecting(true)
    await integrationManager.connect(integration.id, { apiKey })
    setIsConnecting(false)
    setExpanded(false)
  }

  const handleDisconnect = () => {
    integrationManager.disconnect(integration.id)
  }

  const handleSync = async () => {
    await integrationManager.sync(integration.id)
  }

  return (
    <div className={`p-4 border rounded-lg transition-colors ${isConnected ? "border-green-500/30 bg-green-500/5" : integration.importance === "essential" ? "border-yellow-500/20" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{integration.name}</p>
            {integration.importance === "essential" && <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Essential</Badge>}
            <Badge variant="outline" className={`text-xs ${integration.side === "composition" ? "text-blue-500" : integration.side === "recording" ? "text-green-500" : "text-purple-500"}`}>
              {integration.side === "both" ? "Both" : integration.side === "composition" ? "Songwriter" : "Artist"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{integration.valueProp}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "outline"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t space-y-3 text-sm">
          <p className="text-muted-foreground">{integration.description}</p>

          {/* Data this integration provides */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Data collected:</p>
            <div className="flex gap-1 flex-wrap">
              {integration.whatItCollects.map(d => (
                <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
              ))}
            </div>
          </div>

          {/* Connect flow */}
          {integration.connectType === "api_key" && !isConnected && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">API Key:</p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Paste your API key"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleConnect} disabled={!apiKey || isConnecting}>
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
                  Connect
                </Button>
              </div>
            </div>
          )}

          {/* Manual registration steps */}
          {integration.connectType === "manual" && !isConnected && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">How to connect:</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                {integration.connectSteps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
              <Button size="sm" onClick={handleConnect}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark as Connected
              </Button>
            </div>
          )}

          {/* OAuth flow */}
          {integration.connectType === "oauth" && !isConnected && (
            <Button size="sm" onClick={handleConnect}>
              <Link2 className="h-4 w-4 mr-1" />
              Connect via {integration.name}
            </Button>
          )}

          {/* Connected state */}
          {isConnected && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Connected{integration.state.lastSyncAt && ` — Last sync: ${new Date(integration.state.lastSyncAt).toLocaleString()}`}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleSync}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
                <Button size="sm" variant="outline" onClick={handleDisconnect}>
                  <Unlink className="h-3 w-3 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          )}

          {/* Impact */}
          <div className="p-2 bg-primary/5 rounded text-xs">
            <p className="text-primary font-medium">Impact: Enables {integration.category} data in your dashboard</p>
            {integration.syncInterval > 0 && <p className="text-muted-foreground">Auto-syncs every {integration.syncInterval >= 1440 ? "day" : integration.syncInterval >= 60 ? `${integration.syncInterval/60}h` : `${integration.syncInterval}m`}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

// ====== CATALOG ======

function CatalogTab() {
  const [search, setSearch] = useState("")
  const [importance, setImportance] = useState<string>("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const all = integrationManager.getAll()
  const filtered = all.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchImp = importance === "all" || i.importance === importance
    return matchSearch && matchImp
  })

  const categories = [...new Set(filtered.map(i => i.category))]

  const categoryLabels: Record<string, string> = { distribution: "Distribution", pro: "Performance Rights", mechanical: "Mechanical Rights", sound_recording: "Sound Recording", youtube: "YouTube", payment: "Payment", email: "Email Marketing", analytics: "Analytics", social: "Social Media", streaming: "Streaming" }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <select className="px-3 py-2 border rounded-md text-sm bg-background" value={importance} onChange={e => setImportance(e.target.value)}><option value="all">All</option><option value="essential">Essential</option><option value="recommended">Recommended</option></select>
      </div>
      {categories.map(cat => {
        const catIntegrations = filtered.filter(i => i.category === cat)
        return (
          <Card key={cat}>
            <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(expanded === cat ? null : cat)}>
              <div className="flex items-center justify-between"><div><CardTitle className="text-sm">{categoryLabels[cat] || cat}</CardTitle></div><div className="flex items-center gap-2"><Badge variant="secondary" className="text-xs">{catIntegrations.filter(i => i.state.status === "connected").length}/{catIntegrations.length}</Badge>{expanded === cat ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</div></div>
            </CardHeader>
            {expanded === cat && <CardContent><div className="grid gap-2">{catIntegrations.map(int => <IntegrationCard key={int.id} integration={int} />)}</div></CardContent>}
          </Card>
        )
      })}
    </div>
  )
}

// ====== DATA FLOW ======

function DataFlowTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">How Data Flows</CardTitle><CardDescription>When you connect an integration, data flows into Artist Plan</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-medium text-blue-500 mb-2">1. Connect</p>
              <p className="text-xs text-muted-foreground">Enter API key or OAuth credentials. We validate the connection.</p>
            </div>
            <div className="p-3 border border-green-500/30 rounded-lg">
              <p className="text-sm font-medium text-green-500 mb-2">2. Sync</p>
              <p className="text-xs text-muted-foreground">We pull your data: streams, royalties, fans, analytics. Auto-syncs daily for most platforms.</p>
            </div>
            <div className="p-3 border border-purple-500/30 rounded-lg">
              <p className="text-sm font-medium text-purple-500 mb-2">3. Visualize</p>
              <p className="text-xs text-muted-foreground">Data appears in Dashboard, Royalties, Fans, Analytics pages. AI uses it for insights.</p>
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-medium mb-1">Data stays in your control</p>
            <p className="text-muted-foreground">We never store your API keys on our servers. All data is stored in your Supabase database. You can disconnect any integration at any time.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">What Each Integration Provides</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {integrationManager.getAll().map(int => (
              <div key={int.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{int.name}</span>
                  <Badge variant="outline" className="text-xs">{int.category}</Badge>
                </div>
                <div className="flex gap-1">
                  {int.whatItCollects.map(d => (
                    <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
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

// ====== MAIN PAGE ======

export default function IntegrationsPage() {
  const [, setTick] = useState(0) // Force re-render when integrations change

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Integrations</h1><p className="text-muted-foreground">Connect platforms, sync data, and track registrations</p></div>
        <Tabs defaultValue="wizard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="wizard" className="gap-2"><Zap className="h-4 w-4" />Get Connected</TabsTrigger>
            <TabsTrigger value="catalog" className="gap-2"><Globe className="h-4 w-4" />All Integrations</TabsTrigger>
            <TabsTrigger value="data" className="gap-2"><BarChart3 className="h-4 w-4" />Data Flow</TabsTrigger>
          </TabsList>
          <TabsContent value="wizard" className="space-y-6"><ReadinessPanel /><WizardTab /></TabsContent>
          <TabsContent value="catalog"><CatalogTab /></TabsContent>
          <TabsContent value="data"><DataFlowTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
