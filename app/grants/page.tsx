"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Plus,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Target,
  Building
} from "lucide-react"

type GrantStatus = "researching" | "drafting" | "submitted" | "awarded" | "rejected" | "completed"
type FunderType = "government" | "foundation" | "corporate" | "individual" | "nonprofit"

interface Grant {
  id: string
  title: string
  funder: string
  funderType: FunderType
  amount: number
  status: GrantStatus
  deadline?: string
  submittedDate?: string
  awardedDate?: string
  projectDescription: string
  alignmentWithMission: string
  reportingRequired: boolean
  website?: string
}

interface GrantTemplate {
  id: string
  name: string
  type: string
  lastUsed: string
}

const mockGrants: Grant[] = [
  {
    id: "g1",
    title: "Recording & Production Grant",
    funder: "New York Foundation for the Arts",
    funderType: "foundation",
    amount: 15000,
    status: "awarded",
    deadline: "2026-03-15",
    submittedDate: "2026-03-10",
    awardedDate: "2026-05-20",
    projectDescription: "Funding for recording, mixing, and mastering of debut album",
    alignmentWithMission: "Supports emerging artists in completing professional recordings",
    reportingRequired: true,
    website: "https://nyfa.org"
  },
  {
    id: "g2",
    title: "Community Arts Program",
    funder: "National Endowment for the Arts",
    funderType: "government",
    amount: 25000,
    status: "drafting",
    deadline: "2026-08-01",
    projectDescription: "Youth music education program in underserved communities",
    alignmentWithMission: "Arts education and community engagement",
    reportingRequired: true,
    website: "https://arts.gov"
  },
  {
    id: "g3",
    title: "Tour Support Fund",
    funder: "South Arts",
    funderType: "nonprofit",
    amount: 10000,
    status: "researching",
    deadline: "2026-09-15",
    projectDescription: "Regional touring support for emerging artists",
    alignmentWithMission: "Supports touring artists in the South",
    reportingRequired: false
  },
  {
    id: "g4",
    title: "Music Video Production",
    funder: "YouTube Music Fund",
    funderType: "corporate",
    amount: 5000,
    status: "submitted",
    deadline: "2026-06-30",
    submittedDate: "2026-06-25",
    projectDescription: "Production budget for music video series",
    alignmentWithMission: "Supports independent music video creation",
    reportingRequired: false,
    website: "https://artists.youtube.com"
  },
  {
    id: "g5",
    title: "Artist Residency Program",
    funder: "MacDowell",
    funderType: "foundation",
    amount: 0,
    status: "researching",
    projectDescription: "Residency for composition and songwriting",
    alignmentWithMission: "Provides time and space for creative work",
    reportingRequired: false,
    website: "https://macdowell.org"
  }
]

const mockTemplates: GrantTemplate[] = [
  {
    id: "t1",
    name: "Project Narrative",
    type: "narrative",
    lastUsed: "2026-03-10"
  },
  {
    id: "t2",
    name: "Budget Template",
    type: "budget",
    lastUsed: "2026-03-10"
  },
  {
    id: "t3",
    name: "Artist Statement",
    type: "statement",
    lastUsed: "2026-05-15"
  },
  {
    id: "t4",
    name: "Work Samples List",
    type: "samples",
    lastUsed: "2026-03-10"
  }
]

function GrantTrackerTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<GrantStatus | "all">("all")

  const filteredGrants = mockGrants.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.funder.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || g.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColor = (status: GrantStatus) => {
    switch (status) {
      case "awarded":
        return "bg-green-500/10 text-green-500"
      case "submitted":
        return "bg-blue-500/10 text-blue-500"
      case "drafting":
        return "bg-yellow-500/10 text-yellow-500"
      case "researching":
        return "bg-gray-500/10 text-gray-500"
      case "rejected":
        return "bg-red-500/10 text-red-500"
      case "completed":
        return "bg-purple-500/10 text-purple-500"
    }
  }

  const statusIcon = (status: GrantStatus) => {
    switch (status) {
      case "awarded":
        return <CheckCircle className="h-4 w-4" />
      case "submitted":
        return <Clock className="h-4 w-4" />
      case "drafting":
        return <FileText className="h-4 w-4" />
      case "researching":
        return <Search className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <Award className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search grants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          {(["all", "researching", "drafting", "submitted", "awarded"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Grant
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredGrants.map((grant) => (
          <Card key={grant.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{grant.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {grant.funder}
                    <Badge variant="outline" className="capitalize">{grant.funderType}</Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {grant.amount > 0 && (
                    <Badge variant="secondary" className="text-lg">
                      ${grant.amount.toLocaleString()}
                    </Badge>
                  )}
                  <Badge variant="outline" className={statusColor(grant.status)}>
                    {statusIcon(grant.status)}
                    <span className="ml-1 capitalize">{grant.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                {grant.deadline && (
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-medium">{new Date(grant.deadline).toLocaleDateString()}</p>
                  </div>
                )}
                {grant.submittedDate && (
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{new Date(grant.submittedDate).toLocaleDateString()}</p>
                  </div>
                )}
                {grant.awardedDate && (
                  <div>
                    <p className="text-muted-foreground">Awarded</p>
                    <p className="font-medium">{new Date(grant.awardedDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Reporting</p>
                  <p className="font-medium">{grant.reportingRequired ? "Required" : "Not Required"}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Description</p>
                  <p className="text-sm">{grant.projectDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mission Alignment</p>
                  <p className="text-sm">{grant.alignmentWithMission}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Proposal
                </Button>
                {grant.website && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={grant.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Funder
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TemplatesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Grant Writing Templates</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>Last used: {new Date(template.lastUsed).toLocaleDateString()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Use Template
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Key Questions for Grant Proposals</CardTitle>
          <CardDescription>Consider these when writing your proposals</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Are you applying as an individual or on behalf of an organization?</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Do you need seed money to pilot a new program or sustaining funds?</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Are you funding operational expenses or capital expenses?</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>How does your project align with the funder's mission?</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>What measurable impact will your project create?</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function ResearchTab() {
  const funders = [
    { name: "New York Foundation for the Arts", type: "foundation", focus: "Individual artists" },
    { name: "National Endowment for the Arts", type: "government", focus: "Arts education, community" },
    { name: "South Arts", type: "nonprofit", focus: "Southern US touring" },
    { name: "Creative Capital", type: "nonprofit", focus: "Innovative projects" },
    { name: "Knight Foundation", type: "foundation", focus: "Arts in communities" },
    { name: "Ford Foundation", type: "foundation", focus: "Social justice through arts" }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Funder Research</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Funder
        </Button>
      </div>

      <div className="grid gap-4">
        {funders.map((funder, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{funder.name}</p>
                  <p className="text-sm text-muted-foreground">{funder.focus}</p>
                </div>
                <Badge variant="outline" className="capitalize">{funder.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function GrantsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Grants & Funding</h1>
            <p className="text-muted-foreground">Track grant opportunities and manage proposals</p>
          </div>
        </div>

        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tracker" className="gap-2">
              <Award className="h-4 w-4" />
              Grant Tracker
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="research" className="gap-2">
              <Search className="h-4 w-4" />
              Research
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker">
            <GrantTrackerTab />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="research">
            <ResearchTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
