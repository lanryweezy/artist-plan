"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  DollarSign,
  Users,
  Music,
  Globe,
  CheckCircle,
  Calendar,
  Table
} from "lucide-react"

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ElementType
  format: string
  category: string
}

const exportOptions: ExportOption[] = [
  { id: "tax-income", name: "Tax Income Report", description: "All income by category for Schedule C filing", icon: DollarSign, format: "CSV", category: "Tax" },
  { id: "tax-expenses", name: "Tax Expenses Report", description: "All deductible expenses with receipt status", icon: DollarSign, format: "CSV", category: "Tax" },
  { id: "tax-summary", name: "Tax Summary", description: "Net profit, SE tax, estimated payments due", icon: FileText, format: "PDF", category: "Tax" },
  { id: "contacts", name: "Contact List", description: "All team contacts with roles and info", icon: Users, format: "CSV", category: "Contacts" },
  { id: "songs", name: "Song Catalog", description: "All songs with ISRC, ISWC, IPI, splits", icon: Music, format: "CSV", category: "Publishing" },
  { id: "splits", name: "Split Sheets", description: "Writer/publisher splits for all songs", icon: Users, format: "CSV", category: "Publishing" },
  { id: "royalties", name: "Royalty Summary", description: "All royalty streams by source and period", icon: DollarSign, format: "CSV", category: "Royalties" },
  { id: "registrations", name: "Registration Status", description: "Status with all 13 collection agencies", icon: Globe, format: "CSV", category: "Rights" },
  { id: "tour-budget", name: "Tour Budget", description: "Expenses and revenue for upcoming tours", icon: DollarSign, format: "CSV", category: "Tours" },
  { id: "grants", name: "Grant Tracker", description: "All grant applications and deadlines", icon: FileText, format: "CSV", category: "Grants" },
  { id: "releases", name: "Release Timeline", description: "All releases with tasks and status", icon: Calendar, format: "CSV", category: "Releases" },
  { id: "metadata", name: "Metadata Health", description: "ISRC/ISWC/IPI status for all songs", icon: CheckCircle, format: "CSV", category: "Metadata" },
]

const generateCSV = (headers: string[], rows: string[][]): string => {
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n")
  return csvContent
}

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ExportTab() {
  const [lastExport, setLastExport] = useState<string | null>(null)

  const handleExport = (option: ExportOption) => {
    let content = ""
    let filename = ""
    const date = new Date().toISOString().split("T")[0]

    switch (option.id) {
      case "tax-income":
        content = generateCSV(
          ["Date", "Description", "Category", "Amount", "Source", "Reported"],
          [
            ["2026-06-01", "Spotify streams - May", "streaming", "892", "DistroKid", "No"],
            ["2026-06-01", "Apple Music streams - May", "streaming", "445", "DistroKid", "No"],
            ["2026-05-20", "Sync placement - Netflix ad", "sync", "3500", "Publisher", "Yes"],
            ["2026-06-10", "Live show @ Blue Note", "live", "1200", "Direct", "No"],
            ["2026-06-15", "T-shirt sales", "merch", "680", "Shopify", "No"],
            ["2026-06-20", "YouTube Content ID", "streaming", "312", "YouTube", "No"],
            ["2026-05-15", "Session work", "session", "750", "Direct", "Yes"],
            ["2026-06-01", "Mechanical royalties", "publishing", "234", "MLC", "No"],
            ["2026-06-01", "Performance royalties", "publishing", "178", "ASCAP", "No"],
          ]
        )
        filename = `artist-plan-income-${date}.csv`
        break
      case "tax-expenses":
        content = generateCSV(
          ["Date", "Description", "Category", "Amount", "Vendor", "Deductible", "Receipt"],
          [
            ["2026-06-05", "New microphone (Shure SM7B)", "equipment", "399", "Sweetwater", "Yes", "Yes"],
            ["2026-06-08", "Studio time", "studio", "500", "Sunset Sound", "Yes", "Yes"],
            ["2026-06-12", "Gas - Gig travel", "travel", "85", "Shell", "Yes", "Yes"],
            ["2026-06-15", "Instagram ads", "marketing", "150", "Meta", "Yes", "Yes"],
            ["2026-06-20", "Legal review", "legal", "750", "Kim & Associates", "Yes", "Yes"],
          ]
        )
        filename = `artist-plan-expenses-${date}.csv`
        break
      case "contacts":
        content = generateCSV(
          ["Name", "Company", "Role", "Email", "Phone", "Rating", "Active Deals"],
          [
            ["Marcus Johnson", "MJ Management", "manager", "marcus@mjmgmt.com", "+1 310-555-0123", "5", "2"],
            ["Sarah Chen", "Paradigm Agency", "agent", "schen@paradigm.com", "+1 212-555-0456", "4", "1"],
            ["David Kim", "Kim & Associates", "lawyer", "dkim@kimlaw.com", "", "5", "0"],
          ]
        )
        filename = `artist-plan-contacts-${date}.csv`
        break
      case "songs":
        content = generateCSV(
          ["Title", "ISWC", "Writers", "Writer Splits", "Publishers", "Publisher Splits", "Status", "Territory"],
          [
            ["Midnight Dreams", "T-345.678.432-1", "Alex Rivera (60%), Jordan Chen (40%)", "100%", "Alex Rivera Music (60%), Warner Chappell (40%)", "100%", "Registered", "Worldwide"],
            ["Electric Sunset", "T-789.123.456-7", "Alex Rivera (100%)", "100%", "Alex Rivera Music (100%)", "100%", "Registered", "Worldwide"],
          ]
        )
        filename = `artist-plan-songs-${date}.csv`
        break
      case "registrations":
        content = generateCSV(
          ["Agency", "Type", "Status", "Required", "What It Collects"],
          [
            ["ASCAP", "PRO", "Not Started", "Yes", "Performance royalties"],
            ["BMI", "PRO", "Not Started", "Yes", "Performance royalties"],
            ["MLC", "Mechanical", "Not Started", "Yes", "Streaming mechanicals"],
            ["HFA", "Mechanical", "Not Started", "Yes", "Physical mechanicals"],
            ["SoundExchange", "Sound Recording", "Not Started", "Yes", "Non-interactive digital"],
            ["YouTube CMS", "Both", "Not Started", "Yes", "Content ID monetization"],
          ]
        )
        filename = `artist-plan-registrations-${date}.csv`
        break
      default:
        content = generateCSV(
          ["Item", "Status", "Notes"],
          [
            ["Export generated", "Complete", `Generated on ${date}`],
          ]
        )
        filename = `artist-plan-export-${date}.csv`
    }

    downloadFile(content, filename, "text/csv")
    setLastExport(option.id)
    setTimeout(() => setLastExport(null), 3000)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Export your data for tax filing, accounting, or record-keeping. All exports are CSV format for easy import into Excel, Google Sheets, or accounting software.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exportOptions.map(option => {
          const Icon = option.icon
          return (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium text-sm">{option.name}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{option.format}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{option.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{option.category}</Badge>
                  <Button
                    size="sm"
                    variant={lastExport === option.id ? "default" : "outline"}
                    onClick={() => handleExport(option)}
                  >
                    {lastExport === option.id ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Exported</>
                    ) : (
                      <><Download className="h-3 w-3 mr-1" /> Export</>
                    )}
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

function TemplatesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Pre-built templates for common music business needs.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Schedule C Template</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground">Ready-to-use template for self-employment tax filing. Includes all common musician deductions.</p>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3 mr-1" />
              Download Template
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Split Sheet Template</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground">Standard split sheet for co-writing sessions. Captures writer names, splits, and IPI numbers.</p>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3 mr-1" />
              Download Template
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tour Budget Template</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground">Pre-filled expense categories based on industry standards from Passman's handbook.</p>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3 mr-1" />
              Download Template
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Grant Proposal Template</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground">Structure for music-related grant applications based on Roya Hu's methodology.</p>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3 mr-1" />
              Download Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ExportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Export</h1>
          <p className="text-muted-foreground">Export your data and download templates</p>
        </div>

        <Tabs defaultValue="export" className="space-y-4">
          <TabsList>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export"><ExportTab /></TabsContent>
          <TabsContent value="templates"><TemplatesTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
