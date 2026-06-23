"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  FolderOpen,
  MoreVertical,
  Trash2,
  Edit,
  Filter,
  SortAsc,
  GripVertical
} from "lucide-react"

interface Task {
  id: string
  title: string
  project: string
  dueDate: string
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  description?: string
}

const mockTasks: Task[] = [
  { id: "1", title: "Finalize EP artwork", project: "Midnight Dreams", dueDate: "2026-02-20", status: "in_progress", priority: "high", description: "Work with designer on final cover art" },
  { id: "2", title: "Submit to Spotify editorial", project: "City Lights", dueDate: "2026-01-25", status: "todo", priority: "high", description: "Submit 4 weeks before release" },
  { id: "3", title: "Record vocal ad-libs", project: "Midnight Dreams", dueDate: "2026-02-01", status: "todo", priority: "medium" },
  { id: "4", title: "Mix track 3 - Sunset", project: "Midnight Dreams", dueDate: "2026-02-10", status: "review", priority: "medium", description: "Send to mixing engineer" },
  { id: "5", title: "Create TikTok teaser", project: "City Lights", dueDate: "2026-01-18", status: "done", priority: "low" },
  { id: "6", title: "Update EPK", project: "General", dueDate: "2026-02-15", status: "todo", priority: "low" },
  { id: "7", title: "Book studio time", project: "Street Stories", dueDate: "2026-03-01", status: "todo", priority: "medium" },
  { id: "8", title: "Design merch mockups", project: "Merch", dueDate: "2026-02-28", status: "in_progress", priority: "low" },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  todo: { label: "To Do", color: "bg-gray-100 text-gray-800", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  review: { label: "Review", color: "bg-yellow-100 text-yellow-800", icon: Search },
  done: { label: "Done", color: "bg-green-100 text-green-800", icon: CheckCircle },
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", project: "", dueDate: "", priority: "medium", description: "" })

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    completionRate: Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100),
  }

  const handleAddTask = () => {
    if (!newTask.title) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      project: newTask.project || "General",
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      status: "todo",
      priority: newTask.priority as Task["priority"],
      description: newTask.description,
    }
    setTasks((prev) => [...prev, task])
    setNewTask({ title: "", project: "", dueDate: "", priority: "medium", description: "" })
    setShowAddDialog(false)
  }

  const handleStatusChange = (id: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks across all projects
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a task to your workflow</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Task Title</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Finalize artwork"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project</Label>
                    <Input
                      value={newTask.project}
                      onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                      placeholder="e.g., Midnight Dreams"
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Priority</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Input
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Additional details..."
                  />
                </div>
                <Button onClick={handleAddTask} className="w-full">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
              <p className="text-xs text-muted-foreground">To Do</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{stats.done}</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
              <Progress value={stats.completionRate} className="h-1.5 mt-2" />
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
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "todo", "in_progress", "review", "done"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status === "all" ? "All" : statusConfig[status]?.label || status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["todo", "in_progress", "review", "done"].map((status) => {
            const config = statusConfig[status]
            const statusTasks = filteredTasks.filter((t) => t.status === status)
            const Icon = config.icon

            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <h3 className="font-semibold">{config.label}</h3>
                    <Badge variant="secondary">{statusTasks.length}</Badge>
                  </div>
                </div>

                {statusTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {task.project}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {status !== "todo" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                              const prevStatus = status === "in_progress" ? "todo" : status === "review" ? "in_progress" : "review"
                              handleStatusChange(task.id, prevStatus as Task["status"])
                            }}
                          >
                            ← Back
                          </Button>
                        )}
                        {status !== "done" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                              const nextStatus = status === "todo" ? "in_progress" : status === "in_progress" ? "review" : "done"
                              handleStatusChange(task.id, nextStatus as Task["status"])
                            }}
                          >
                            Forward →
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-red-500 ml-auto"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    No tasks
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
