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
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Receipt,
  Building2,
  Download,
  Search
} from "lucide-react"

type IncomeCategory = "streaming" | "sync" | "live" | "merch" | "publishing" | "session" | "teaching" | "other"
type ExpenseCategory = "equipment" | "travel" | "studio" | "marketing" | "legal" | "insurance" | "home_office" | "education" | "other"

interface IncomeEntry {
  id: string
  date: string
  description: string
  category: IncomeCategory
  amount: number
  source: string
  taxYear: number
  reported: boolean
}

interface ExpenseEntry {
  id: string
  date: string
  description: string
  category: ExpenseCategory
  amount: number
  vendor: string
  deductible: boolean
  receipt: boolean
  taxYear: number
}

const categoryColors: Record<IncomeCategory, string> = {
  streaming: "bg-blue-500/10 text-blue-500",
  sync: "bg-purple-500/10 text-purple-500",
  live: "bg-green-500/10 text-green-500",
  merch: "bg-orange-500/10 text-orange-500",
  publishing: "bg-yellow-500/10 text-yellow-500",
  session: "bg-teal-500/10 text-teal-500",
  teaching: "bg-indigo-500/10 text-indigo-500",
  other: "bg-gray-500/10 text-gray-500",
}

const expenseCategoryColors: Record<ExpenseCategory, string> = {
  equipment: "bg-blue-500/10 text-blue-500",
  travel: "bg-green-500/10 text-green-500",
  studio: "bg-purple-500/10 text-purple-500",
  marketing: "bg-orange-500/10 text-orange-500",
  legal: "bg-red-500/10 text-red-500",
  insurance: "bg-yellow-500/10 text-yellow-500",
  home_office: "bg-teal-500/10 text-teal-500",
  education: "bg-indigo-500/10 text-indigo-500",
  other: "bg-gray-500/10 text-gray-500",
}

const mockIncome: IncomeEntry[] = [
  { id: "1", date: "2026-06-01", description: "Spotify streams - May", category: "streaming", amount: 892, source: "DistroKid", taxYear: 2026, reported: false },
  { id: "2", date: "2026-06-01", description: "Apple Music streams - May", category: "streaming", amount: 445, source: "DistroKid", taxYear: 2026, reported: false },
  { id: "3", date: "2026-05-20", description: "Sync placement - Netflix ad", category: "sync", amount: 3500, source: "Publisher", taxYear: 2026, reported: true },
  { id: "4", date: "2026-06-10", description: "Live show @ Blue Note", category: "live", amount: 1200, source: "Direct", taxYear: 2026, reported: false },
  { id: "5", date: "2026-06-15", description: "T-shirt sales - Online store", category: "merch", amount: 680, source: "Shopify", taxYear: 2026, reported: false },
  { id: "6", date: "2026-06-20", description: "YouTube Content ID", category: "streaming", amount: 312, source: "YouTube", taxYear: 2026, reported: false },
  { id: "7", date: "2026-05-15", description: "Session work - Guest vocal", category: "session", amount: 750, source: "Direct", taxYear: 2026, reported: true },
  { id: "8", date: "2026-06-01", description: "Mechanical royalties - May", category: "publishing", amount: 234, source: "MLC", taxYear: 2026, reported: false },
  { id: "9", date: "2026-06-01", description: "Performance royalties - May", category: "publishing", amount: 178, source: "ASCAP", taxYear: 2026, reported: false },
]

const mockExpenses: ExpenseEntry[] = [
  { id: "1", date: "2026-06-05", description: "New microphone (Shure SM7B)", category: "equipment", amount: 399, vendor: "Sweetwater", deductible: true, receipt: true, taxYear: 2026 },
  { id: "2", date: "2026-06-08", description: "Studio time - Mixing session", category: "studio", amount: 500, vendor: "Sunset Sound", deductible: true, receipt: true, taxYear: 2026 },
  { id: "3", date: "2026-06-12", description: "Gas - Gig travel", category: "travel", amount: 85, vendor: "Shell", deductible: true, receipt: true, taxYear: 2026 },
  { id: "4", date: "2026-06-15", description: "Instagram ads - Single promotion", category: "marketing", amount: 150, vendor: "Meta", deductible: true, receipt: true, taxYear: 2026 },
  { id: "5", date: "2026-06-20", description: "Legal review - Publishing deal", category: "legal", amount: 750, vendor: "Kim & Associates", deductible: true, receipt: true, taxYear: 2026 },
  { id: "6", date: "2026-06-22", description: "Internet bill (home office %)", category: "home_office", amount: 45, vendor: "AT&T", deductible: true, receipt: true, taxYear: 2026 },
  { id: "7", date: "2026-06-25", description: "Online music production course", category: "education", amount: 199, vendor: "Skillshare", deductible: true, receipt: true, taxYear: 2026 },
]

function IncomeTab() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredIncome = mockIncome.filter(i =>
    i.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalByCategory = mockIncome.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + inc.amount
    return acc
  }, {} as Record<IncomeCategory, number>)

  const totalIncome = mockIncome.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(totalByCategory).map(([category, amount]) => (
          <Card key={category}>
            <CardContent className="p-3">
              <Badge variant="outline" className={categoryColors[category as IncomeCategory]}>
                {category}
              </Badge>
              <p className="text-xl font-bold mt-1">${amount.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search income..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Add Income</Button>
      </div>

      <div className="grid gap-3">
        {filteredIncome.map((inc) => (
          <Card key={inc.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={categoryColors[inc.category]}>{inc.category}</Badge>
                  <div>
                    <p className="font-medium">{inc.description}</p>
                    <p className="text-sm text-muted-foreground">{inc.source} • {new Date(inc.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">${inc.amount.toLocaleString()}</span>
                  {inc.reported ? (
                    <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Reported</Badge>
                  ) : (
                    <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Unreported</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Income (2026)</span>
            <span className="text-2xl font-bold">${totalIncome.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ExpensesTab() {
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  const deductibleExpenses = mockExpenses.filter(e => e.deductible).reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tax Deductible</p>
            <p className="text-2xl font-bold text-green-500">${deductibleExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3">
        {mockExpenses.map((exp) => (
          <Card key={exp.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={expenseCategoryColors[exp.category]}>{exp.category}</Badge>
                  <div>
                    <p className="font-medium">{exp.description}</p>
                    <p className="text-sm text-muted-foreground">{exp.vendor} • {new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">-${exp.amount.toLocaleString()}</span>
                  {exp.deductible && <Badge variant="outline" className="text-green-500">Deductible</Badge>}
                  {exp.receipt && <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Receipt</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SummaryTab() {
  const totalIncome = mockIncome.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = totalIncome - totalExpenses
  const selfEmploymentTax = Math.round(netProfit * 0.9235 * 0.153)
  const estimatedTax = Math.round(netProfit * 0.22)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Gross Income</p>
            <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Business Expenses</p>
            <p className="text-2xl font-bold text-red-500">-${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Net Profit (Schedule C)</p>
            <p className="text-2xl font-bold">${netProfit.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Est. Self-Employment Tax</p>
            <p className="text-2xl font-bold text-orange-500">${selfEmploymentTax.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Filing Guide for Musicians</CardTitle>
          <CardDescription>Based on Exploration.io handbook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Schedule C (Form 1040)</p>
            <p className="text-muted-foreground">Report income and expenses from your music business as a self-employed individual. This is your main tax form.</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium">1099-MISC / 1099-NEC</p>
            <p className="text-muted-foreground">Every entity that pays you royalties or for services should send you a 1099. Collect these from your label, publisher, PRO, and any client paying $600+.</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Quarterly Estimated Taxes</p>
            <p className="text-muted-foreground">As self-employed, you must pay estimated taxes quarterly (April 15, June 15, Sept 15, Jan 15). Use Form 1040-ES.</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Home Office Deduction</p>
            <p className="text-muted-foreground">If you have a dedicated space for music business, you can deduct a portion of rent, utilities, and internet. Use Form 8829 or simplified method ($5/sqft, max 300sqft).</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Common Deductions for Musicians</p>
            <p className="text-muted-foreground">Equipment, studio time, travel to gigs, marketing, legal fees, insurance, instrument repairs, online services (DistroKid, etc), and professional development.</p>
          </div>
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

export default function TaxPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tax Report</h1>
            <p className="text-muted-foreground">Track income, expenses, and prepare for tax filing</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
        </div>

        <Tabs defaultValue="income" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <Receipt className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <Calculator className="h-4 w-4" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income"><IncomeTab /></TabsContent>
          <TabsContent value="expenses"><ExpensesTab /></TabsContent>
          <TabsContent value="summary"><SummaryTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
