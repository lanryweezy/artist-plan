"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, XCircle, Shield, Zap, Loader2 } from "lucide-react"
import { aiContractReview } from "@/services/ai"

type RiskLevel = "danger" | "warning" | "safe"

interface RedFlag { id: string; clause: string; risk: RiskLevel; explanation: string; whatToAsk: string }

const redFlags: RedFlag[] = [
  { id: "1", clause: "work for hire", risk: "danger", explanation: "Publisher owns 100%. One-time fee. No termination rights.", whatToAsk: "Negotiate for admin deal instead." },
  { id: "2", clause: "controlled composition", risk: "danger", explanation: "Limits mechanical royalties to 75% of statutory rate.", whatToAsk: "Fight for statutory rate (100%)." },
  { id: "3", clause: "360 deal", risk: "danger", explanation: "Label takes cut of touring, merch, endorsements.", whatToAsk: "Cap each revenue stream at 10-15%." },
  { id: "4", clause: "cross-collateralization", risk: "danger", explanation: "Advances from multiple albums pooled together.", whatToAsk: "Demand separate accounting per album." },
  { id: "5", clause: "no reversion", risk: "danger", explanation: "Label keeps masters forever after term.", whatToAsk: "Add sunset clause for master reversion." },
  { id: "6", clause: "no guaranteed release", risk: "warning", explanation: "Label doesn't have to release your music.", whatToAsk: "Add guaranteed release within X months." },
  { id: "7", clause: "packaging deduction", risk: "warning", explanation: "Deduction for physical packaging shouldn't apply to digital.", whatToAsk: "Remove packaging deductions on digital." },
  { id: "8", clause: "royalty below 15%", risk: "warning", explanation: "New artists typically get 13-16% of PPD.", whatToAsk: "Negotiate for higher rate." },
]

const riskColors: Record<RiskLevel, string> = { danger: "bg-red-500/10 text-red-500 border-red-500/30", warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30", safe: "bg-green-500/10 text-green-500 border-green-500/30" }

function ReviewTab() {
  const [text, setText] = useState("")
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [localFlags, setLocalFlags] = useState<RedFlag[]>([])

  const analyze = async () => {
    setLoading(true)
    const found = redFlags.filter(f => text.toLowerCase().includes(f.clause))
    setLocalFlags(found)
    try { setAiResult(await aiContractReview(text)) } catch { setAiResult("Connect Gemini API for full analysis.") }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" />AI Contract Review</CardTitle><CardDescription>Paste contract terms — AI scans for red flags</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <textarea className="w-full min-h-[200px] p-3 border rounded-lg bg-background text-sm" placeholder="Paste contract terms here..." value={text} onChange={e => setText(e.target.value)} />
          <Button onClick={analyze} disabled={text.length < 50 || loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Zap className="h-4 w-4 mr-2" />Analyze</>}
          </Button>
        </CardContent>
      </Card>
      {localFlags.length > 0 && (
        <div className="space-y-2">
          {localFlags.map(f => (
            <Card key={f.id} className={`border ${riskColors[f.risk]}`}><CardContent className="p-3">
              <p className="font-medium text-sm">{f.clause}</p>
              <p className="text-xs text-muted-foreground">{f.explanation}</p>
              <p className="text-xs text-primary mt-1">Negotiate: {f.whatToAsk}</p>
            </CardContent></Card>
          ))}
        </div>
      )}
      {aiResult && <Card><CardContent className="p-4"><div className="prose prose-sm max-w-none whitespace-pre-wrap">{aiResult}</div></CardContent></Card>}
    </div>
  )
}

function RedFlagsTab() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {redFlags.map(f => (
        <Card key={f.id} className={`border ${riskColors[f.risk]}`}><CardContent className="p-3">
          <p className="font-medium text-sm">{f.clause}</p>
          <p className="text-xs text-muted-foreground">{f.explanation}</p>
          <p className="text-xs text-primary mt-1">Negotiate: {f.whatToAsk}</p>
        </CardContent></Card>
      ))}
    </div>
  )
}

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Contracts</h1><p className="text-muted-foreground">AI-powered contract review with 8 red flags</p></div>
        <Tabs defaultValue="review" className="space-y-4">
          <TabsList>
            <TabsTrigger value="review" className="gap-2"><Zap className="h-4 w-4" />AI Review</TabsTrigger>
            <TabsTrigger value="flags" className="gap-2"><AlertTriangle className="h-4 w-4" />Red Flags</TabsTrigger>
          </TabsList>
          <TabsContent value="review"><ReviewTab /></TabsContent>
          <TabsContent value="flags"><RedFlagsTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
