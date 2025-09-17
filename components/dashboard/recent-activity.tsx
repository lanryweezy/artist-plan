"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "task" | "financial" | "content" | "project"
  title: string
  description: string
  timestamp: Date
  user?: string
}

// Mock data - in real app this would come from API
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "task",
    title: "Completed mixing for Track 3",
    description: "Final mix approved and ready for mastering",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: "You"
  },
  {
    id: "2",
    type: "financial",
    title: "Streaming royalties received",
    description: "$247.83 from Spotify for October",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    type: "content",
    title: "New artwork uploaded",
    description: "Album cover variations added to content library",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user: "Designer"
  },
  {
    id: "4",
    type: "project",
    title: "EP Release project updated",
    description: "Timeline adjusted for December release",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: "You"
  }
]

const getActivityIcon = (type: ActivityItem["type"]) => {
  const icons = {
    task: "T",
    financial: "$",
    content: "C",
    project: "P"
  }
  return icons[type]
}

const getActivityColor = (type: ActivityItem["type"]) => {
  const colors = {
    task: "bg-blue-500",
    financial: "bg-green-500",
    content: "bg-purple-500",
    project: "bg-orange-500"
  }
  return colors[type]
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={`text-white text-xs ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">{activity.title}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
                {activity.user && (
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}