"use client"

import { useState, useRef } from "react"
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
  FolderOpen,
  MoreHorizontal,
  GripVertical
} from "lucide-react"

type ProjectType = "single" | "ep" | "album" | "video" | "session" | "tour" | "grant" | "brand" | "content" | "collab"
type ProjectPhase = "ideation" | "pre_production" | "production" | "post_production" | "pre_release" | "release" | "post_release"

interface Project {
  id: string
  title: string
  type: ProjectType
  phase: ProjectPhase
  progress: number
  dueDate?: string
  tasksComplete: number
  tasksTotal: number
}

const projectTypeConfig: Record<ProjectType, { label: string; color: string; icon: React.ElementType }> = {
  single: { label: "Single", color: "bg-blue-500/10 text-blue-500 border-blue-500/30", icon: Music },
  ep: { label: "EP", color: "bg-purple-500/10 text-purple-500 border-purple-500/30", icon: Disc },
  album: { label: "Album", color: "bg-green-500/10 text-green-500 border-green-500/30", icon: Disc },
  video: { label: "Video", color: "bg-red-500/10 text-red-500 border-red-500/30", icon: Video },
  session: { label: "Session", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30", icon: Mic },
  tour: { label: "Tour", color: "bg-orange-500/10 text-orange-500 border-orange-500/30", icon: MapPin },
  grant: { label: "Grant", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30", icon: FileText },
  brand: { label: "Brand", color: "bg-pink-500/10 text-pink-500 border-pink-500/30", icon: Users },
  content: { label: "Content", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30", icon: Megaphone },
  collab: { label: "Collab", color: "bg-teal-500/10 text-teal-500 border-teal-500/30", icon: Users },
}

const phases: { key: ProjectPhase; label: string; color: string }[] = [
  { key: "ideation", label: "Ideation", color: "bg-gray-500" },
  { key: "pre_production", label: "Pre-Production", color: "bg-yellow-500" },
  { key: "production", label: "Production", color: "bg-blue-500" },
  { key: "post_production", label: "Post-Production", color: "bg-purple-500" },
  { key: "pre_release", label: "Pre-Release", color: "bg-orange-500" },
  { key: "release", label: "Release", color: "bg-green-500" },
  { key: "post_release", label: "Post-Release", color: "bg-teal-500" },
]

const mockProjects: Project[] = [
  { id: "1", title: "Midnight Dreams - Single", type: "single", phase: "pre_release", progress: 75, dueDate: "2026-07-15", tasksComplete: 9, tasksTotal: 12 },
  { id: "2", title: "Electric Sunset - EP", type: "ep", phase: "production", progress: 40, dueDate: "2026-09-01", tasksComplete: 4, tasksTotal: 10 },
  { id: "3", title: "Summer Tour 2026", type: "tour", phase: "ideation", progress: 25, dueDate: "2026-08-01", tasksComplete: 3, tasksTotal: 12 },
  { id: "4", title: "Music Video - City Lights", type: "video", phase: "pre_production", progress: 30, tasksComplete: 2, tasksTotal: 10 },
  { id: "5", title: "NEA Grant Application", type: "grant", phase: "production", progress: 50, dueDate: "2026-08-01", tasksComplete: 3, tasksTotal: 6 },
  { id: "6", title: "TikTok Content Series", type: "content", phase: "production", progress: 60, tasksComplete: 3, tasksTotal: 5 },
  { id: "7", title: "Brand Deal - Fender", type: "brand", phase: "pre_release", progress: 80, dueDate: "2026-07-01", tasksComplete: 4, tasksTotal: 5 },
]

const mockTasks = [
  { id: "t1", title: "Finalize song arrangement", project: "Midnight Dreams", type: "single" as ProjectType, phase: "pre_production" as ProjectPhase, status: "done" as const, priority: "high" as const },
  { id: "t2", title: "Book studio time", project: "Electric Sunset", type: "ep" as ProjectType, phase: "pre_production" as ProjectPhase, status: "done" as const, priority: "high" as const },
  { id: "t3", title: "Record vocals and instruments", project: "Electric Sunset", type: "ep" as ProjectType, phase: "production" as ProjectPhase, status: "in_progress" as const, priority: "high" as const },
  { id: "t4", title: "Mix the track", project: "Midnight Dreams", type: "single" as ProjectType, phase: "post_production" as ProjectPhase, status: "done" as const, priority: "medium" as const },
  { id: "t5", title: "Master the track", project: "Midnight Dreams", type: "single" as ProjectType, phase: "post_production" as ProjectPhase, status: "in_progress" as const, priority: "medium" as const },
  { id: "t6", title: "Create cover artwork", project: "Midnight Dreams", type: "single" as ProjectType, phase: "pre_release" as ProjectPhase, status: "done" as const, priority: "high" as const },
  { id: "t7", title: "Register copyright", project: "Midnight Dreams", type: "single" as ProjectType, phase: "pre_release" as ProjectPhase, status: "in_progress" as const, priority: "high" as const },
  { id: "t8", title: "Submit to distributor", project: "Midnight Dreams", type: "single" as ProjectType, phase: "pre_release" as ProjectPhase, status: "todo" as const, priority: "high" as const },
  { id: "t9", title: "Submit to Spotify editorial", project: "Midnight Dreams", type: "single" as ProjectType, phase: "pre_release" as ProjectPhase, status: "todo" as const, priority: "high" as const },
  { id: "t10", title: "Create social media content", project: "Midnight Dreams", type: "single" as ProjectType, phase: "pre_release" as ProjectPhase, status: "todo" as const, priority: "medium" as const },
  { id: "t11", title: "Record all tracks", project: "Electric Sunset", type: "ep" as ProjectType, phase: "production" as ProjectPhase, status: "todo" as const, priority: "high" as const },
  { id: "t12", title: "Mix all tracks", project: "Electric Sunset", type: "ep" as ProjectType, phase: "post_production" as ProjectPhase, status: "todo" as const, priority: "medium" as const },
  { id: "t13", title: "Define tour goals and budget", project: "Summer Tour", type: "tour" as ProjectType, phase: "ideation" as ProjectPhase, status: "done" as const, priority: "high" as const },
  { id: "t14", title: "Create routing plan", project: "Summer Tour", type: "tour" as ProjectType, phase: "pre_production" as ProjectPhase, status: "in_progress" as const, priority: "high" as const },
  { id: "t15", title: "Contact booking agents", project: "Summer Tour", type: "tour" as ProjectType, phase: "pre_production" as ProjectPhase, status: "todo" as const, priority: "high" as const },
]

function ProjectsTab() {
  const [view, setView] = useState<"board" | "list">("board")
  const [filterPhase, setFilterPhase] = useState<ProjectPhase | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [draggedProject, setDraggedProject] = useState<string | null>(null)
  const [dragOverPhase, setDragOverPhase] = useState<ProjectPhase | null>(null)
  const [snappedBack, setSnappedBack] = useState<string | null>(null)

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPhase = filterPhase === "all" || p.phase === filterPhase
    return matchesSearch && matchesPhase
  })

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", projectId)
  }

  const handleDragOver = (e: React.DragEvent, phase: ProjectPhase) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverPhase(phase)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the drop zone entirely
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverPhase(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetPhase: ProjectPhase) => {
    e.preventDefault()
    const projectId = e.dataTransfer.getData("text/plain")
    if (projectId && targetPhase) {
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, phase: targetPhase } : p
      ))
    }
    setDraggedProject(null)
    setDragOverPhase(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    // Check if dropped outside any column
    const relatedTarget = e.relatedTarget as HTMLElement
    const dropZone = (e.target as HTMLElement).closest('[data-phase]')

    if (!dropZone && draggedProject) {
      // Snapped back — trigger animation
      setSnappedBack(draggedProject)
      setTimeout(() => setSnappedBack(null), 400)
    }

    setDraggedProject(null)
    setDragOverPhase(null)
  }

  return (
    <div className="space-y-4">
      {/* Page Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-xs text-muted-foreground">Active Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{projects.filter(p => p.dueDate && new Date(p.dueDate) < new Date(Date.now() + 7 * 86400000)).length}</p>
            <p className="text-xs text-muted-foreground">Due This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{projects.reduce((s, p) => s + p.tasksTotal - p.tasksComplete, 0)}</p>
            <p className="text-xs text-muted-foreground">Open Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-2xl font-bold">{Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)}%</p>
            <p className="text-xs text-muted-foreground">Avg Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-56" />
          </div>
          {(["all", "ideation", "pre_production", "production", "pre_release"] as const).map(phase => (
            <Button key={phase} variant={filterPhase === phase ? "default" : "outline"} size="sm" onClick={() => setFilterPhase(phase)} className="capitalize text-xs">
              {phase.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setView(view === "board" ? "list" : "board")}>
            {view === "board" ? "List View" : "Board View"}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
        </div>
      </div>

      {/* Board View */}
      {view === "board" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {phases.map(phase => {
            const phaseProjects = filtered.filter(p => p.phase === phase.key)
            const isDragOver = dragOverPhase === phase.key
            return (
              <div
                key={phase.key}
                className={`min-w-[280px] max-w-[320px] flex-shrink-0 transition-colors rounded-lg ${isDragOver ? "bg-primary/5 ring-2 ring-primary/30" : ""}`}
                onDragOver={(e) => handleDragOver(e, phase.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, phase.key)}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                  <p className="text-sm font-medium">{phase.label}</p>
                  <Badge variant="secondary" className="text-xs ml-auto">{phaseProjects.length}</Badge>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {phaseProjects.map(project => {
                    const config = projectTypeConfig[project.type]
                    const Icon = config.icon
                    const isDragging = draggedProject === project.id
                    return (
                      <Card
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragEnd={handleDragEnd}
                        data-phase={phase.key}
                        className={`hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                          draggedProject === project.id ? "opacity-50 scale-95" :
                          snappedBack === project.id ? "animate-snap-back" : ""
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className={`text-xs ${config.color}`}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          </div>
                          <p className="font-medium text-sm mb-2">{project.title}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{project.tasksComplete}/{project.tasksTotal} tasks</span>
                            {project.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(project.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {phaseProjects.length === 0 && (
                    <div className="p-4 border border-dashed rounded-lg text-center text-xs text-muted-foreground">
                      {isDragOver ? "Drop here" : "No projects"}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filtered.map(project => {
            const config = projectTypeConfig[project.type]
            const Icon = config.icon
            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs ${config.color}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <p className="font-medium text-sm">{project.title}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{project.tasksComplete}/{project.tasksTotal} tasks</span>
                      {project.dueDate && <span>{new Date(project.dueDate).toLocaleDateString()}</span>}
                      <div className="w-20">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
      )}
    </div>
  )
}

function TemplatesTab() {
  const templates = [
    { name: "Single Release", description: "Release a single track to streaming platforms", tasks: 15, phases: 9, icon: Music, color: "bg-blue-500" },
    { name: "EP Release", description: "Release an EP (3-6 tracks)", tasks: 12, phases: 11, icon: Disc, color: "bg-purple-500" },
    { name: "Album Release", description: "Release a full album (10-12 tracks)", tasks: 16, phases: 12, icon: Disc, color: "bg-green-500" },
    { name: "Music Video", description: "Produce a music video", tasks: 12, phases: 5, icon: Video, color: "bg-red-500" },
    { name: "Recording Session", description: "Book and manage recording sessions", tasks: 8, phases: 4, icon: Mic, color: "bg-indigo-500" },
    { name: "Tour", description: "Plan and execute a tour", tasks: 15, phases: 7, icon: MapPin, color: "bg-orange-500" },
    { name: "Grant Application", description: "Apply for grants and funding", tasks: 9, phases: 5, icon: FileText, color: "bg-emerald-500" },
    { name: "Brand Partnership", description: "Secure a brand partnership", tasks: 9, phases: 5, icon: Users, color: "bg-pink-500" },
    { name: "Content Campaign", description: "Create and distribute content", tasks: 9, phases: 5, icon: Megaphone, color: "bg-cyan-500" },
    { name: "Collaboration", description: "Work with another artist", tasks: 9, phases: 6, icon: Users, color: "bg-teal-500" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map(template => {
        const Icon = template.icon
        return (
          <Card key={template.name} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${template.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{template.tasks} tasks</span>
                    <span>{template.phases} phases</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function TasksTab() {
  const [filterPhase, setFilterPhase] = useState<ProjectPhase | "all">("all")

  const filtered = mockTasks.filter(t => filterPhase === "all" || t.phase === filterPhase)

  const statusConfig = {
    done: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    in_progress: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    todo: { icon: AlertCircle, color: "text-muted-foreground", bg: "" },
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "ideation", "pre_production", "production", "post_production", "pre_release", "release"] as const).map(phase => (
          <Button key={phase} variant={filterPhase === phase ? "default" : "outline"} size="sm" onClick={() => setFilterPhase(phase)} className="capitalize text-xs">
            {phase.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(task => {
          const config = projectTypeConfig[task.type]
          const status = statusConfig[task.status]
          return (
            <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 group">
              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
              <div className={`p-1.5 rounded ${status.bg}`}>
                <status.icon className={`h-4 w-4 ${status.color}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
              </div>
              <Badge variant="outline" className={`text-xs ${config.color}`}>
                {config.label}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {task.phase.replace(/_/g, " ")}
              </Badge>
              <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                {task.priority}
              </Badge>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <CheckCircle className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your music projects with industry-specific workflows</p>
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

function FolderOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Megaphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  )
}

function Video(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}
