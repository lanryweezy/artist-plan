"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scale,
  FileText,
  Shield,
  Key,
  Plus,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Music,
  Video,
  Radio,
  Printer,
  BookOpen
} from "lucide-react"

type LicenseType = "mechanical" | "sync" | "master" | "performance" | "print"
type CopyrightStatus = "registered" | "pending" | "unregistered"
type ContractStatus = "active" | "expired" | "pending" | "review"

interface CopyrightRegistration {
  id: string
  title: string
  type: "composition" | "sound_recording"
  status: CopyrightStatus
  registrationNumber?: string
  dateCreated: string
  dateRegistered?: string
  authors: string[]
  claimants: string[]
}

interface License {
  id: string
  type: LicenseType
  workTitle: string
  licensee: string
  territory: string
  startDate: string
  endDate?: string
  status: "active" | "expired" | "pending"
  royaltyRate?: string
  advance?: number
}

interface Contract {
  id: string
  title: string
  type: "record" | "publishing" | "management" | "sync" | "session" | "other"
  counterparty: string
  status: ContractStatus
  startDate: string
  endDate?: string
  territory?: string
  keyTerms?: string[]
}

interface RightsCode {
  id: string
  code: string
  type: "isrc" | "iswc" | "ipi"
  workTitle: string
  registeredTo: string
  dateAssigned: string
}

const mockCopyrights: CopyrightRegistration[] = [
  {
    id: "c1",
    title: "Midnight Dreams",
    type: "composition",
    status: "registered",
    registrationNumber: "PAu-4-234-567",
    dateCreated: "2025-11-15",
    dateRegistered: "2026-01-10",
    authors: ["Alex Rivera", "Jordan Chen"],
    claimants: ["Alex Rivera Music"]
  },
  {
    id: "c2",
    title: "Electric Sunset",
    type: "sound_recording",
    status: "pending",
    dateCreated: "2026-03-20",
    authors: ["Alex Rivera"],
    claimants: ["Alex Rivera"]
  },
  {
    id: "c3",
    title: "City Lights",
    type: "composition",
    status: "unregistered",
    dateCreated: "2026-05-01",
    authors: ["Alex Rivera", "Sam Williams"],
    claimants: ["Alex Rivera Music", "Williams Publishing"]
  }
]

const mockLicenses: License[] = [
  {
    id: "l1",
    type: "sync",
    workTitle: "Midnight Dreams",
    licensee: "Netflix Original Productions",
    territory: "Worldwide",
    startDate: "2026-02-01",
    endDate: "2031-02-01",
    status: "active",
    royaltyRate: "15% of sync fee",
    advance: 25000
  },
  {
    id: "l2",
    type: "mechanical",
    workTitle: "Electric Sunset",
    licensee: "DistroKid",
    territory: "United States",
    startDate: "2026-04-01",
    status: "active",
    royaltyRate: "$0.091/stream"
  },
  {
    id: "l3",
    type: "performance",
    workTitle: "All Works",
    licensee: "ASCAP",
    territory: "Worldwide",
    startDate: "2024-01-01",
    status: "active"
  },
  {
    id: "l4",
    type: "master",
    workTitle: "Midnight Dreams",
    licensee: "Warner Music Group",
    territory: "Europe",
    startDate: "2025-06-01",
    endDate: "2027-06-01",
    status: "active",
    royaltyRate: "18% of net receipts",
    advance: 50000
  }
]

const mockContracts: Contract[] = [
  {
    id: "ct1",
    title: "Recording Agreement",
    type: "record",
    counterparty: "Indie Records LLC",
    status: "active",
    startDate: "2025-01-15",
    endDate: "2028-01-15",
    territory: "Worldwide",
    keyTerms: ["3 album deal", "70/30 split", "25% royalty rate", "Recoupable advance: $75,000"]
  },
  {
    id: "ct2",
    title: "Publishing Administration",
    type: "publishing",
    counterparty: "Kobalt Music",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2029-06-01",
    territory: "Worldwide",
    keyTerms: ["Admin deal", "85/15 split", "Admin fee: 15%", "2-year option"]
  },
  {
    id: "ct3",
    title: "Tour Management Agreement",
    type: "management",
    counterparty: "Live Nation",
    status: "pending",
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    territory: "North America",
    keyTerms: ["10% of gross", "30-date tour", "Support slots included"]
  }
]

const mockRights: RightsCode[] = [
  {
    id: "r1",
    code: "USRC12345678",
    type: "isrc",
    workTitle: "Midnight Dreams",
    registeredTo: "Alex Rivera",
    dateAssigned: "2025-12-01"
  },
  {
    id: "r2",
    code: "T-345.678.432-1",
    type: "iswc",
    workTitle: "Midnight Dreams",
    registeredTo: "Alex Rivera Music",
    dateAssigned: "2026-01-15"
  },
  {
    id: "r3",
    code: "00287456312",
    type: "ipi",
    workTitle: "N/A",
    registeredTo: "Alex Rivera",
    dateAssigned: "2024-03-01"
  },
  {
    id: "r4",
    code: "QMFV1234567",
    type: "isrc",
    workTitle: "Electric Sunset",
    registeredTo: "Alex Rivera",
    dateAssigned: "2026-04-10"
  }
]

function CopyrightTab() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCopyrights = mockCopyrights.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const statusIcon = (status: CopyrightStatus) => {
    switch (status) {
      case "registered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "unregistered":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const statusColor = (status: CopyrightStatus) => {
    switch (status) {
      case "registered":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "unregistered":
        return "bg-red-500/10 text-red-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search copyrights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Register Work
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredCopyrights.map((copyright) => (
          <Card key={copyright.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{copyright.title}</CardTitle>
                  <CardDescription>
                    {copyright.type === "composition" ? "Musical Composition" : "Sound Recording"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColor(copyright.status)}>
                    {statusIcon(copyright.status)}
                    <span className="ml-1 capitalize">{copyright.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(copyright.dateCreated).toLocaleDateString()}</p>
                </div>
                {copyright.registrationNumber && (
                  <div>
                    <p className="text-muted-foreground">Registration #</p>
                    <p className="font-medium font-mono">{copyright.registrationNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Authors</p>
                  <p className="font-medium">{copyright.authors.join(", ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Claimants</p>
                  <p className="font-medium">{copyright.claimants.join(", ")}</p>
                </div>
              </div>
              {copyright.status !== "registered" && (
                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    {copyright.status === "pending" ? "Check Status" : "Start Registration"}
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

function LicensesTab() {
  const [licenseFilter, setLicenseFilter] = useState<LicenseType | "all">("all")

  const filteredLicenses = licenseFilter === "all"
    ? mockLicenses
    : mockLicenses.filter(l => l.type === licenseFilter)

  const licenseIcon = (type: LicenseType) => {
    switch (type) {
      case "sync":
        return <Video className="h-4 w-4" />
      case "mechanical":
        return <Music className="h-4 w-4" />
      case "performance":
        return <Radio className="h-4 w-4" />
      case "master":
        return <Disc className="h-4 w-4" />
      case "print":
        return <Printer className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          {(["all", "sync", "mechanical", "performance", "master"] as const).map((type) => (
            <Button
              key={type}
              variant={licenseFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setLicenseFilter(type)}
              className="capitalize"
            >
              {type === "all" ? "All" : type}
            </Button>
          ))}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New License
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredLicenses.map((license) => (
          <Card key={license.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {licenseIcon(license.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{license.workTitle}</CardTitle>
                    <CardDescription>{license.licensee}</CardDescription>
                  </div>
                </div>
                <Badge variant={license.status === "active" ? "default" : "secondary"}>
                  {license.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{license.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Territory</p>
                  <p className="font-medium">{license.territory}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {new Date(license.startDate).toLocaleDateString()} - {license.endDate ? new Date(license.endDate).toLocaleDateString() : "Ongoing"}
                  </p>
                </div>
                {license.advance && (
                  <div>
                    <p className="text-muted-foreground">Advance</p>
                    <p className="font-medium">${license.advance.toLocaleString()}</p>
                  </div>
                )}
              </div>
              {license.royaltyRate && (
                <div className="mt-3 pt-3 border-t text-sm">
                  <span className="text-muted-foreground">Royalty Rate: </span>
                  <span className="font-medium">{license.royaltyRate}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ContractsTab() {
  const statusColor = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "expired":
        return "bg-red-500/10 text-red-500"
      case "review":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Agreements</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contract
        </Button>
      </div>

      <div className="grid gap-4">
        {mockContracts.map((contract) => (
          <Card key={contract.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{contract.title}</CardTitle>
                  <CardDescription>{contract.counterparty}</CardDescription>
                </div>
                <Badge variant="outline" className={statusColor(contract.status)}>
                  <span className="capitalize">{contract.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{contract.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Territory</p>
                  <p className="font-medium">{contract.territory || "Worldwide"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {new Date(contract.startDate).toLocaleDateString()} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Ongoing"}
                  </p>
                </div>
              </div>
              {contract.keyTerms && contract.keyTerms.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Key Terms</p>
                  <div className="flex flex-wrap gap-2">
                    {contract.keyTerms.map((term, i) => (
                      <Badge key={i} variant="secondary">{term}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RightsTab() {
  const codeIcon = (type: RightsCode["type"]) => {
    switch (type) {
      case "isrc":
        return <Key className="h-4 w-4" />
      case "iswc":
        return <Music className="h-4 w-4" />
      case "ipi":
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Rights Codes</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Register Code
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ISRC Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockRights.filter(r => r.type === "isrc").length}
            </div>
            <p className="text-sm text-muted-foreground">Sound recordings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ISWC Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockRights.filter(r => r.type === "iswc").length}
            </div>
            <p className="text-sm text-muted-foreground">Musical works</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">IPI Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockRights.filter(r => r.type === "ipi").length}
            </div>
            <p className="text-sm text-muted-foreground">Songwriter IDs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {mockRights.map((right) => (
          <Card key={right.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {codeIcon(right.type)}
                  </div>
                  <div>
                    <p className="font-mono font-medium text-lg">{right.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {right.type.toUpperCase()} — {right.workTitle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{right.registeredTo}</p>
                  <p className="text-xs text-muted-foreground">
                    Assigned {new Date(right.dateAssigned).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function LegalPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Legal</h1>
            <p className="text-muted-foreground">Manage copyrights, licenses, contracts, and rights codes</p>
          </div>
        </div>

        <Tabs defaultValue="copyright" className="space-y-4">
          <TabsList>
            <TabsTrigger value="copyright" className="gap-2">
              <FileText className="h-4 w-4" />
              Copyrights
            </TabsTrigger>
            <TabsTrigger value="licenses" className="gap-2">
              <Scale className="h-4 w-4" />
              Licenses
            </TabsTrigger>
            <TabsTrigger value="contracts" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="rights" className="gap-2">
              <Key className="h-4 w-4" />
              Rights Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="copyright">
            <CopyrightTab />
          </TabsContent>

          <TabsContent value="licenses">
            <LicensesTab />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsTab />
          </TabsContent>

          <TabsContent value="rights">
            <RightsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function Disc(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
