import { GoogleGenerativeAI } from "@google/generative-ai"
import { supabase } from "./supabase"
import { aiActions, type AIAction } from "./ai-actions"

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

interface AgentStep {
  action: AIAction
  params: Record<string, any>
  reasoning: string
}

interface AgentResult {
  success: boolean
  steps: { action: string; result: string; success: boolean }[]
  summary: string
  error?: string
}

// Execute a single action
async function executeAction(action: AIAction, params: Record<string, any>, userId: string): Promise<string> {
  switch (action) {
    case "createProject": {
      const { data, error } = await supabase
        .from("projects")
        .insert({ user_id: userId, ...params, progress: 0, spent: 0, collaborators: [], streams: 0 })
        .select()
        .single()
      if (error) throw error
      return `Created project "${data.title}" (${data.type}) with ID: ${data.id}`
    }

    case "updateProject": {
      const { id, ...updates } = params
      const { error } = await supabase.from("projects").update(updates).eq("id", id)
      if (error) throw error
      return `Updated project ${id}`
    }

    case "createTask": {
      const { data, error } = await supabase
        .from("tasks")
        .insert({ user_id: userId, status: "todo", ...params })
        .select()
        .single()
      if (error) throw error
      return `Created task "${data.title}" with ID: ${data.id}`
    }

    case "createMultipleTasks": {
      const tasks = params.tasks.map((t: any) => ({
        user_id: userId,
        status: "todo",
        ...t,
      }))
      const { data, error } = await supabase.from("tasks").insert(tasks).select()
      if (error) throw error
      return `Created ${data.length} tasks`
    }

    case "updateTask": {
      const { id, ...updates } = params
      const { error } = await supabase.from("tasks").update(updates).eq("id", id)
      if (error) throw error
      return `Updated task ${id}`
    }

    case "addIncome": {
      const { data, error } = await supabase
        .from("finances")
        .insert({ user_id: userId, type: "income", date: new Date().toISOString().split("T")[0], ...params })
        .select()
        .single()
      if (error) throw error
      return `Recorded income: $${params.amount} from ${params.description}`
    }

    case "addExpense": {
      const { data, error } = await supabase
        .from("finances")
        .insert({ user_id: userId, type: "expense", date: new Date().toISOString().split("T")[0], ...params })
        .select()
        .single()
      if (error) throw error
      return `Recorded expense: $${params.amount} for ${params.description}`
    }

    case "createEvent": {
      const { data, error } = await supabase
        .from("events")
        .insert({ user_id: userId, ...params })
        .select()
        .single()
      if (error) throw error
      return `Created event "${data.title}" on ${data.date}`
    }

    case "addContent": {
      const { data, error } = await supabase
        .from("content")
        .insert({ user_id: userId, version: 1, ...params })
        .select()
        .single()
      if (error) throw error
      return `Added content "${data.title}"`
    }

    case "createTour": {
      const { data, error } = await supabase
        .from("tours")
        .insert({ user_id: userId, status: "planning", venues: [], ...params })
        .select()
        .single()
      if (error) throw error
      return `Created tour "${data.name}"`
    }

    case "addBrandAsset": {
      const { data, error } = await supabase
        .from("brand")
        .insert({ user_id: userId, is_primary: false, ...params })
        .select()
        .single()
      if (error) throw error
      return `Added brand asset "${data.name}"`
    }

    case "createCampaign": {
      const { data, error } = await supabase
        .from("campaigns")
        .insert({ user_id: userId, status: "draft", spent: 0, ...params })
        .select()
        .single()
      if (error) throw error
      return `Created campaign "${data.name}"`
    }

    case "analyzeFinances": {
      const { data: finances } = await supabase
        .from("finances")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(50)

      const totalIncome = finances?.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0) || 0
      const totalExpenses = finances?.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0) || 0
      return `Financial analysis: Income $${totalIncome}, Expenses $${totalExpenses}, Net $${totalIncome - totalExpenses}`
    }

    case "generateReleasePlan":
    case "generateMarketingPlan": {
      return "AI-generated plan (use getGeneralAdvice for detailed recommendations)"
    }

    default:
      return `Action "${action}" completed`
  }
}

// Main agent function
export async function runAgent(
  userGoal: string,
  userId: string,
  context?: { projects?: any[]; tasks?: any[]; finances?: any[] }
): Promise<AgentResult> {
  if (!genAI) {
    return { success: false, steps: [], summary: "", error: "Gemini API key not configured" }
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  // Build context for the AI
  const contextStr = context
    ? `
Current state:
- Projects: ${context.projects?.length || 0} (${context.projects?.map((p: any) => p.title).join(", ") || "none"})
- Tasks: ${context.tasks?.length || 0} (${context.tasks?.filter((t: any) => t.status !== "done").length || 0} active)
- Recent finances: ${context.finances?.slice(0, 5).map((f: any) => `${f.type}: $${f.amount}`).join(", ") || "none"}
`
    : ""

  // Ask Gemini to plan the actions
  const planningPrompt = `You are an AI agent for a music career management app.
The user wants: "${userGoal}"
${contextStr}

Available actions you can take:
${Object.entries(aiActions)
  .map(([name, desc]) => `- ${name}: ${desc.description}`)
  .join("\n")}

Plan the steps needed to accomplish this goal. Return a JSON array of steps:
[
  {
    "action": "actionName",
    "params": { "param1": "value1" },
    "reasoning": "Why this step is needed"
  }
]

Rules:
- Use realistic values based on the context
- For dates, use YYYY-MM-DD format starting from today
- Only use actions from the list above
- If the goal is advice-only (no actions needed), return an empty array []
- Return ONLY the JSON array, no other text`

  try {
    const result = await model.generateContent(planningPrompt)
    const responseText = result.response.text()

    // Parse the planned steps
    const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
    const steps: AgentStep[] = JSON.parse(cleaned)

    if (!Array.isArray(steps) || steps.length === 0) {
      return {
        success: true,
        steps: [],
        summary: "No actions needed - this was an advice-only request.",
      }
    }

    // Execute each step
    const executedSteps: AgentResult["steps"] = []

    for (const step of steps) {
      try {
        const result = await executeAction(step.action, step.params, userId)
        executedSteps.push({ action: step.action, result, success: true })
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Action failed"
        executedSteps.push({ action: step.action, result: msg, success: false })
      }
    }

    const successCount = executedSteps.filter((s) => s.success).length
    const failCount = executedSteps.filter((s) => !s.success).length

    return {
      success: failCount === 0,
      steps: executedSteps,
      summary: `Completed ${successCount}/${executedSteps.length} actions${failCount > 0 ? ` (${failCount} failed)` : ""}.`,
    }
  } catch (err) {
    return {
      success: false,
      steps: [],
      summary: "",
      error: err instanceof Error ? err.message : "Agent failed",
    }
  }
}

// Chat with context (conversational agent)
export async function agentChat(
  message: string,
  userId: string,
  history: { role: string; content: string }[]
): Promise<{ response: string; actions?: AgentResult }> {
  if (!genAI) {
    return { response: "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to .env.local" }
  }

  // Check if the user wants to execute actions
  const lower = message.toLowerCase()
  const actionKeywords = ["create", "add", "set up", "make", "schedule", "record", "plan", "build"]
  const wantsAction = actionKeywords.some((kw) => lower.includes(kw))

  if (wantsAction) {
    // Fetch current state for context
    const [projects, tasks, finances] = await Promise.all([
      supabase.from("projects").select("*").eq("user_id", userId).then((r) => r.data || []),
      supabase.from("tasks").select("*").eq("user_id", userId).then((r) => r.data || []),
      supabase.from("finances").select("*").eq("user_id", userId).order("date", { ascending: false }).limit(20).then((r) => r.data || []),
    ])

    const agentResult = await runAgent(message, userId, { projects, tasks, finances })

    // Generate a natural language summary
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const summaryPrompt = `You just executed these actions for a musician:
${agentResult.steps.map((s) => `- ${s.action}: ${s.result} (${s.success ? "success" : "failed"})`).join("\n")}

Write a brief, friendly summary of what was done. Be conversational.`

    const summaryResult = await model.generateContent(summaryPrompt)

    return {
      response: summaryResult.response.text(),
      actions: agentResult,
    }
  }

  // Regular chat (no actions)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  const chat = model.startChat({
    history: history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    })),
    systemInstruction: "You are Artist Plan AI, a career assistant for independent musicians. Be concise, practical, and actionable.",
  })

  const result = await chat.sendMessage(message)
  return { response: result.response.text() }
}
