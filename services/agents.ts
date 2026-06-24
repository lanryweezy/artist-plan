// Multi-Agent AI System for Artist Plan
// Inspired by Kreathief's creative agent + critic agent architecture

import { GoogleGenerativeAI } from "@google/generative-ai"
import { knowledgeBase, searchKnowledgeBase, AI_SYSTEM_PROMPT } from "@/lib/knowledge-base"

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

interface AgentConfig {
  name: string
  role: string
  systemPrompt: string
  temperature: number
}

interface AgentResult {
  agent: string
  output: string
  confidence: number
  actions?: string[]
}

// ====== AGENT CONFIGS ======

const agents: Record<string, AgentConfig> = {
  career: {
    name: "Career Advisor",
    role: "Strategic career guidance",
    systemPrompt: `${AI_SYSTEM_PROMPT}

You are a Career Advisor agent. You analyze the artist's current state, goals, and industry trends to recommend strategic next steps.

When advising:
1. Reference the artist's actual data (projects, revenue, fans, registrations)
2. Use knowledge from the music business handbooks
3. Consider AI competition — what can the artist do that AI can't?
4. Prioritize actions that generate revenue or build audience
5. Be specific and actionable, not vague

Response format:
- TOP PRIORITY: [Most important action]
- THIS WEEK: [2-3 specific tasks]
- THIS MONTH: [Strategic goals]`,
    temperature: 0.7,
  },
  marketing: {
    name: "Marketing Strategist",
    role: "Campaign planning and fan growth",
    systemPrompt: `${AI_SYSTEM_PROMPT}

You are a Marketing Strategist agent. You plan release campaigns, content strategies, and fan growth tactics.

When planning:
1. Consider the artist's genre, audience, and current reach
2. Suggest platform-specific content (TikTok vs Instagram vs YouTube)
3. Recommend timing based on release schedules
4. Include budget-conscious strategies for indie artists
5. Reference what's working in the current music landscape

Response format:
- CAMPAIGN: [Campaign name and goal]
- TIMELINE: [Week-by-week plan]
- CONTENT: [Specific content ideas]
- BUDGET: [Estimated costs]`,
    temperature: 0.8,
  },
  finance: {
    name: "Finance Analyst",
    role: "Revenue tracking and optimization",
    systemPrompt: `${AI_SYSTEM_PROMPT}

You are a Finance Analyst agent. You track income, identify revenue opportunities, and optimize the artist's financial health.

When analyzing:
1. Review current income streams and expenses
2. Identify gaps in royalty collection (missing registrations)
3. Suggest revenue diversification strategies
4. Calculate true costs of projects (recording, touring, marketing)
5. Flag any financial red flags

Response format:
- HEALTH: [Overall financial status]
- GAPS: [Missing revenue sources]
- OPPORTUNITIES: [New income ideas]
- ACTION ITEMS: [Specific financial tasks]`,
    temperature: 0.5,
  },
  content: {
    name: "Content Creator",
    role: "Content ideas and creation",
    systemPrompt: `${AI_SYSTEM_PROMPT}

You are a Content Creator agent. You generate content ideas, write copy, and plan content calendars.

When creating:
1. Generate platform-specific content (TikTok, Instagram, YouTube)
2. Write engaging captions and hooks
3. Suggest content that showcases the artist's unique voice
4. Consider what content performs well in the artist's genre
5. Balance promotional content with value-add content

Response format:
- CONTENT IDEA: [Specific content piece]
- PLATFORM: [Where to post]
- CAPTION: [Written copy]
- HASHTAGS: [Relevant tags]
- TIMING: [Best time to post]`,
    temperature: 0.9,
  },
  release: {
    name: "Release Manager",
    role: "Music release planning and execution",
    systemPrompt: `${AI_SYSTEM_PROMPT}

You are a Release Manager agent. You plan and execute music releases from recording to post-release.

When planning a release:
1. Create a timeline with all milestones
2. Identify all registrations needed (ISRC, copyright, PRO, MLC)
3. Plan the single rollout strategy if it's an EP/album
4. Recommend distributor and submission timelines
5. Include marketing and PR milestones

Response format:
- TIMELINE: [Release calendar]
- REGISTRATIONS: [What needs to be registered]
- DISTRIBUTION: [Submit timeline]
- MARKETING: [Promotion plan]`,
    temperature: 0.6,
  },
}

// ====== AGENT RUNNER ======

export async function runAgent(
  agentName: string,
  prompt: string,
  context?: Record<string, any>
): Promise<AgentResult> {
  const agent = agents[agentName]
  if (!agent) throw new Error(`Unknown agent: ${agentName}`)

  if (!genAI) {
    return {
      agent: agent.name,
      output: `[Demo Mode] ${agent.name} would analyze: "${prompt}"\n\nIn production, this agent uses Gemini with the music business knowledge base to provide expert advice.`,
      confidence: 0,
    }
  }

  const relevantKnowledge = searchKnowledgeBase(prompt)
  const knowledgeContext = relevantKnowledge.length > 0
    ? `\n\nRelevant knowledge:\n${relevantKnowledge.map(k => `- ${k.topic}: ${k.content.substring(0, 150)}...`).join("\n")}`
    : ""

  const contextStr = context ? `\n\nArtist Data:\n${JSON.stringify(context, null, 2)}` : ""

  const fullPrompt = `${agent.systemPrompt}${knowledgeContext}${contextStr}

User request: "${prompt}"

Provide your analysis and recommendations.`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(fullPrompt)
    const text = result.response.text()

    return {
      agent: agent.name,
      output: text,
      confidence: 0.85,
    }
  } catch (error) {
    return {
      agent: agent.name,
      output: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      confidence: 0,
    }
  }
}

// ====== MULTI-AGENT ORCHESTRATOR ======

export async function orchestrateAgents(
  task: string,
  context?: Record<string, any>
): Promise<AgentResult[]> {
  const results: AgentResult[] = []

  // Determine which agents to run based on the task
  const taskLower = task.toLowerCase()
  const agentsToRun: string[] = []

  if (taskLower.includes("career") || taskLower.includes("strategy") || taskLower.includes("next step") || taskLower.includes("what should")) {
    agentsToRun.push("career")
  }
  if (taskLower.includes("marketing") || taskLower.includes("campaign") || taskLower.includes("promote") || taskLower.includes("content")) {
    agentsToRun.push("marketing")
  }
  if (taskLower.includes("money") || taskLower.includes("revenue") || taskLower.includes("financ") || taskLower.includes("budget")) {
    agentsToRun.push("finance")
  }
  if (taskLower.includes("content") || taskLower.includes("post") || taskLower.includes("tiktok") || taskLower.includes("caption")) {
    agentsToRun.push("content")
  }
  if (taskLower.includes("release") || taskLower.includes("single") || taskLower.includes("album") || taskLower.includes("ep")) {
    agentsToRun.push("release")
  }

  // Default to career advisor if no specific agent matches
  if (agentsToRun.length === 0) {
    agentsToRun.push("career")
  }

  // Run agents in parallel
  const promises = agentsToRun.map(name => runAgent(name, task, context))
  const agentResults = await Promise.all(promises)

  return agentResults
}

// ====== WORKFLOW ENGINE ======

interface WorkflowStep {
  id: string
  agent: string
  prompt: string
  dependsOn?: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
}

const workflows: Record<string, Workflow> = {
  "new-single": {
    id: "new-single",
    name: "New Single Release",
    description: "Complete workflow for releasing a single",
    steps: [
      { id: "plan", agent: "release", prompt: "Plan the release timeline for my new single including all milestones" },
      { id: "registrations", agent: "career", prompt: "What registrations do I need before releasing a single? Check my current registration status." },
      { id: "marketing", agent: "marketing", prompt: "Create a marketing campaign for my new single release" },
      { id: "content", agent: "content", prompt: "Generate content ideas for the 2 weeks before and after my single release" },
    ],
  },
  "tour-prep": {
    id: "tour-prep",
    name: "Tour Preparation",
    description: "Prepare for an upcoming tour",
    steps: [
      { id: "budget", agent: "finance", prompt: "Create a tour budget breakdown and identify funding gaps" },
      { id: "marketing", agent: "marketing", prompt: "Plan a tour marketing campaign to maximize ticket sales" },
      { id: "content", agent: "content", prompt: "Create tour announcement content for social media" },
    ],
  },
  "career-review": {
    id: "career-review",
    name: "Career Review",
    description: "Comprehensive review of your music career",
    steps: [
      { id: "finance-review", agent: "finance", prompt: "Review my financial health and identify missing revenue streams" },
      { id: "registrations", agent: "career", prompt: "Check all my registrations and identify gaps in royalty collection" },
      { id: "strategy", agent: "career", prompt: "Based on my current state, what are the top 3 strategic actions I should take?" },
    ],
  },
}

export async function runWorkflow(
  workflowId: string,
  context?: Record<string, any>
): Promise<{ step: string; result: AgentResult }[]> {
  const workflow = workflows[workflowId]
  if (!workflow) throw new Error(`Unknown workflow: ${workflowId}`)

  const results: { step: string; result: AgentResult }[] = []

  for (const step of workflow.steps) {
    const result = await runAgent(step.agent, step.prompt, context)
    results.push({ step: step.id, result })
  }

  return results
}

export { agents, workflows }
export type { AgentResult, Workflow, WorkflowStep }
