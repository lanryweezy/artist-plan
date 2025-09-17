"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Target, Lightbulb, ArrowRight } from "lucide-react"

interface AIInsight {
  id: string
  type: "marketing" | "financial" | "project" | "content"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  actionable: boolean
  category: string
}

// Mock data - in real app this would come from AI service
const mockInsights: AIInsight[] = [
  {
    id: "1",
    type: "marketing",
    title: "Optimal Release Timing",
    description: "Friday releases get 23% more streams in your genre. Consider scheduling your EP for December 15th.",
    confidence: 87,
    impact: "high",
    actionable: true,
    category: "Release Strategy"
  },
  {
    id: "2",
    type: "financial",
    title: "Budget Optimization",
    description: "You're spending 40% more on marketing than similar artists. Consider reallocating $300 to content creation.",
    confidence: 92,
    impact: "medium",
    actionable: true,
    category: "Budget Analysis"
  },
  {
    id: "3",
    type: "project",
    title: "Task Prioritization",
    description: "Focus on artwork completion first - it's blocking 3 other tasks in your release timeline.",
    confidence: 95,
    impact: "high",
    actionable: true,
    category: "Project Management"
  },
  {
    id: "4",
    type: "content",
    title: "Content Gap Analysis",
    description: "Your social media engagement drops 60% on weekends. Create more weekend-friendly content.",
    confidence: 78,
    impact: "medium",
    actionable: true,
    category: "Content Strategy"
  }
]

const getTypeIcon = (type: AIInsight["type"]) => {
  const icons = {
    marketing: TrendingUp,
    financial: Target,
    project: Lightbulb,
    content: Sparkles
  }
  return icons[type]
}

const getTypeColor = (type: AIInsight["type"]) => {
  const colors = {
    marketing: "bg-purple-500",
    financial: "bg-green-500",
    project: "bg-blue-500",
    content: "bg-orange-500"
  }
  return colors[type]
}

const getImpactColor = (impact: AIInsight["impact"]) => {
  const colors = {
    low: "text-gray-600",
    medium: "text-yellow-600",
    high: "text-green-600"
  }
  return colors[impact]
}

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInsights.slice(0, 3).map((insight) => {
            const Icon = getTypeIcon(insight.type)
            
            return (
              <div key={insight.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-md ${getTypeColor(insight.type)}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {insight.category}
                        </span>
                        <span className={`text-xs font-medium capitalize ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      {insight.actionable && (
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Apply
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          
          <Button variant="outline" className="w-full" size="sm">
            View All Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}