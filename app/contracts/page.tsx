"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Shield,
  Search,
  Plus,
  Upload,
  Scale,
  Clock,
  DollarSign,
  Eye,
  Zap
} from "lucide-react"

type RiskLevel = "danger" | "warning" | "info" | "safe"
type ClauseCategory = "ownership" | "royalty" | "term" | "territory" | "creative" | "financial" | "termination" | "other"

interface RedFlag {
  id: string
  clause: string
  category: ClauseCategory
  risk: RiskLevel
  explanation: string
  whatToAsk: string
  source: string
}

interface ContractTemplate {
  id: string
  name: string
  type: string
  clauses: string[]
}

const redFlagsDatabase: RedFlag[] = [
  // Ownership
  {
    id: "rf1",
    clause: "Work for Hire",
    category: "ownership",
    risk: "danger",
    explanation: "Publisher owns 100% of your songs. You get a one-time fee. No termination rights. No future royalties.",
    whatToAsk: "Is this truly work-for-hire? Can you negotiate to admin deal instead (10-25% fee, you keep ownership)?",
    source: "Passman Ch. 19 — Work-for-hire has no termination rights"
  },
  {
    id: "rf2",
    clause: "All rights in perpetuity",
    category: "ownership",
    risk: "danger",
    explanation: "You permanently transfer all copyrights to the other party. You can never get them back.",
    whatToAsk: "Negotiate for a license instead of assignment. Or include reversion clauses after a term.",
    source: "Passman Ch. 19 — Copyright ownership transfer"
  },
  {
    id: "rf3",
    clause: "Name and likeness rights",
    category: "ownership",
    risk: "warning",
    explanation: "Company can use your name, image, and likeness for marketing purposes, sometimes indefinitely.",
    whatToAsk: "Limit the scope and duration. Ensure approval rights over specific uses.",
    source: "Passman Ch. 13 — Merchandising rights"
  },
  {
    id: "rf4",
    clause: "Controlled composition clause",
    category: "ownership",
    risk: "danger",
    explanation: "Label pays BELOW statutory mechanical rate (often 75% or less) on songs you co-wrote. Limits your publishing income.",
    whatToAsk: "Negotiate for statutory rate (100%). Cap the number of songs affected. Remove for digital downloads (post-1995 contracts).",
    source: "Passman Ch. 10 — Controlled compositions"
  },
  // Royalty
  {
    id: "rf5",
    clause: "15% of PPD royalty rate",
    category: "royalty",
    risk: "warning",
    explanation: "New artist royalty rates typically 13-16% of wholesale (PPD). Established artists get 18-20%+.",
    whatToAsk: "Negotiate for higher rate. Ensure no deductions for packaging, breakage, or coop on digital.",
    source: "Passman Ch. 9 — Royalty computation"
  },
  {
    id: "rf6",
    clause: "Deductions for packaging/breakage/coop",
    category: "royalty",
    risk: "warning",
    explanation: "Labels historically deducted fees for physical packaging (25%), breakage (3%), and coop advertising. These shouldn't apply to digital.",
    whatToAsk: "Ensure no packaging deductions on digital sales. Breakage deductions should be eliminated. Coop should be optional.",
    source: "Passman Ch. 9 — Royalty deductions"
  },
  {
    id: "rf7",
    clause: "Reserves against returns",
    category: "royalty",
    risk: "warning",
    explanation: "Label withholds a percentage of royalties as 'reserve' against unsold physical product that might be returned.",
    whatToAsk: "Reserves should only apply to physical, not digital. Cap reserves at 15-20%. Get accountings regularly.",
    source: "Passman Ch. 9 — Reserves"
  },
  {
    id: "rf8",
    clause: "100% recoupment of all costs",
    category: "royalty",
    risk: "danger",
    explanation: "ALL costs (recording, marketing, tour support, video, even A&R meals) recouped from YOUR royalties before you see a dime.",
    whatToAsk: "Negotiate what costs are recoupable. Cap recoupable expenses. Exclude personal expenses.",
    source: "Passman Ch. 8 — Advances and recoupment"
  },
  // Term
  {
    id: "rf9",
    clause: "Option period with no guaranteed release",
    category: "term",
    risk: "danger",
    explanation: "Label has options to extend your contract but doesn't have to release your music. You're stuck with no income.",
    whatToAsk: "Add guaranteed release clause. If they don't release within X months, you're free.",
    source: "Passman Ch. 10 — Guaranteed release"
  },
  {
    id: "rf10",
    clause: "Album cycle term (e.g., 5 albums)",
    category: "term",
    risk: "warning",
    explanation: "Contract lasts until you deliver a certain number of albums. If albums become obsolete, you may never finish.",
    whatToAsk: "Add time cap (e.g., 7 years maximum). Include sunset provisions. Clarify what counts as an 'album'.",
    source: "Passman Ch. 10 — How long?"
  },
  {
    id: "rf11",
    clause: "Suspension clause",
    category: "term",
    risk: "warning",
    explanation: "Label can pause your contract if you're 'not commercially satisfactory', extending the term indefinitely.",
    whatToAsk: "Limit suspension periods. Define 'commercially satisfactory' clearly. Add maximum suspension duration.",
    source: "Passman Ch. 10 — Commercially satisfactory"
  },
  // Territory
  {
    id: "rf12",
    clause: "Worldwide territory",
    category: "territory",
    risk: "warning",
    explanation: "Label controls your music globally. They may not have the infrastructure to properly exploit in all territories.",
    whatToAsk: "Negotiate territory-by-territory deals. Retain rights in territories where label has no presence.",
    source: "Passman Ch. 13 — Territory"
  },
  // Creative
  {
    id: "rf13",
    clause: "Label approval over masters",
    category: "creative",
    risk: "warning",
    explanation: "Label must approve your recording choices — producer, songs, artwork, etc.",
    whatToAsk: "Negotiate for 'first two albums' approval only. After that, you should have final say.",
    source: "Passman Ch. 13 — Creative controls"
  },
  {
    id: "rf14",
    clause: "360 deal provisions",
    category: "financial",
    risk: "danger",
    explanation: "Label takes a cut of ALL revenue — touring, merch, endorsements, publishing, even meet-and-greets.",
    whatToAsk: "Negotiate caps on each revenue stream. Ensure label provides real value for each revenue share.",
    source: "Passman Ch. 9 — 360 rights"
  },
  {
    id: "rf15",
    clause: "Cross-collateralization",
    category: "financial",
    risk: "danger",
    explanation: "Advances from multiple albums are pooled. You must recoup ALL advances before earning royalties on ANY album.",
    whatToAsk: "Fight for separate accounting per album. Cross-collateralization is the label's risk, not yours.",
    source: "Passman Ch. 8 — Cross-collateralization"
  },
  // Termination
  {
    id: "rf16",
    clause: "No termination rights",
    category: "termination",
    risk: "danger",
    explanation: "You cannot end the contract under any circumstances. Even if the label does nothing with your music.",
    whatToAsk: "Add termination for cause (label breach). Add sunset clause after term ends. Include out clause for non-release.",
    source: "Passman Ch. 10 — Termination"
  },
  {
    id: "rf17",
    clause: "Label retains masters after termination",
    category: "termination",
    risk: "danger",
    explanation: "Even if you leave, the label keeps your recordings forever (or for decades).",
    whatToAsk: "Negotiate reversion of masters after term + X years. Include termination reversion clause.",
    source: "Passman Ch. 19 — Right of termination (35 years)"
  },
  {
    id: "rf18",
    clause: "Payback of unrecouped advances",
    category: "financial",
    risk: "warning",
    explanation: "If you leave before recouping, you may owe the label the unrecouped balance.",
    whatToAsk: "Standard practice — but negotiate what happens to masters. You shouldn't pay back if label keeps your recordings.",
    source: "Passman Ch. 8 — Advance repayment"
  },
]

const categoryLabels: Record<ClauseCategory, string> = {
  ownership: "Copyright Ownership",
  royalty: "Royalty Terms",
  term: "Contract Term",
  territory: "Territory",
  creative: "Creative Control",
  financial: "Financial Terms",
  termination: "Termination",
  other: "Other",
}

const riskColors: Record<RiskLevel, string> = {
  danger: "bg-red-500/10 text-red-500 border-red-500/30",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  safe: "bg-green-500/10 text-green-500 border-green-500/30",
}

const riskIcons: Record<RiskLevel, React.ElementType> = {
  danger: XCircle,
  warning: AlertTriangle,
  info: AlertTriangle,
  safe: CheckCircle,
}

function ReviewTab() {
  const [contractText, setContractText] = useState("")
  const [analysisResults, setAnalysisResults] = useState<RedFlag[]>([])
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const analyzeContract = () => {
    const found: RedFlag[] = []
    const textLower = contractText.toLowerCase()

    redFlagsDatabase.forEach(flag => {
      const searchTerms = flag.clause.toLowerCase().split(" ").filter(w => w.length > 3)
      const matches = searchTerms.filter(term => textLower.includes(term))
      if (matches.length >= 2 || textLower.includes(flag.clause.toLowerCase())) {
        found.push(flag)
      }
    })

    if (found.length === 0 && contractText.length > 50) {
      found.push({
        id: "safe1",
        clause: "No obvious red flags detected",
        category: "other",
        risk: "safe",
        explanation: "The AI didn't detect any of the common problematic clauses. However, always have an entertainment attorney review any contract before signing.",
        whatToAsk: "Still consult an attorney. Some clauses may be hidden in legal language.",
        source: "General best practice"
      })
    }

    setAnalysisResults(found)
    setHasAnalyzed(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Contract Review
          </CardTitle>
          <CardDescription>Paste your contract terms and get instant red flag analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Paste your contract terms here. Include key clauses like:\n\n- Royalty rates\n- Term/duration\n- Territory\n- Ownership/copyright transfer\n- Recoupment terms\n- Controlled composition\n- Work for hire language\n- 360 deal provisions\n- Termination rights\n\nThe more text you paste, the better the analysis.`}
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {contractText.length > 0 ? `${contractText.length} characters` : "Paste your contract to begin analysis"}
            </p>
            <Button onClick={analyzeContract} disabled={contractText.length < 50}>
              <Zap className="h-4 w-4 mr-2" />
              Analyze Contract
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Analysis Results ({analysisResults.length} item{analysisResults.length !== 1 ? "s" : ""})
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                {analysisResults.filter(r => r.risk === "danger").length} Danger
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                {analysisResults.filter(r => r.risk === "warning").length} Warning
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                {analysisResults.filter(r => r.risk === "safe").length} Safe
              </Badge>
            </div>
          </div>

          {analysisResults.map((result) => {
            const RiskIcon = riskIcons[result.risk]
            return (
              <Card key={result.id} className={`border ${riskColors[result.risk]}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RiskIcon className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{result.clause}</p>
                        <Badge variant="outline" className="text-xs">{categoryLabels[result.category]}</Badge>
                      </div>
                      <p className="text-sm">{result.explanation}</p>
                      <div className="p-2 bg-background/50 rounded text-sm">
                        <p className="font-medium text-xs text-muted-foreground mb-1">What to ask/ negotiate:</p>
                        <p>{result.whatToAsk}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Source: {result.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RedFlagsTab() {
  const [categoryFilter, setCategoryFilter] = useState<ClauseCategory | "all">("all")

  const filtered = categoryFilter === "all"
    ? redFlagsDatabase
    : redFlagsDatabase.filter(f => f.category === categoryFilter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "ownership", "royalty", "term", "financial", "termination", "creative"] as const).map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
            className="capitalize"
          >
            {cat === "all" ? "All" : categoryLabels[cat]}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((flag) => {
          const RiskIcon = riskIcons[flag.risk]
          return (
            <Card key={flag.id} className={`border ${riskColors[flag.risk]}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RiskIcon className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{flag.clause}</p>
                      <Badge variant="outline" className="text-xs">{categoryLabels[flag.category]}</Badge>
                      <Badge variant="outline" className={`text-xs ${riskColors[flag.risk]}`}>
                        {flag.risk}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{flag.explanation}</p>
                    <div className="p-2 bg-background/50 rounded text-sm">
                      <p className="font-medium text-xs text-muted-foreground mb-1">Negotiate:</p>
                      <p>{flag.whatToAsk}</p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">{flag.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function TemplatesTab() {
  const templates = [
    {
      name: "Key Questions Before Signing",
      questions: [
        "Who owns the copyright after this deal? (License vs. Assignment)",
        "What is my royalty rate and how is it calculated?",
        "What costs are recoupable from my royalties?",
        "Is there a controlled composition clause?",
        "What is the term and how many options does the other party have?",
        "Is there a guaranteed release clause?",
        "What territory does this cover?",
        "What happens if I want to leave? (Termination rights)",
        "Do they take a cut of my touring/merch/endorsements? (360)",
        "Is there cross-collateralization between albums?",
        "What happens to my masters after the term?",
        "Do I keep my publishing or is it included?",
      ]
    },
    {
      name: "US vs UK Differences (Passman)",
      differences: [
        "UK managers typically get paid on NET (after expenses), US on GROSS",
        "UK lawyers (solicitors) rarely shop music to labels — managers do",
        "UK business managers are less common — specialist accountants used instead",
        "UK has split management (UK + US managers) — less common now",
        "UK recording contracts often have different reserve and deduction structures",
      ]
    },
    {
      name: "Publishing Deal Comparison",
      deals: [
        "Admin: You keep 100% ownership, publisher takes 10-25% fee. BEST for indies.",
        "Co-Publishing: You get 50% writer + 25% publisher (75% total). Good leverage deal.",
        "Exclusive Songwriting: You commit X songs/year, all copyrights transfer. Traditional.",
        "Work for Hire: Publisher owns 100%. One-time fee. No termination rights. AVOID.",
        "Individual Song: You sell existing songs. Can be for one song or whole catalog.",
      ]
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.name}>
          <CardHeader>
            <CardTitle className="text-base">{template.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(template.questions || template.differences || template.deals).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Review contracts, identify red flags, and negotiate better deals</p>
        </div>

        <Tabs defaultValue="review" className="space-y-4">
          <TabsList>
            <TabsTrigger value="review" className="gap-2">
              <Zap className="h-4 w-4" />
              AI Review
            </TabsTrigger>
            <TabsTrigger value="redflags" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Red Flag Database
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review"><ReviewTab /></TabsContent>
          <TabsContent value="redflags"><RedFlagsTab /></TabsContent>
          <TabsContent value="templates"><TemplatesTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
