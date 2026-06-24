"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Music,
  Video,
  Camera,
  Radio,
  Mic,
  Disc,
  Calendar,
  Megaphone,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Palette,
  Users,
  ArrowRight,
  Target,
  Zap,
  FolderOpen
} from "lucide-react"

type ProjectType = "single" | "ep" | "album" | "video" | "session" | "tour" | "grant" | "brand" | "content" | "collab"
type ProjectPhase = "ideation" | "pre-production" | "production" | "post-production" | "pre-release" | "release" | "post-release" | "complete"

interface ProjectTemplate {
  type: ProjectType
  name: string
  icon: React.ElementType
  description: string
  phases: string[]
  defaultTasks: string[]
  color: string
}

interface Project {
  id: string
  title: string
  type: ProjectType
  phase: ProjectPhase
  progress: number
  dueDate?: string
  tasksComplete: number
  tasksTotal: number
  collaborators: number
}

const projectTemplates: ProjectTemplate[] = [
  {
    type: "single",
    name: "Single Release",
    icon: Music,
    description: "Release a single track to streaming platforms",
    phases: ["Writing", "Recording", "Mixing", "Mastering", "Artwork", "Distribution", "Pre-Release", "Release", "Post-Release"],
    defaultTasks: [
      "Finalize song arrangement",
      "Book studio time",
      "Record vocals and instruments",
      "Mix the track",
      "Master the track",
      "Create cover artwork (3000x3000px)",
      "Register copyright",
      "Assign ISRC code",
      "Submit to distributor 4 weeks early",
      "Submit to Spotify editorial playlist",
      "Create social media content calendar",
      "Write press release",
      "Send to radio promoters",
      "Release day social media blitz",
      "Monitor first week streams"
    ],
    color: "bg-blue-500"
  },
  {
    type: "ep",
    name: "EP Release",
    icon: Disc,
    description: "Release an EP (3-6 tracks)",
    phases: ["Writing", "Pre-Production", "Recording", "Mixing", "Mastering", "Artwork", "Sequencing", "Distribution", "Pre-Release", "Release", "Post-Release"],
    defaultTasks: [
      "Finalize tracklist (3-6 songs)",
      "Record all tracks",
      "Mix all tracks",
      "Master all tracks",
      "Create EP artwork",
      "Register copyrights for all tracks",
      "Assign ISRC codes",
      "Submit to distributor 4-6 weeks early",
      "Submit singles to playlists before EP",
      "Create content rollout plan",
      "Plan EP release show",
      "Email blast to mailing list"
    ],
    color: "bg-purple-500"
  },
  {
    type: "album",
    name: "Album Release",
    icon: Disc,
    description: "Release a full album (10-12 tracks)",
    phases: ["Songwriting", "Pre-Production", "Recording", "Mixing", "Mastering", "Sequencing", "Artwork", "Distribution", "Single Rollout", "Pre-Release", "Release", "Post-Release"],
    defaultTasks: [
      "Finalize tracklist (10-12 songs)",
      "Record all tracks with producer",
      "Mix all tracks",
      "Master all tracks",
      "Create album artwork and packaging",
      "Register all copyrights",
      "Assign ISRC codes to all tracks",
      "Plan single rollout (2-3 singles before album)",
      "Submit singles to playlists 6-8 weeks before",
      "Submit album to distributor 6 weeks early",
      "Create album release marketing plan",
      "Plan album release show/event",
      "Press campaign (2 weeks before release)",
      "Social media content calendar",
      "Email blast to mailing list",
      "Monitor first week performance"
    ],
    color: "bg-green-500"
  },
  {
    type: "video",
    name: "Music Video",
    icon: Video,
    description: "Produce a music video",
    phases: ["Concept", "Pre-Production", "Production", "Post-Production", "Release"],
    defaultTasks: [
      "Develop video concept/treatment",
      "Hire director/videographer",
      "Scout locations",
      "Create shot list",
      "Book crew (camera, lighting, etc.)",
      "Schedule shoot date",
      "Film the video",
      "Edit and color grade",
      "Add effects/transitions",
      "Upload to YouTube with VEVO",
      "Create behind-the-scenes content",
      "Share on social media"
    ],
    color: "bg-red-500"
  },
  {
    type: "session",
    name: "Recording Session",
    icon: Mic,
    description: "Book and manage recording sessions",
    phases: ["Booking", "Prep", "Recording", "Follow-up"],
    defaultTasks: [
      "Book studio time",
      "Confirm engineer/producer",
      "Prepare tracks/demos to record",
      "Bring necessary equipment",
      "Record session",
      "Get rough mixes",
      "Schedule mixing session",
      "Pay studio and engineer"
    ],
    color: "bg-indigo-500"
  },
  {
    type: "tour",
    name: "Tour",
    icon: MapPin,
    description: "Plan and execute a tour",
    phases: ["Strategy", "Booking", "Routing", "Marketing", "Pre-Tour", "Touring", "Post-Tour"],
    defaultTasks: [
      "Define tour goals and budget",
      "Create routing plan",
      "Contact booking agents/promoters",
      "Negotiate guarantees",
      "Book venues",
      "Create tour marketing plan",
      "Design tour poster",
      "Book transportation",
      "Arrange accommodations",
      "Create merch for tour",
      "Promote shows on social media",
      "Finalize setlist",
      "Load-in and soundcheck",
      "Execute shows",
      "Post-tour financial reconciliation"
    ],
    color: "bg-orange-500"
  },
  {
    type: "grant",
    name: "Grant Application",
    icon: FileText,
    description: "Apply for grants and funding",
    phases: ["Research", "Drafting", "Budget", "Submission", "Follow-up"],
    defaultTasks: [
      "Research grant opportunities",
      "Review eligibility requirements",
      "Write project narrative",
      "Create project budget",
      "Gather supporting materials",
      "Get letters of recommendation",
      "Submit application",
      "Follow up with funder",
      "If awarded: write thank you and report"
    ],
    color: "bg-emerald-500"
  },
  {
    type: "brand",
    name: "Brand Partnership",
    icon: Users,
    description: "Secure a brand partnership or sponsorship",
    phases: ["Research", "Outreach", "Negotiation", "Execution", "Reporting"],
    defaultTasks: [
      "Research potential brand partners",
      "Create sponsorship proposal",
      "Identify contact person at brand",
      "Send outreach email",
      "Follow up on proposal",
      "Negotiate terms",
      "Sign agreement",
      "Deliver on deliverables",
      "Report results to brand"
    ],
    color: "bg-pink-500"
  },
  {
    type: "content",
    name: "Content Campaign",
    icon: Megaphone,
    description: "Create and distribute content",
    phases: ["Planning", "Creation", "Scheduling", "Publishing", "Analysis"],
    defaultTasks: [
      "Define campaign goals",
      "Create content calendar",
      "Film/create content assets",
      "Edit content",
      "Write captions/copy",
      "Schedule posts",
      "Publish across platforms",
      "Engage with comments",
      "Analyze performance"
    ],
    color: "bg-cyan-500"
  },
  {
    type: "collab",
    name: "Collaboration",
    icon: Users,
    description: "Work with another artist or producer",
    phases: ["Outreach", "Sessions", "Recording", "Mixing", "Agreements", "Release"],
    defaultTasks: [
      "Reach out to collaborator",
      "Discuss creative vision",
      "Set up writing sessions",
      "Record collaboration",
      "Negotiate splits and credits",
      "Sign split sheet",
      "Mix and master",
      "Plan release strategy",
      "Coordinate promotional efforts"
    ],
    color: "bg-teal-500"
  },
]

const mockProjects: Project[] = [
  { id: "1", title: "Midnight Dreams - Single", type: "single", phase: "pre-release", progress: 75, dueDate: "2026-07-15", tasksComplete: 9, tasksTotal: 12, collaborators: 2 },
  { id: "2", title: "Electric Sunset - EP", type: "ep", phase: "production", progress: 40, dueDate: "2026-09-01", tasksComplete: 4, tasksTotal: 10, collaborators: 3 },
  { id: "3", title: "Summer Tour 2026", type: "tour", phase: "ideation", progress: 25, dueDate: "2026-08-01", tasksComplete: 3, tasksTotal: 12, collaborators: 1 },
  { id: "4", title: "Music Video - City Lights", type: "video", phase: "pre-production", progress: 30, tasksComplete: 2, tasksTotal: 10, collaborators: 4 },
  { id: "5", title: "NEA Grant Application", type: "grant", phase: "ideation", progress: 50, dueDate: "2026-08-01", tasksComplete: 3, tasksTotal: 6, collaborators: 1 },
]

const phaseColors: Record<ProjectPhase, string> = {
  ideation: "bg-gray-500/10 text-gray-500",
  "pre-production": "bg-yellow-500/10 text-yellow-500",
  production: "bg-blue-500/10 text-blue-500",
  "post-production": "bg-purple-500/10 text-purple-500",
  "pre-release": "bg-orange-500/10 text-orange-500",
  release: "bg-green-500/10 text-green-500",
  "post-release": "bg-teal-500/10 text-teal-500",
  complete: "bg-emerald-500/10 text-emerald-500",
}

function ProjectsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<ProjectType | "all">("all")

  const filtered = mockProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || p.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
          {(["all", "single", "ep", "album", "video", "tour", "grant", "content"] as const).map(type => (
            <Button key={type} variant={filterType === type ? "default" : "outline"} size="sm" onClick={() => setFilterType(type)} className="capitalize">
              {type === "all" ? "All" : type}
            </Button>
          ))}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {filtered.map(project => {
          const template = projectTemplates.find(t => t.type === project.type)
          const Icon = template?.icon || Music
          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${template?.color || "bg-gray-500"} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{project.type}</span>
                        {project.dueDate && <span>• Due {new Date(project.dueDate).toLocaleDateString()}</span>}
                        <span>• {project.collaborators} collaborator{project.collaborators !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.tasksComplete}/{project.tasksTotal} tasks</p>
                      <p className="text-xs text-muted-foreground">{project.progress}%</p>
                    </div>
                    <Badge variant="outline" className={phaseColors[project.phase]}>
                      {project.phase.replace(/-/g, " ")}
                    </Badge>
                    <div className="w-24">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
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
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)

  return (
    <div className="space-y-6">
      {selectedTemplate ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
            ← Back to templates
          </Button>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedTemplate.color} text-white`}>
                  <selectedTemplate.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Project Phases</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTemplate.phases.map((phase, i) => (
                    <div key={phase} className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-muted rounded-full text-sm">{phase}</div>
                      {i < selectedTemplate.phases.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Default Tasks ({selectedTemplate.defaultTasks.length})</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {selectedTemplate.defaultTasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 border rounded">
                      <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Project from Template
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectTemplates.map(template => {
            const Icon = template.icon
            return (
              <Card key={template.type} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedTemplate(template)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{template.defaultTasks.length} default tasks • {template.phases.length} phases</p>
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

function TasksTab() {
  const [filterPhase, setFilterPhase] = useState<string>("all")

  const allTasks = mockProjects.flatMap(p =>
    projectTemplates.find(t => t.type === p.type)?.defaultTasks.slice(0, Math.ceil(p.progress / 20)).map((task, i) => ({
      id: `${p.id}-${i}`,
      title: task,
      project: p.title,
      projectType: p.type,
      phase: p.phase,
      status: i < Math.floor(p.progress / 20) ? "done" : i === Math.floor(p.progress / 20) ? "in_progress" : "todo",
    })) || []
  )

  const filtered = filterPhase === "all" ? allTasks : allTasks.filter(t => t.phase === filterPhase)

  const statusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress": return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          {(["all", "ideation", "pre-production", "production", "post-production", "pre-release", "release"] as const).map(phase => (
            <Button key={phase} variant={filterPhase === phase ? "default" : "outline"} size="sm" onClick={() => setFilterPhase(phase)} className="capitalize">
              {phase.replace(/-/g, " ")}
            </Button>
          ))}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-3">
        {filtered.map(task => (
          <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
            {statusIcon(task.status)}
            <div className="flex-1">
              <p className={`text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.project}</p>
            </div>
            <Badge variant="outline" className="text-xs capitalize">{task.phase.replace(/-/g, " ")}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your music projects with industry-specific workflows</p>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              All Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects"><ProjectsTab /></TabsContent>
          <TabsContent value="templates"><TemplatesTab /></TabsContent>
          <TabsContent value="tasks"><TasksTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
