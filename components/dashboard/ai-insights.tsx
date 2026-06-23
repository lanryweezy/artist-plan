"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Target, Lightbulb, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { getDashboardActionItems, getGeneralAdvice } from "@/services/gemini"

interface AIInsight {
  id: string
  type: "marketing" | "financial" | "project" | "content"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  category: string
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [focusToday, setFocusToday] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get focus for today from real AI
      const focus = await getDashboardActionItems({
        upcomingTasks: [
          { title: "Finalize EP artwork", dueDate: "2026-02-20", status: "In Progress" },
          { title: "Submit to Spotify editorial", dueDate: "2026-01-25", status: "Todo" },
        ],
        activeProjects: [
          { name: "Midnight Dreams EP", status: "Recording" },
          { name: "City Lights Single", status: "Mastering" },
        ],
        financialsSummary: "Monthly income: $5,410, Expenses: $1,879, Net: $3,531",
        unreviewedLyricsCount: 2,
      })

      setFocusToday(focus)

      // Generate contextual insights
      const marketingAdvice = await getGeneralAdvice(
        "What are the top 3 marketing actions for an independent Afrobeats artist this week?",
        "Artist has 45K streams, active on Instagram and TikTok, releasing EP in March"
      )

      const financialAdvice = await getGeneralAdvice(
        "What financial adjustments should an independent musician making $5K/month consider?",
        "Spending 35% on production, 10% on marketing, has 2 active projects"
      )

      const parsedInsights: AIInsight[] = [
        {
          id: "1",
          type: "marketing",
          title: "AI Marketing Insight",
          description: marketingAdvice.substring(0, 200) + "...",
          confidence: 85,
          impact: "high",
          category: "Marketing Strategy",
        },
        {
          id: "2",
          type: "financial",
          title: "Budget Optimization",
          description: financialAdvice.substring(0, 200) + "...",
          confidence: 88,
          impact: "medium",
          category: "Financial Health",
        },
        {
          id: "3",
          type: "project",
          title: "Focus Priority",
          description: focus.substring(0, 200) + "...",
          confidence: 92,
          impact: "high",
          category: "Task Management",
        },
      ]

      setInsights(parsedInsights)
    } catch (err) {
      console.error("Failed to generate AI insights:", err)
      setError(err instanceof Error ? err.message : "Failed to load AI insights")

      // Fallback to static insights
      setInsights([
        {
          id: "1",
          type: "marketing",
          title: "Release Timing",
          description: "Friday releases get 23% more playlist placements. Consider scheduling your release accordingly.",
          confidence: 87,
          impact: "high",
          category: "Release Strategy",
        },
        {
          id: "2",
          type: "financial",
          title: "Budget Split",
          description: "Industry standard: 25% production, 30% marketing, 15% content, 15% live, 10% savings.",
          confidence: 90,
          impact: "medium",
          category: "Budget Analysis",
        },
        {
          id: "3",
          type: "project",
          title: "Task Priority",
          description: "Focus on blocking tasks first - artwork and distribution setup are often bottlenecks.",
          confidence: 85,
          impact: "high",
          category: "Project Management",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateInsights()
  }, [])

  const getTypeIcon = (type: AIInsight["type"]) => {
    const icons = { marketing: TrendingUp, financial: Target, project: Lightbulb, content: Sparkles }
    return icons[type]
  }

  const getTypeColor = (type: AIInsight["type"]) => {
    const colors = { marketing: "bg-purple-500", financial: "bg-green-500", project: "bg-blue-500", content: "bg-orange-500" }
    return colors[type]
  }

  const getImpactColor = (impact: AIInsight["impact"]) => {
    const colors = { low: "text-gray-600", medium: "text-yellow-600", high: "text-green-600" }
    return colors[impact]
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Insights
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={generateInsights} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={generateInsights}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Focus for Today */}
            {focusToday && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                <p className="text-xs font-medium text-purple-700 mb-1">Focus for Today</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                  {focusToday}
                </p>
              </div>
            )}

            {/* Insights */}
            {insights.map((insight) => {
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
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{insight.category}</span>
                          <span className={`text-xs font-medium capitalize ${getImpactColor(insight.impact)}`}>
                            {insight.impact} impact
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Apply <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <Button variant="outline" className="w-full" size="sm" onClick={generateInsights}>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
