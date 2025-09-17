"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FolderOpen } from "lucide-react"

interface Project {
  id: string
  name: string
  progress: number
  status: "active" | "completed" | "on-hold"
  dueDate: string
  tasksCompleted: number
  totalTasks: number
}

// Mock data - in real app this would come from API
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Winter EP Release",
    progress: 75,
    status: "active",
    dueDate: "Dec 15, 2024",
    tasksCompleted: 12,
    totalTasks: 16
  },
  {
    id: "2",
    name: "Music Video Production",
    progress: 45,
    status: "active",
    dueDate: "Jan 10, 2025",
    tasksCompleted: 9,
    totalTasks: 20
  },
  {
    id: "3",
    name: "Spring Tour Planning",
    progress: 20,
    status: "active",
    dueDate: "Mar 1, 2025",
    tasksCompleted: 3,
    totalTasks: 15
  }
]

const getStatusColor = (status: Project["status"]) => {
  const colors = {
    active: "bg-blue-500",
    completed: "bg-green-500",
    "on-hold": "bg-yellow-500"
  }
  return colors[status]
}

export function ProjectProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div key={project.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <h4 className="text-sm font-medium truncate">{project.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-white text-xs flex-shrink-0 ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Due {project.dueDate}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Progress value={project.progress} className="h-2 flex-1 mr-3" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{project.tasksCompleted}/{project.totalTasks} tasks completed</span>
                    <span className={`font-medium ${
                      project.progress >= 75 ? 'text-green-600' : 
                      project.progress >= 50 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {project.progress >= 75 ? 'On track' : 
                       project.progress >= 50 ? 'In progress' : 
                       'Needs attention'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}