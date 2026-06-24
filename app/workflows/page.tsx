"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  Music,
  MapPin,
  Target,
  Users,
  DollarSign,
  FileText
} from "lucide-react"

interface WorkflowDef {
  id: string
  name: string
  description: string
  icon: React.ElementType
  steps: number
  estimatedTime: string
  agents: string[]
}

const workflowDefs: WorkflowDef[] = [
  {
    id: "new-single",
    name: "New Single Release",
    description: "Complete workflow for releasing a single — from registration to marketing",
    icon: Music,
    steps: 4,
    estimatedTime: "15 min",
    agents: ["Release Manager", "Career Advisor", "Marketing Strategist", "Content Creator"],
  },
  {
    id: "tour-prep",
    name: "Tour Preparation",
    description: "Plan budget, marketing, and content for an upcoming tour",
    icon: MapPin,
    steps: 3,
    estimatedTime: "10 min",
    agents: ["Finance Analyst", "Marketing Strategist", "Content Creator"],
  },
  {
    id: "career-review",
    name: "Career Review",
    description: "Comprehensive review of your career health and next steps",
    icon: Target,
    steps: 3,
    estimatedTime: "10 min",
    agents: ["Finance Analyst", "Career Advisor"],
  },
]

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<{ step: string; agent: string; output: string }[]>([])

  const runWorkflow = async (workflowId: string) => {
    setIsRunning(true)
    setSelectedWorkflow(workflowId)
    setResults([])

    // Simulate agent execution
    const workflow = workflowDefs.find(w => w.id === workflowId)
    if (workflow) {
      for (let i = 0; i < workflow.steps; i++) {
        await new Promise(r => setTimeout(r, 800))
        setResults(prev => [...prev, {
          step: `Step ${i + 1}`,
          agent: workflow.agents[i],
          output: `[Demo] ${workflow.agents[i]} is analyzing your request...`,
        }])
      }
    }

    setIsRunning(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Multi-agent workflows that orchestrate AI to complete complex tasks</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {workflowDefs.map(workflow => {
            const Icon = workflow.icon
            return (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{workflow.estimatedTime}</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{workflow.steps} steps</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {workflow.agents.map(agent => (
                      <Badge key={agent} variant="secondary" className="text-xs">{agent}</Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => runWorkflow(workflow.id)}
                    disabled={isRunning}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning && selectedWorkflow === workflow.id ? "Running..." : "Run Workflow"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Workflow Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((result, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{result.step}</Badge>
                    <span className="text-sm font-medium">{result.agent}</span>
                    {!isRunning && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {isRunning && i === results.length - 1 && <Clock className="h-4 w-4 text-yellow-500 animate-spin" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{result.output}</p>
                </div>
              ))}
              {isRunning && (
                <div className="p-3 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 animate-spin inline mr-2" />
                  Next agent is working...
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
