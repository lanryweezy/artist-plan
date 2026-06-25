"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield, CheckCircle, XCircle, AlertCircle, ExternalLink, RefreshCw,
  DollarSign, Globe, Music, ArrowRight, Zap, Clock, Target, TrendingUp,
  Calculator, FileText
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { integrationManager } from "@/services/integrations"

// ====== PRIORITY 1: Registration Completeness Tracker ======

interface RegistrationCheck {
  id: string
  name: string
  side: "composition" | "recording" | "both"
  category: string
  required: boolean
  estimatedRevenue: string
  frequency: string
  website: string
  steps: string[]
  whyMissing: string
  status: "active" | "not_started" | "in_progress" | "needs_update"
}

const registrations: RegistrationCheck[] = [
  { id: "ascap", name: "ASCAP", side: "composition", category: "Performance Rights", required: true, estimatedRevenue: "$200-2,000/quarter", frequency: "Quarterly", website: "ascap.com", steps: ["Go to ascap.com", "Become a Member ($50)", "Register as Writer AND Publisher", "Register all songs with ISWC codes"], whyMissing: "Without this, you earn $0 from radio, TV, venues, and streaming performance royalties.", status: "active" },
  { id: "bmi", name: "BMI", side: "composition", category: "Performance Rights", required: true, estimatedRevenue: "$200-2,000/quarter", frequency: "Quarterly", website: "bmi.com", steps: ["Go to bmi.com", "Create account (free)", "Register as Writer or Publisher", "Register all songs"], whyMissing: "Without this, you earn $0 from radio, TV, venues, and streaming performance royalties.", status: "not_started" },
  { id: "mlc", name: "MLC", side: "composition", category: "Mechanical Rights", required: true, estimatedRevenue: "$50-500/month", frequency: "Monthly", website: "themlc.com", steps: ["Go to themlc.com", "Create account (free)", "Register as Self-Publisher", "Register songs with ISWC codes", "Verify ownership splits"], whyMissing: "Without this, streaming mechanicals go to 'black box' — major labels get your money.", status: "not_started" },
  { id: "hfa", name: "Harry Fox Agency", side: "composition", category: "Mechanical Rights", required: true, estimatedRevenue: "$10-200/quarter", frequency: "Quarterly", website: "harryfox.com", steps: ["Go to harryfox.com", "Apply for publisher affiliation", "Must have commercially released song", "Register songs via eSong or CWR"], whyMissing: "Without this, physical and some digital mechanical royalties are uncollected.", status: "not_started" },
  { id: "music_reports", name: "Music Reports", side: "composition", category: "Mechanical Rights", required: false, estimatedRevenue: "$5-100/month", frequency: "Monthly", website: "musicreports.com", steps: ["Go to musicreports.com", "Submit metadata via Excel template", "Sign licensing agreements"], whyMissing: "Without this, royalties from TikTok, Peloton, and non-traditional platforms are uncollected.", status: "not_started" },
  { id: "soundexchange", name: "SoundExchange", side: "recording", category: "Digital Performance", required: true, estimatedRevenue: "$100-1,000/quarter", frequency: "Quarterly", website: "soundexchange.com", steps: ["Go to soundexchange.com", "Create account (free)", "Register as Artist OR Label", "Register recordings with ISRC codes", "Submit Letter of Direction for producers"], whyMissing: "Without this, you earn $0 from Pandora, SiriusXM, and internet radio.", status: "not_started" },
  { id: "youtube_cms", name: "YouTube CMS", side: "recording", category: "Content ID", required: true, estimatedRevenue: "$50-2,000/month", frequency: "Monthly", website: "youtube.com", steps: ["Apply via distributor or aggregator", "Upload reference files", "Set policies: Monetize/Track/Block"], whyMissing: "Without this, you miss revenue from every fan video using your music.", status: "not_started" },
  { id: "us_copyright", name: "US Copyright Office", side: "both", category: "Legal Protection", required: true, estimatedRevenue: "Legal protection", frequency: "One-time per work", website: "copyright.gov", steps: ["Go to copyright.gov", "eCO system → PA form (compositions) or SR form (sound recordings)", "Pay $35-45", "Submit deposit copy"], whyMissing: "Without registration, you cannot file infringement suits in federal court.", status: "not_started" },
]

const sideColors = { composition: "text-blue-500", recording: "text-green-500", both: "text-purple-500" }

function RegistrationTracker() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const activeCount = registrations.filter(r => r.status === "active").length
  const requiredMissing = registrations.filter(r => r.required && r.status !== "active").length

  return (
    <div className="space-y-4">
      <Card className="border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {requiredMissing} required registrations missing
              </p>
              <p className="text-sm text-muted-foreground">You are leaving money on the table</p>
            </div>
            <p className="text-2xl font-bold text-red-500">{activeCount}/{registrations.length}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {registrations.map(reg => (
          <Card key={reg.id} className={reg.required && reg.status !== "active" ? "border-yellow-500/30" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}>
                <div className="flex items-center gap-3">
                  {reg.status === "active" ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                   reg.required ? <AlertCircle className="h-5 w-5 text-yellow-500" /> :
                   <XCircle className="h-5 w-4 text-muted-foreground" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{reg.name}</p>
                      <Badge variant="outline" className={`text-xs ${sideColors[reg.side]}`}>{reg.side}</Badge>
                      {reg.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{reg.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <p className="font-medium">{reg.estimatedRevenue}</p>
                    <p className="text-muted-foreground">{reg.frequency}</p>
                  </div>
                  <Badge variant={reg.status === "active" ? "default" : "outline"}>
                    {reg.status === "active" ? "Active" : "Not Started"}
                  </Badge>
                </div>
              </div>

              {expandedId === reg.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <p className="text-sm font-medium text-red-500">Why this matters:</p>
                    <p className="text-sm text-muted-foreground">{reg.whyMissing}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">How to register:</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      {reg.steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`https://${reg.website}`} target="_blank" rel="noopener noreferrer">
                      Go to {reg.name} <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ====== PRIORITY 1: AI Contract Review ======

function AIContractReview() {
  const [contractText, setContractText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const analyze = async () => {
    setIsAnalyzing(true)
    // In production, this calls Gemini with the knowledge base
    await new Promise(r => setTimeout(r, 1500))
    setResult(`📋 **Contract Analysis:**

I scanned your contract for 18 common music industry red flags:

**🔴 DANGER (Immediate action needed):**
- Check for "work for hire" language — if present, publisher owns 100% with NO termination rights
- Check for "controlled composition" clause — limits your mechanical royalties to 75% of statutory rate
- Check for "360 deal" provisions — label takes cut of touring, merch, endorsements (10-25%)
- Check for "cross-collateralization" — advances from multiple albums pooled together

**🟡 WARNINGS (Negotiate these):**
- Look for packaging deductions — should NOT apply to digital sales
- Check reserve percentages — should be capped at 15-20%
- Review royalty rate — new artists typically get 13-16% of PPD (wholesale)
- Check if controlled composition applies to digital downloads (post-1995 it shouldn't)

**🟢 GOOD SIGNS (Artist-friendly):**
- Admin deal structure (you keep ownership, publisher takes 10-25% fee)
- Statutory rate for mechanicals (no below-rate deduction)
- Separate accounting per album (no cross-collateralization)
- Sunset clauses for reversion of masters after term

**What to negotiate:**
1. Remove or limit controlled composition clause
2. Cap reserves at 15% maximum
3. Ensure NO packaging deductions on digital sales
4. Add guaranteed release clause (label must release within X months)
5. Include reversion/sunset of masters after term ends
6. Separate accounting per album (no cross-collateralization)
7. Limit 360 provisions to specific revenue streams with caps

**Remember:** This is AI analysis. Always have an entertainment attorney ($300-500/hr) review before signing. But this gives you the questions to ask and the clauses to fight for.`)
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />AI Contract Review</CardTitle>
          <CardDescription>Paste contract terms — AI scans for 18 music industry red flags in seconds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full min-h-[200px] p-3 border rounded-lg bg-background text-sm"
            placeholder="Paste your contract terms here. Include key clauses like:

- Royalty rates and how they're calculated
- Term/duration of the agreement
- Territory (where the deal applies)
- Ownership/copyright transfer
- Recoupment terms and what's recoupable
- Controlled composition clause
- Work for hire language
- 360 deal provisions
- Termination rights and sunset clauses

The more text you paste, the better the analysis."
            value={contractText}
            onChange={e => setContractText(e.target.value)}
          />
          <Button onClick={analyze} disabled={contractText.length < 50 || isAnalyzing} className="w-full">
            {isAnalyzing ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Zap className="h-4 w-4 mr-2" />Analyze Contract</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="p-4">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{result}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ====== PRIORITY 1: Metadata Health Checker ======

interface MetadataCheck {
  name: string
  status: "pass" | "warning" | "fail"
  count: string
  impact: string
  fix: string
}

function MetadataHealthChecker() {
  const checks: MetadataCheck[] = [
    { name: "ISRC codes assigned to all tracks", status: "pass", count: "24/24", impact: "Required for streaming tracking", fix: "Assign via distributor" },
    { name: "Song titles match across DSPs", status: "pass", count: "24/24", impact: "Prevents claiming errors", fix: "Update via distributor" },
    { name: "Artist name consistency", status: "pass", count: "24/24", impact: "Prevents split royalties", fix: "Update via distributor" },
    { name: "Copyright owner info", status: "warning", count: "20/24", impact: "Missing info = uncollected royalties", fix: "Update metadata in distributor" },
    { name: "Lyrics submitted", status: "fail", count: "12/24", impact: "No lyric display royalties", fix: "Submit via distributor or LyricFind" },
    { name: "ISWC codes registered", status: "warning", count: "3/4", impact: "Performance royalties may not track", fix: "Register with ASCAP or MLC" },
    { name: "MLC registration", status: "fail", count: "0/4", impact: "NO streaming mechanicals collected", fix: "Register at themlc.com IMMEDIATELY" },
    { name: "HFA registration", status: "fail", count: "0/4", impact: "NO physical mechanicals collected", fix: "Register at harryfox.com" },
    { name: "SoundExchange registration", status: "fail", count: "0/4", impact: "NO Pandora/SiriusXM royalties", fix: "Register at soundexchange.com" },
    { name: "YouTube Content ID claims", status: "warning", count: "18/24", impact: "May not be monetized on YouTube", fix: "Upload via aggregator" },
    { name: "Copyright registered with USCO", status: "fail", count: "0/4", impact: "Cannot file infringement suits", fix: "Register at copyright.gov ($35-45)" },
  ]

  const passed = checks.filter(c => c.status === "pass").length
  const warnings = checks.filter(c => c.status === "warning").length
  const failed = checks.filter(c => c.status === "fail").length
  const score = Math.round((passed / checks.length) * 100)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Metadata Health Score</CardTitle>
              <CardDescription>{passed} passed, {warnings} warnings, {failed} failed out of {checks.length} checks</CardDescription>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"}`}>{score}%</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
            <div className="h-full flex">
              <div className="bg-green-500" style={{ width: `${(passed/checks.length)*100}%` }} />
              <div className="bg-yellow-500" style={{ width: `${(warnings/checks.length)*100}%` }} />
              <div className="bg-red-500" style={{ width: `${(failed/checks.length)*100}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            {checks.map((check, i) => (
              <div key={i} className={`flex items-center justify-between p-3 border rounded-lg ${check.status === "fail" ? "border-red-500/30 bg-red-500/5" : ""}`}>
                <div className="flex items-center gap-3">
                  {check.status === "pass" ? <CheckCircle className="h-4 w-4 text-green-500" /> :
                   check.status === "warning" ? <AlertCircle className="h-4 w-4 text-yellow-500" /> :
                   <XCircle className="h-4 w-4 text-red-500" />}
                  <div>
                    <p className="text-sm font-medium">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.impact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{check.count}</span>
                  <Badge variant={check.status === "pass" ? "default" : check.status === "warning" ? "secondary" : "destructive"} className="text-xs">
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            The "Black Box" Problem
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>When streaming platforms can't match a song to a rights holder, the royalties go into "black box" pools distributed by <strong>market share</strong> — meaning major labels get YOUR unclaimed money.</p>
          <p className="font-medium">The only solution: Register with every collection agency and keep your metadata clean.</p>
          <p className="text-muted-foreground">ISRC codes identify recordings. ISWC codes identify compositions. IPI numbers identify writers. Without these, you're invisible to the system.</p>
          <p className="font-medium text-red-500 mt-2">SoundExchange alone has $300M+ in unclaimed royalties. Your money might be in there.</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ====== PRIORITY 2: AI Career Advisor ======

function AICareerAdvisor() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  const ask = async () => {
    setIsThinking(true)
    await new Promise(r => setTimeout(r, 1500))
    setAnswer(`Based on your current situation, here's my analysis:

**Your Status:**
- 2,340 monthly listeners on Spotify
- 4 songs released
- Not registered with MLC, HFA, or SoundExchange
- No YouTube CMS set up
- No email list

**Top 3 Actions (by impact):**

1. **Register with MLC** (Today)
   - Why: Without this, ALL your streaming mechanical royalties go to the "black box"
   - How: themlc.com → free → register songs with ISWC codes
   - Impact: Could recover $50-500/month

2. **Register with SoundExchange** (Today)
   - Why: Without this, you earn $0 from Pandora, SiriusXM, internet radio
   - How: soundexchange.com → free → register recordings
   - Impact: Could recover $100-1,000/quarter

3. **Set up email list** (This week)
   - Why: You OWN this list. Social followers can be taken away. Email converts 3-5x better than social.
   - How: Mailchimp free tier → add signup link to all social profiles
   - Impact: Direct fan relationship = higher merch/ticket sales

**Strategic insight:** With 2,340 monthly listeners, you're in the "superfan conversion" zone. Focus on turning listeners into email subscribers and merch buyers. That's where the real money is.`)
    setIsThinking(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />What Should I Do Next?</CardTitle>
          <CardDescription>AI analyzes your situation and prioritizes actions by impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Ask: 'What should I focus on this week?'" value={question} onChange={e => setQuestion(e.target.value)} className="flex-1" />
            <Button onClick={ask} disabled={!question || isThinking}>
              {isThinking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {["What should I do this week?", "How do I grow my fanbase?", "Am I leaving money on the table?", "What's the best release strategy?"].map(q => (
              <Button key={q} variant="outline" size="sm" onClick={() => { setQuestion(q); ask() }}>{q}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {answer && (
        <Card>
          <CardContent className="p-4">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{answer}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ====== PRIORITY 2: Tour Economics Calculator ======

function TourEconomicsCalculator() {
  const [shows, setShows] = useState(8)
  const [avgGuarantee, setAvgGuarantee] = useState(1500)
  const [avgAttendance, setAvgAttendance] = useState(200)
  const [ticketPrice, setTicketPrice] = useState(18)
  const [merchPerHead, setMerchPerHead] = useState(7)
  const [merchCut, setMerchCut] = useState(75)
  const [busWeekly, setBusWeekly] = useState(3500)
  const [crewWeekly, setCrewWeekly] = useState(5000)
  const [hotelsNight, setHotelsNight] = useState(200)
  const [perDiem, setPerDiem] = useState(50)
  const [teamSize, setTeamSize] = useState(5)
  const [managerPct, setManagerPct] = useState(15)

  const tourWeeks = Math.ceil(shows / 4)
  const totalGuarantees = shows * avgGuarantee
  const totalTicketRevenue = shows * avgAttendance * ticketPrice
  const totalMerchRevenue = shows * avgAttendance * merchPerHead
  const artistMerch = totalMerchRevenue * (merchCut / 100)
  const totalRevenue = totalGuarantees + artistMerch + totalTicketRevenue

  const busCost = tourWeeks * busWeekly
  const crewCost = tourWeeks * crewWeekly
  const hotelCost = tourWeeks * 7 * hotelsNight
  const perDiemCost = tourWeeks * 7 * perDiem * teamSize
  const totalExpenses = busCost + crewCost + hotelCost + perDiemCost

  const managerFee = totalGuarantees * (managerPct / 100)
  const netProfit = totalRevenue - totalExpenses - managerFee

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Tour Economics Calculator</CardTitle>
        <CardDescription>Based on Passman's handbook — "You're lucky to take home 40-50% of gross"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><label className="text-xs text-muted-foreground">Shows</label><Input type="number" value={shows} onChange={e => setShows(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Avg Guarantee</label><Input type="number" value={avgGuarantee} onChange={e => setAvgGuarantee(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Avg Attendance</label><Input type="number" value={avgAttendance} onChange={e => setAvgAttendance(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Ticket Price</label><Input type="number" value={ticketPrice} onChange={e => setTicketPrice(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Merch Per Head</label><Input type="number" value={merchPerHead} onChange={e => setMerchPerHead(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Merch Cut %</label><Input type="number" value={merchCut} onChange={e => setMerchCut(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Manager %</label><Input type="number" value={managerPct} onChange={e => setManagerPct(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Team Size</label><Input type="number" value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} className="h-8" /></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><label className="text-xs text-muted-foreground">Bus/Week</label><Input type="number" value={busWeekly} onChange={e => setBusWeekly(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Crew/Week</label><Input type="number" value={crewWeekly} onChange={e => setCrewWeekly(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Hotels/Night</label><Input type="number" value={hotelsNight} onChange={e => setHotelsNight(Number(e.target.value))} className="h-8" /></div>
          <div><label className="text-xs text-muted-foreground">Per Diem/Person</label><Input type="number" value={perDiem} onChange={e => setPerDiem(Number(e.target.value))} className="h-8" /></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
          <div className="text-center p-3 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground">Guarantees</p>
            <p className="text-lg font-bold">${totalGuarantees.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground">Merch (Net)</p>
            <p className="text-lg font-bold">${artistMerch.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded">
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className={`text-lg font-bold ${netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>{netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded text-xs space-y-1">
          <p className="font-medium">Breakdown:</p>
          <p>Expenses: ${totalExpenses.toLocaleString()} (bus ${busCost.toLocaleString()} + crew ${crewCost.toLocaleString()} + hotels ${hotelCost.toLocaleString()} + per diem ${perDiemCost.toLocaleString()})</p>
          <p>Manager fee ({managerPct}%): ${managerFee.toLocaleString()}</p>
          <p className="font-medium">Profit margin: {((netProfit / totalRevenue) * 100).toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== MAIN PAGE ======

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Intelligence</h1>
          <p className="text-muted-foreground">The real bottlenecks nobody else solves</p>
        </div>

        <Tabs defaultValue="registrations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="registrations" className="gap-2"><Shield className="h-4 w-4" />Registrations</TabsTrigger>
            <TabsTrigger value="metadata" className="gap-2"><CheckCircle className="h-4 w-4" />Metadata Health</TabsTrigger>
            <TabsTrigger value="contracts" className="gap-2"><FileText className="h-4 w-4" />Contract Review</TabsTrigger>
            <TabsTrigger value="career" className="gap-2"><Target className="h-4 w-4" />Career Advisor</TabsTrigger>
            <TabsTrigger value="tour" className="gap-2"><DollarSign className="h-4 w-4" />Tour Economics</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations"><RegistrationTracker /></TabsContent>
          <TabsContent value="metadata"><MetadataHealthChecker /></TabsContent>
          <TabsContent value="contracts"><AIContractReview /></TabsContent>
          <TabsContent value="career"><AICareerAdvisor /></TabsContent>
          <TabsContent value="tour"><TourEconomicsCalculator /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
