"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Music,
  Camera,
  Megaphone,
  Globe,
  Radio,
  Disc,
  Target
} from "lucide-react"

type ReleasePhase = "pre-production" | "recording" | "mixing" | "mastering" | "pre-release" | "release" | "post-release"
type TaskStatus = "completed" | "in_progress" | "upcoming" | "overdue"

interface ReleaseTimeline {
  id: string
  title: string
  type: "single" | "ep" | "album"
  releaseDate: string
  currentPhase: ReleasePhase
  tasks: ReleaseTask[]
}

interface ReleaseTask {
  id: string
  title: string
  phase: ReleasePhase
  status: TaskStatus
  dueDate: string
  assignee?: string
  category: "creative" | "legal" | "marketing" | "distribution" | "pr"
}

const phases: { key: ReleasePhase; label: string; icon: React.ElementType; color: string }[] = [
  { key: "pre-production", label: "Pre-Production", icon: Music, color: "text-gray-500" },
  { key: "recording", label: "Recording", icon: Disc, color: "text-blue-500" },
  { key: "mixing", label: "Mixing", icon: Music, color: "text-purple-500" },
  { key: "mastering", label: "Mastering", icon: Music, color: "text-indigo-500" },
  { key: "pre-release", label: "Pre-Release", icon: Megaphone, color: "text-yellow-500" },
  { key: "release", label: "Release", icon: Globe, color: "text-green-500" },
  { key: "post-release", label: "Post-Release", icon: Target, color: "text-orange-500" },
]

const mockRelease: ReleaseTimeline = {
  id: "1",
  title: "Electric Sunset - Single",
  type: "single",
  releaseDate: "2026-08-15",
  currentPhase: "pre-release",
  tasks: [
    { id: "1", title: "Finalize mix", phase: "mixing", status: "completed", dueDate: "2026-06-01", assignee: "Lisa Park", category: "creative" },
    { id: "2", title: "Master track", phase: "mastering", status: "completed", dueDate: "2026-06-15", assignee: "Mastering engineer", category: "creative" },
    { id: "3", title: "Register copyright", phase: "pre-release", status: "completed", dueDate: "2026-06-20", category: "legal" },
    { id: "4", title: "Assign ISRC code", phase: "pre-release", status: "completed", dueDate: "2026-06-20", category: "distribution" },
    { id: "5", title: "Create artwork", phase: "pre-release", status: "completed", dueDate: "2026-06-25", category: "creative" },
    { id: "6", title: "Distribute to DSPs", phase: "pre-release", status: "in_progress", dueDate: "2026-07-01", category: "distribution" },
    { id: "7", title: "Submit to playlists", phase: "pre-release", status: "in_progress", dueDate: "2026-07-15", category: "marketing" },
    { id: "8", title: "Press release", phase: "pre-release", status: "upcoming", dueDate: "2026-07-20", category: "pr" },
    { id: "9", title: "Social media campaign", phase: "pre-release", status: "upcoming", dueDate: "2026-08-01", category: "marketing" },
    { id: "10", title: "Email blast", phase: "pre-release", status: "upcoming", dueDate: "2026-08-10", category: "marketing" },
    { id: "11", title: "Release day", phase: "release", status: "upcoming", dueDate: "2026-08-15", category: "distribution" },
    { id: "12", title: "Submit to radio", phase: "post-release", status: "upcoming", dueDate: "2026-08-20", category: "pr" },
    { id: "13", title: "Post-release content", phase: "post-release", status: "upcoming", dueDate: "2026-08-25", category: "marketing" },
    { id: "14", title: "Performance royalties check", phase: "post-release", status: "upcoming", dueDate: "2026-09-15", category: "legal" },
  ]
}

const statusIcon = (status: TaskStatus) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
    case "in_progress": return <Clock className="h-4 w-4 text-yellow-500" />
    case "upcoming": return <AlertCircle className="h-4 w-4 text-blue-500" />
    case "overdue": return <AlertCircle className="h-4 w-4 text-red-500" />
  }
}

const statusColors: Record<TaskStatus, string> = {
  completed: "bg-green-500/10 text-green-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  upcoming: "bg-blue-500/10 text-blue-500",
  overdue: "bg-red-500/10 text-red-500",
}

function TimelineTab() {
  const currentPhaseIndex = phases.findIndex(p => p.key === mockRelease.currentPhase)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{mockRelease.title}</CardTitle>
              <CardDescription>Release Date: {new Date(mockRelease.releaseDate).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">{mockRelease.type}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {phases.map((phase, i) => {
              const PhaseIcon = phase.icon
              const isCompleted = i < currentPhaseIndex
              const isCurrent = i === currentPhaseIndex
              const isFuture = i > currentPhaseIndex

              return (
                <div key={phase.key} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isCurrent ? "border-primary bg-primary/10" :
                    isCompleted ? "border-green-500 bg-green-500/10" :
                    "border-muted"
                  }`}>
                    <PhaseIcon className={`h-4 w-4 ${
                      isCurrent ? "text-primary" :
                      isCompleted ? "text-green-500" :
                      "text-muted-foreground"
                    }`} />
                    <span className={`text-sm whitespace-nowrap ${
                      isCurrent ? "font-medium" :
                      isCompleted ? "text-green-500" :
                      "text-muted-foreground"
                    }`}>
                      {phase.label}
                    </span>
                  </div>
                  {i < phases.length - 1 && (
                    <div className={`w-6 h-px ${isCompleted ? "bg-green-500" : "bg-muted"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {phases.map((phase) => {
          const phaseTasks = mockRelease.tasks.filter(t => t.phase === phase.key)
          if (phaseTasks.length === 0) return null

          return (
            <Card key={phase.key}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <phase.icon className={`h-4 w-4 ${phase.color}`} />
                  {phase.label}
                  <Badge variant="secondary" className="ml-2">{phaseTasks.length} tasks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {phaseTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {statusIcon(task.status)}
                        <span className="text-sm">{task.title}</span>
                        <Badge variant="outline" className="text-xs capitalize">{task.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        {task.assignee && (
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className={statusColors[task.status]}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function ChecklistTab() {
  const checklists = [
    {
      title: "Pre-Release Checklist (8-12 weeks before)",
      items: [
        "Finalize all recordings and mixes",
        "Master tracks with approved engineer",
        "Register copyright with US Copyright Office",
        "Assign ISRC codes to all tracks",
        "Register songs with MLC, HFA, and PRO",
        "Create album artwork (minimum 3000x3000px)",
        "Write press release and artist bio",
        "Set up pre-order on all platforms",
        "Submit to playlist curators (6-8 weeks ahead)",
        "Plan social media content calendar",
      ]
    },
    {
      title: "Release Week Checklist",
      items: [
        "Verify all DSPs have the release",
        "Confirm metadata is correct across platforms",
        "Launch social media campaign",
        "Send email blast to mailing list",
        "Update website with new release",
        "Schedule press interviews",
        "Post behind-the-scenes content",
        "Go live on social media",
        "Update YouTube channel",
        "Submit to radio (if applicable)",
      ]
    },
    {
      title: "Post-Release Checklist (2-8 weeks after)",
      items: [
        "Monitor streaming numbers and fan response",
        "Submit to more playlists",
        "Share fan reactions and reviews",
        "Plan music video or visual content",
        "Submit to radio stations",
        "Check royalty statements are coming in",
        "Follow up with press contacts",
        "Plan next release or tour",
        "Update EPK with new release",
        "Thank collaborators and team",
      ]
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {checklists.map((checklist) => (
        <Card key={checklist.title}>
          <CardHeader>
            <CardTitle className="text-base">{checklist.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {checklist.items.map((item, i) => (
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

export default function ReleasesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Releases</h1>
            <p className="text-muted-foreground">Manage your release timeline and tasks</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Release
          </Button>
        </div>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="checklist" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Checklists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineTab />
          </TabsContent>

          <TabsContent value="checklist">
            <ChecklistTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
