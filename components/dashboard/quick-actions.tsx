"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Calendar, DollarSign, FileText, Music } from "lucide-react"

const quickActions = [
  {
    title: "New Project",
    description: "Start a new music project",
    icon: Plus,
    href: "/projects/new",
    color: "bg-blue-500"
  },
  {
    title: "Upload Content",
    description: "Add new tracks or assets",
    icon: Upload,
    href: "/content/upload",
    color: "bg-green-500"
  },
  {
    title: "Schedule Event",
    description: "Add to your calendar",
    icon: Calendar,
    href: "/calendar/new",
    color: "bg-purple-500"
  },
  {
    title: "Log Expense",
    description: "Track your spending",
    icon: DollarSign,
    href: "/finances/expense",
    color: "bg-red-500"
  },
  {
    title: "Create Campaign",
    description: "Launch marketing campaign",
    icon: FileText,
    href: "/marketing/new",
    color: "bg-orange-500"
  },
  {
    title: "Book Studio",
    description: "Reserve recording time",
    icon: Music,
    href: "/calendar/studio",
    color: "bg-indigo-500"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-3 lg:p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 group"
              asChild
            >
              <a href={action.href}>
                <div className={`p-2 rounded-md ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left w-full">
                  <div className="font-medium text-xs lg:text-sm truncate">{action.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {action.description}
                  </div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}