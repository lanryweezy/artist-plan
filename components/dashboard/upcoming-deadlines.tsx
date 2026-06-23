"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface Deadline {
  id: string
  title: string
  type: "task" | "project" | "event" | "release"
  dueDate: Date
  priority: "low" | "medium" | "high" | "urgent"
  project?: string
  status: "pending" | "in-progress" | "overdue"
}

// Mock data - in real app this would come from API
const mockDeadlines: Deadline[] = [
  {
    id: "1",
    title: "Final mix approval",
    type: "task",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    priority: "urgent",
    project: "Winter EP Release",
    status: "pending"
  },
  {
    id: "2",
    title: "Music video shoot",
    type: "event",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: "high",
    project: "Music Video Production",
    status: "pending"
  },
  {
    id: "3",
    title: "Album artwork delivery",
    type: "task",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: "medium",
    project: "Winter EP Release",
    status: "in-progress"
  },
  {
    id: "4",
    title: "Streaming platform submission",
    type: "release",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    priority: "high",
    project: "Winter EP Release",
    status: "pending"
  },
  {
    id: "5",
    title: "Social media campaign launch",
    type: "event",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    priority: "medium",
    project: "Winter EP Release",
    status: "pending"
  }
]

const getPriorityColor = (priority: Deadline["priority"]) => {
  const colors = {
    low: "bg-gray-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  }
  return colors[priority]
}

const getTypeIcon = (type: Deadline["type"]) => {
  const icons = {
    task: Clock,
    project: Calendar,
    event: Calendar,
    release: AlertTriangle
  }
  return icons[type]
}

const getStatusColor = (status: Deadline["status"]) => {
  const colors = {
    pending: "text-muted-foreground",
    "in-progress": "text-blue-600",
    overdue: "text-red-600"
  }
  return colors[status]
}

export function UpcomingDeadlines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDeadlines.map((deadline) => {
            const Icon = getTypeIcon(deadline.type)
            const isOverdue = deadline.dueDate < new Date()
            const daysUntil = Math.ceil((deadline.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            
            return (
              <div key={deadline.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-md ${getPriorityColor(deadline.priority)}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{deadline.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${isOverdue ? 'border-red-500 text-red-600' : ''}`}
                    >
                      {isOverdue ? 'Overdue' : `${daysUntil}d`}
                    </Badge>
                  </div>
                  {deadline.project && (
                    <p className="text-xs text-muted-foreground">
                      {deadline.project}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {format(deadline.dueDate, 'MMM d, yyyy')}
                    </p>
                    <span className={`text-xs capitalize ${getStatusColor(deadline.status)}`}>
                      {deadline.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}