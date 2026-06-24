"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  Percent,
  Plus,
  Music,
  Film,
  Shield
} from "lucide-react"

interface SplitEntry {
  id: string
  name: string
  role: string
  split: number
  type: "writer" | "publisher" | "producer" | "artist" | "other"
}

const defaultSplits: SplitEntry[] = [
  { id: "1", name: "Alex Rivera", role: "Writer/Artist", split: 50, type: "writer" },
  { id: "2", name: "Jordan Chen", role: "Co-writer", split: 25, type: "writer" },
  { id: "3", name: "Taylor Kim", role: "Producer", split: 15, type: "producer" },
  { id: "4", name: "Sam Williams", role: "Featured Artist", split: 10, type: "artist" },
]

const typeColors: Record<string, string> = {
  writer: "bg-blue-500/10 text-blue-500",
  publisher: "bg-green-500/10 text-green-500",
  producer: "bg-purple-500/10 text-purple-500",
  artist: "bg-orange-500/10 text-orange-500",
  other: "bg-gray-500/10 text-gray-500",
}

function SplitCalculatorTab() {
  const [splits, setSplits] = useState<SplitEntry[]>(defaultSplits)
  const [newSplit, setNewSplit] = useState({ name: "", role: "", split: 0, type: "writer" as SplitEntry["type"] })
  const [totalRevenue, setTotalRevenue] = useState(10000)

  const totalSplit = splits.reduce((s, e) => s + e.split, 0)
  const isValid = totalSplit === 100

  const addSplit = () => {
    if (!newSplit.name || newSplit.split <= 0) return
    setSplits(prev => [...prev, { ...newSplit, id: Date.now().toString() }])
    setNewSplit({ name: "", role: "", split: 0, type: "writer" })
  }

  const removeSplit = (id: string) => {
    setSplits(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Split</p>
            <p className={`text-3xl font-bold ${isValid ? "text-green-500" : "text-red-500"}`}>{totalSplit}%</p>
            {!isValid && <p className="text-xs text-red-500">Must equal 100%</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Parties</p>
            <p className="text-3xl font-bold">{splits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                type="number"
                value={totalRevenue}
                onChange={e => setTotalRevenue(Number(e.target.value))}
                className="text-2xl font-bold h-auto p-0 border-0 bg-transparent"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Party</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Name" value={newSplit.name} onChange={e => setNewSplit({...newSplit, name: e.target.value})} className="flex-1" />
            <Input placeholder="Role" value={newSplit.role} onChange={e => setNewSplit({...newSplit, role: e.target.value})} className="flex-1" />
            <select className="px-3 py-2 border rounded-md text-sm" value={newSplit.type} onChange={e => setNewSplit({...newSplit, type: e.target.value as SplitEntry["type"]})}>
              <option value="writer">Writer</option>
              <option value="publisher">Publisher</option>
              <option value="producer">Producer</option>
              <option value="artist">Artist</option>
              <option value="other">Other</option>
            </select>
            <Input type="number" placeholder="%" value={newSplit.split || ""} onChange={e => setNewSplit({...newSplit, split: Number(e.target.value)})} className="w-20" />
            <Button onClick={addSplit}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Split Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {splits.map(split => (
              <div key={split.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={typeColors[split.type]}>{split.type}</Badge>
                  <div>
                    <p className="font-medium">{split.name}</p>
                    <p className="text-xs text-muted-foreground">{split.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">{split.split}%</p>
                    <p className="text-xs text-muted-foreground">${(totalRevenue * split.split / 100).toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeSplit(split.id)}>
                    <span className="text-red-500">×</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="font-medium">Total</span>
            <div className="flex items-center gap-4">
              <span className={`font-bold ${isValid ? "text-green-500" : "text-red-500"}`}>{totalSplit}%</span>
              <span className="font-bold">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Co-Write Rules from Passman
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>In the absence of a written agreement,</strong> ownership is split evenly between each contributing writer</p>
          <p>• <strong>Each writer can non-exclusively license the whole song</strong> — any writer can sign with any PRO</p>
          <p>• <strong>Toplining is treated the same as traditional co-writing</strong> in copyright law</p>
          <p>• <strong>A title alone cannot be copyrighted</strong> — must be a copyrightable contribution</p>
          <p>• <strong>All joint writers must intend to create a unitary work</strong> for joint work provisions to apply</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ProducerDealsTab() {
  const dealTypes = [
    {
      name: "Traditional Producer Deal",
      royaltyRate: "3-4% of PPD",
      advance: "$15,000-75,000+",
      recoupment: "Recouped from artist's share after recording costs",
      keyTerms: ["Net artist rate", "Retroactive to record one", "Cross-collateralization possible"]
    },
    {
      name: "Beat Lease",
      royaltyRate: "One-time fee ($50-500) or royalty split",
      advance: "N/A",
      recoupment: "N/A — flat fee or percentage",
      keyTerms: ["Non-exclusive or exclusive", "Beat stays with producer if non-exclusive", "Work-for-hire if exclusive"]
    },
    {
      name: "Production Agreement (Label)",
      royaltyRate: "3-5% of label's net receipts",
      advance: "From label budget",
      recoupment: "After artist recoupment",
      keyTerms: ["Label hires producer", "Producer paid from label's share", "Letter of direction for SoundExchange"]
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {dealTypes.map(deal => (
          <Card key={deal.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{deal.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground">Royalty Rate</p>
                  <p className="font-medium">{deal.royaltyRate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Advance</p>
                  <p className="font-medium">{deal.advance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Recoupment</p>
                  <p className="font-medium">{deal.recoupment}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-muted-foreground mb-1">Key Terms</p>
                <div className="flex flex-wrap gap-1">
                  {deal.keyTerms.map((term, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{term}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Producer Payment from Passman
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• Producers typically get <strong>3-4% of PPD</strong> (wholesale price)</p>
          <p>• Producer is paid <strong>after artist recoupment</strong> of recording costs — "net artist rate"</p>
          <p>• <strong>"Retroactive to record one"</strong> = once all costs recouped, producer gets paid from album 1 sales too</p>
          <p>• Producer must send <strong>Letter of Direction to SoundExchange</strong> to receive digital performance royalties</p>
          <p>• Without Letter of Direction, producer gets <strong>nothing from SoundExchange</strong> (unlike other countries)</p>
          <p>• AMP Act (Music Modernization Act) gives producers 2% of SoundExchange for recordings fixed before Nov 1, 1995 if no letter exists</p>
        </CardContent>
      </Card>
    </div>
  )
}

function SyncNavigatorTab() {
  const steps = [
    { step: 1, title: "Prepare Your Music", description: "Create high-quality masters. Ensure metadata is clean. Register with PRO and MLC.", time: "Ongoing" },
    { step: 2, title: "Register with Licensing Platforms", description: "Sign up with Songtradr, Musicbed, APM, or similar. Upload tracks with metadata.", time: "1-2 days" },
    { step: 3, title: "Build Your Catalog Profile", description: "Write compelling descriptions. Tag genres, moods, tempos. Include instrument info.", time: "1-2 hours per track" },
    { step: 4, title: "Network with Music Supervisors", description: "Attend film festivals, music conferences. Connect on LinkedIn. Be professional.", time: "Ongoing" },
    { step: 5, title: "Submit to Briefs", description: "Monitor licensing platforms for music briefs. Submit relevant tracks promptly.", time: "1-2 hours/week" },
    { step: 6, title: "Negotiate the Deal", description: "Sync fee is negotiable. Consider: use type, budget, territory, term, MFN clause.", time: "1-4 weeks" },
    { step: 7, title: "Clear Both Rights", description: "Need sync license (composition) AND master-use license (recording). If you own both, easy.", time: "1-2 weeks" },
    { step: 8, title: "Collect Royalties", description: "Performance royalties from PRO when TV show airs. Sync fee is one-time. Track cue sheets.", time: "Ongoing" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sync Placement Workflow</CardTitle>
          <CardDescription>From the Exploration.io guide — 8 steps to get your music placed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {s.step}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Timeline: {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sync Deal Points (Negotiable)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between p-2 border rounded">
              <span>Use type (feature/background/theme)</span>
              <span className="text-muted-foreground">Affects fee 3-10x</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Production budget</span>
              <span className="text-muted-foreground">Bigger budget = bigger fee</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Territory</span>
              <span className="text-muted-foreground">Worldwide vs regional</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Term</span>
              <span className="text-muted-foreground">2 years vs life of copyright</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>MFN clause</span>
              <span className="text-muted-foreground">Equal or better terms than others</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Typical Sync Fees</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between p-2 border rounded">
              <span>National commercial (1 year)</span>
              <span className="font-medium">$25,000-500,000+</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>TV network (feature use)</span>
              <span className="font-medium">$5,000-50,000+</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>TV network (background)</span>
              <span className="font-medium">$1,000-5,000</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Independent film</span>
              <span className="font-medium">$500-5,000</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Student film</span>
              <span className="font-medium">$0-500</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Video game</span>
              <span className="font-medium">$1,000-25,000+</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Licensing Platforms to Register With</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { name: "Songtradr", type: "Marketplace", note: "Free to join" },
              { name: "Musicbed", type: "Premium", note: "Application required" },
              { name: "APM Music", type: "Production library", note: "Large catalog" },
              { name: "Killer Tracks", type: "Production library", note: "High-quality production music" },
              { name: "FirstCom", type: "Production library", note: "Wide genre range" },
              { name: "Megatrax", type: "Production library", note: "Film/TV focused" },
              { name: "Rumblefish", type: "Multi-platform", note: "YouTube + sync" },
              { name: "Music Vine", type: "Curated", note: "Selective catalog" },
            ].map(p => (
              <div key={p.name} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.note}</p>
                </div>
                <Badge variant="outline" className="text-xs">{p.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TrademarkTab() {
  const protections = [
    {
      name: "Artist/Band Name",
      what: "Your stage name or band name",
      why: "Prevents others from using confusingly similar names",
      how: "USPTO trademark registration ($250-350 per class). Also common law rights from use.",
      priority: "HIGH"
    },
    {
      name: "Logo/Design",
      what: "Your visual logo or emblem",
      why: "Protects your visual brand identity",
      how: "USPTO design trademark registration. Can also use copyright.",
      priority: "HIGH"
    },
    {
      name: "Album/EP Titles",
      what: "Titles of your releases",
      why: "Usually not trademarkable alone, but can be if used as brand",
      how: "Generally protected by copyright, not trademark. Use TM symbol for common law rights.",
      priority: "LOW"
    },
    {
      name: "Song Titles",
      what: "Individual song titles",
      why: "Song titles alone cannot be copyrighted or trademarked",
      how: "Protected only as part of the composition copyright. No separate registration.",
      priority: "NONE"
    },
    {
      name: "Merchandise Designs",
      what: "Original artwork on merch",
      why: "Prevents counterfeiting and unauthorized use",
      how: "Copyright registration for artwork. Trademark for brand logos on merch.",
      priority: "MEDIUM"
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>What Can Be Protected</CardTitle>
          <CardDescription>From Passman Ch. 22 — Rights in a Name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {protections.map(p => (
              <div key={p.name} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{p.name}</p>
                  <Badge variant={p.priority === "HIGH" ? "destructive" : p.priority === "MEDIUM" ? "default" : "secondary"}>
                    {p.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1"><strong>What:</strong> {p.what}</p>
                <p className="text-sm text-muted-foreground mb-1"><strong>Why:</strong> {p.why}</p>
                <p className="text-sm"><strong>How:</strong> {p.how}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Rules from Passman</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Trademark vs Copyright:</strong> Trademark protects names/logos used in commerce. Copyright protects creative works.</p>
          <p>• <strong>Common law rights:</strong> You get some trademark rights just from using a name in commerce, even without registration.</p>
          <p>• <strong>USPTO registration</strong> gives nationwide priority and the ability to sue in federal court.</p>
          <p>• <strong>International protection:</strong> US trademark doesn't protect you abroad. Need separate filings in each country.</p>
          <p>• <strong>Band name ownership:</strong> If the band splits, who keeps the name? Address this in your band agreement BEFORE it becomes a problem.</p>
        </CardContent>
      </Card>
    </div>
  )
}
export default function ToolsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tools</h1>
          <p className="text-muted-foreground">Calculators, workflows, and reference guides</p>
        </div>

        <Tabs defaultValue="splits" className="space-y-4">
          <TabsList>
            <TabsTrigger value="splits" className="gap-2">
              <Users className="h-4 w-4" />
              Split Calculator
            </TabsTrigger>
            <TabsTrigger value="producer" className="gap-2">
              <Music className="h-4 w-4" />
              Producer Deals
            </TabsTrigger>
            <TabsTrigger value="sync" className="gap-2">
              <Film className="h-4 w-4" />
              Sync Navigator
            </TabsTrigger>
            <TabsTrigger value="trademark" className="gap-2">
              <Shield className="h-4 w-4" />
              Trademark Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="splits"><SplitCalculatorTab /></TabsContent>
          <TabsContent value="producer"><ProducerDealsTab /></TabsContent>
          <TabsContent value="sync"><SyncNavigatorTab /></TabsContent>
          <TabsContent value="trademark"><TrademarkTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

