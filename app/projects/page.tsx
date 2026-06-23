"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  FolderOpen,
  Music,
  Calendar,
  DollarSign,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Disc,
  Mic,
  Headphones,
  Radio
} from "lucide-react"

interface Project {
  id: string
  title: string
  type: "single" | "ep" | "album" | "mixtape" | "video" | "other"
  status: "idea" | "writing" | "recording" | "mixing" | "mastering" | "artwork" | "distribution" | "released"
  progress: number
  release_date?: string
  budget: number
  spent: number
  collaborators: string[]
  streams?: number
  created_at: string
}

const statusColors: Record<string, string> = {
  idea: "bg-gray-100 text-gray-800",
  writing: "bg-yellow-100 text-yellow-800",
  recording: "bg-blue-100 text-blue-800",
  mixing: "bg-purple-100 text-purple-800",
  mastering: "bg-indigo-100 text-indigo-800",
  artwork: "bg-pink-100 text-pink-800",
  distribution: "bg-orange-100 text-orange-800",
  released: "bg-green-100 text-green-800",
}

const typeIcons: Record<string, React.ElementType> = {
  single: Disc,
  ep: Headphones,
  album: Music,
  mixtape: Radio,
  video: Mic,
  other: FolderOpen,
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    type: "ep",
    status: "recording",
    progress: 45,
    release_date: "2026-03-15",
    budget: 5000,
    spent: 2200,
    collaborators: ["Producer Mike", "Engineer Jay"],
    streams: 0,
    created_at: "2025-12-01",
  },
  {
    id: "2",
    title: "City Lights",
    type: "single",
    status: "mastering",
    progress: 85,
    release_date: "2026-01-20",
    budget: 1500,
    spent: 1200,
    collaborators: ["DJ Spin"],
    streams: 0,
    created_at: "2025-11-15",
  },
  {
    id: "3",
    title: "Street Stories",
    type: "album",
    status: "idea",
    progress: 10,
    budget: 15000,
    spent: 500,
    collaborators: [],
    created_at: "2026-01-05",
  },
  {
    id: "4",
    title: "Summer Vibes Remix",
    type: "single",
    status: "released",
    progress: 100,
    release_date: "2025-08-15",
    budget: 800,
    spent: 750,
    collaborators: ["DJ Spin", "Vocalist Ana"],
    streams: 45230,
    created_at: "2025-06-01",
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status !== "released" && p.status !== "idea").length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    totalStreams: projects.reduce((sum, p) => sum + (p.streams || 0), 0),
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your music projects and releases
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Music className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Radio className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalStreams.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Streams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "idea", "writing", "recording", "mixing", "mastering", "artwork", "distribution", "released"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery ? "Try a different search term" : "Create your first project to get started"}
              </p>
              {!searchQuery && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const TypeIcon = typeIcons[project.type] || FolderOpen
              const budgetPercent = project.budget > 0 ? (project.spent / project.budget) * 100 : 0

              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="capitalize">{project.type}</CardDescription>
                        </div>
                      </div>
                      <Badge className={statusColors[project.status]}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {project.release_date && (
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(project.release_date).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                      </div>
                      {project.collaborators.length > 0 && (
                        <div className="flex items-center text-muted-foreground col-span-2">
                          <Users className="h-4 w-4 mr-1" />
                          {project.collaborators.join(", ")}
                        </div>
                      )}
                      {project.streams !== undefined && project.streams > 0 && (
                        <div className="flex items-center text-green-600 col-span-2">
                          <Radio className="h-4 w-4 mr-1" />
                          {project.streams.toLocaleString()} streams
                        </div>
                      )}
                    </div>

                    {/* Budget Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Budget Used</span>
                        <span className={budgetPercent > 90 ? "text-red-500" : "text-muted-foreground"}>
                          {budgetPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${budgetPercent > 90 ? "bg-red-500" : "bg-green-500"}`}
                          style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
