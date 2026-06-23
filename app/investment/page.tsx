"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Target,
  PieChart,
  BarChart3,
  Shield,
  Lightbulb
} from "lucide-react"

type InvestmentType = "royalty_purchase" | "future_royalties" | "crowdfunding" | "angel" | "label_advance" | "grant"

interface Investment {
  id: string
  name: string
  type: InvestmentType
  amount: number
  date: string
  status: "active" | "completed" | "pending" | "negotiating"
  terms?: string
  return?: string
  notes?: string
}

const typeLabels: Record<InvestmentType, string> = {
  royalty_purchase: "Royalty Purchase",
  future_royalties: "Future Royalty Advance",
  crowdfunding: "Crowdfunding",
  angel: "Angel Investment",
  label_advance: "Label Advance",
  grant: "Grant Funding",
}

const typeColors: Record<InvestmentType, string> = {
  royalty_purchase: "bg-blue-500/10 text-blue-500",
  future_royalties: "bg-purple-500/10 text-purple-500",
  crowdfunding: "bg-green-500/10 text-green-500",
  angel: "bg-orange-500/10 text-orange-500",
  label_advance: "bg-red-500/10 text-red-500",
  grant: "bg-teal-500/10 text-teal-500",
}

const mockInvestments: Investment[] = [
  { id: "1", name: "Royalty Exchange - Midnight Dreams", type: "royalty_purchase", amount: 15000, date: "2026-03-15", status: "completed", terms: "Sold 25% of mechanical royalties for 5 years", return: "$625/month avg", notes: "Investor: Music Fund LLC" },
  { id: "2", name: "Kickstarter - Album Fund", type: "crowdfunding", amount: 8500, date: "2026-01-20", status: "completed", terms: "45 backers, fulfilled all rewards", notes: "Goal was $5,000, exceeded by 70%" },
  { id: "3", name: "Local Business Sponsorship", type: "angel", amount: 2000, date: "2026-05-10", status: "completed", terms: "Logo on merch, social media posts", notes: "Coffee shop downtown" },
  { id: "4", name: "Future Royalty Advance - Tour", type: "future_royalties", amount: 5000, date: "2026-06-01", status: "active", terms: "Advance against 30% of touring income for 12 months", return: "10% of net touring income" },
  { id: "5", name: "NEA Grant Application", type: "grant", amount: 25000, date: "2026-06-15", status: "pending", terms: "Community music education program", notes: "Decision expected August 2026" },
]

function PortfolioTab() {
  const totalInvested = mockInvestments.filter(i => i.status === "completed").reduce((sum, i) => sum + i.amount, 0)
  const activeInvestments = mockInvestments.filter(i => i.status === "active" || i.status === "pending")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Raised</p>
            <p className="text-3xl font-bold">${totalInvested.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active/Pending</p>
            <p className="text-3xl font-bold text-blue-500">${activeInvestments.reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Deals</p>
            <p className="text-3xl font-bold">{mockInvestments.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {mockInvestments.map((inv) => (
          <Card key={inv.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={typeColors[inv.type]}>{typeLabels[inv.type]}</Badge>
                  <div>
                    <p className="font-medium">{inv.name}</p>
                    <p className="text-sm text-muted-foreground">{inv.terms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">${inv.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={
                    inv.status === "completed" ? "default" :
                    inv.status === "active" ? "secondary" :
                    inv.status === "pending" ? "outline" : "destructive"
                  }>
                    {inv.status}
                  </Badge>
                </div>
              </div>
              {inv.return && <p className="text-sm text-muted-foreground mt-2 ml-20">Return: {inv.return}</p>}
              {inv.notes && <p className="text-sm text-muted-foreground mt-1 ml-20">{inv.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function OptionsTab() {
  const options = [
    {
      title: "Royalty Purchasing (Royalty Exchange)",
      description: "Sell a portion of your existing royalties to investors for upfront capital.",
      pros: ["No payback required if music flops", "Transparent valuations", "Investors take the risk"],
      cons: ["Lose future income from that portion", "Complex contracts", "Only works for existing earnings"],
      best_for: "Established artists with proven revenue streams",
      link: "royaltyexchange.com"
    },
    {
      title: "Future Royalty Advances",
      description: "Get an advance against your future earnings (similar to label advances).",
      pros: ["No equity loss", "Based on proven track record", "Flexible terms"],
      cons: ["Must be repaid from future earnings", "Interest may apply", "Performance minimums required"],
      best_for: "Artists about to tour or release new music",
      link: "artistgrowth.com"
    },
    {
      title: "Crowdfunding (Kickstarter, Indiegogo, GoFundMe)",
      description: "Fund projects through fan contributions.",
      pros: ["No equity loss", "Builds fan engagement", "Validates demand"],
      cons: ["Requires strong fanbase", "Fulfillment obligations", "Platform fees (5-10%)"],
      best_for: "Artists with engaged communities and specific projects",
      link: "kickstarter.com"
    },
    {
      title: "Angel Investors",
      description: "Individual investors provide capital in exchange for equity or revenue share.",
      pros: ["No payback if business fails", "Investor expertise and connections", "Flexible terms"],
      cons: ["Lose partial control", "Ongoing profit sharing", "Investor involvement in decisions"],
      best_for: "Artists building music businesses beyond recordings",
      link: "angelinvestmentnetwork.com"
    },
    {
      title: "Grants (NEA, State Arts Councils, Foundations)",
      description: "Non-repayable funds for specific projects. Free money.",
      pros: ["No payback required", "Credibility boost", "Networking opportunities"],
      cons: ["Intense application process", "Specific usage requirements", "Reporting obligations", "Highly competitive"],
      best_for: "Artists with community-focused or educational projects",
      link: "grants.gov"
    },
    {
      title: "Label Advances",
      description: "Traditional advance from a record label against future royalties.",
      pros: ["Large upfront capital", "Label infrastructure", "Marketing support"],
      cons: ["Recoupable (must pay back)", "Loss of master ownership", "Long-term commitment", "Controlled composition clauses"],
      best_for: "Artists seeking major distribution and marketing",
      link: ""
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option) => (
        <Card key={option.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{option.title}</CardTitle>
            <CardDescription>{option.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-green-500 mb-1">PROS</p>
              <ul className="text-sm space-y-1">
                {option.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <CheckCircle className="h-3 w-3 mt-1 text-green-500 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-red-500 mb-1">CONS</p>
              <ul className="text-sm space-y-1">
                {option.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <AlertCircle className="h-3 w-3 mt-1 text-red-500 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">Best for: <span className="font-medium">{option.best_for}</span></p>
            </div>
            {option.link && (
              <Button size="sm" variant="outline" asChild>
                <a href={`https://${option.link}`} target="_blank" rel="noopener noreferrer">
                  Learn More <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function GuideTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Hipgnosis Songs Fund — Case Study
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Hipgnosis Songs Fund, founded by Merck Mercuriadis, IPO'd in 2018 raising over $1 billion. They acquire songs and manage playlist, cover, and sync revenues.</p>
          <p><strong>Key insight:</strong> Hit songs are long-term predictable assets unaffected by economic cycles. They grow in value as the global music market expands.</p>
          <p>They now own tens of thousands of songs and joined the FTSE 250 Index on the London Stock Exchange.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Considerations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Due diligence:</strong> Understand exactly what you're giving up before signing</p>
          <p>• <strong>Legal review:</strong> Always have an entertainment attorney review investment deals</p>
          <p>• <strong>Valuation:</strong> Know what your royalties are worth — use Royalty Exchange data</p>
          <p>• <strong>Tax implications:</strong> Royalty sales may have different tax treatment than regular income</p>
          <p>• <strong>Exit terms:</strong> Understand buyback options and time limitations</p>
          <p>• <strong>Recoupment:</strong> Know when and how you'll pay back advances</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            When to Seek Investment
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• You have proven revenue streams (streaming, sync, touring)</p>
          <p>• You need capital for a specific project with clear ROI</p>
          <p>• You've exhausted personal savings and fan funding</p>
          <p>• You're ready to scale your career to the next level</p>
          <p>• You understand the trade-offs and have legal representation</p>
        </CardContent>
      </Card>
    </div>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function InvestmentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Investment</h1>
            <p className="text-muted-foreground">Track funding, explore investment options, and manage deals</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Deal</Button>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolio" className="gap-2">
              <PieChart className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="options" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Investment Options
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio"><PortfolioTab /></TabsContent>
          <TabsContent value="options"><OptionsTab /></TabsContent>
          <TabsContent value="guide"><GuideTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
