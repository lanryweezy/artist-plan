import { GoogleGenerativeAI } from "@google/generative-ai"
import { AI_SYSTEM_PROMPT, searchKnowledgeBase } from "@/lib/knowledge-base"

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

if (!API_KEY) {
  console.warn("NEXT_PUBLIC_GEMINI_API_KEY not set. AI features will use fallback.")
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null
const MODEL = "gemini-2.0-flash"

const getModel = () => {
  if (!genAI) throw new Error("Gemini API key not configured")
  return genAI.getGenerativeModel({ model: MODEL })
}

const handleError = (error: unknown, service: string): Error => {
  console.error(`AI Error (${service}):`, error)
  const msg = error instanceof Error ? error.message : String(error)
  return new Error(`AI Error: ${msg}`)
}

// ========== DASHBOARD AI ==========

export const getDashboardActionItems = async (data: {
  upcomingTasks: { title: string; dueDate: string; status: string }[]
  activeProjects: { name: string; status: string }[]
  financialsSummary?: string
}): Promise<string> => {
  const prompt = `${AI_SYSTEM_PROMPT}

You are an AI career coach for an independent musician.
Provide a "Focus for Today" with 1-3 critical actions.

Tasks: ${data.upcomingTasks.map((t) => `${t.title} (Due: ${t.dueDate})`).join(", ") || "None"}
Projects: ${data.activeProjects.map((p) => `${p.name} (${p.status})`).join(", ") || "None"}
Financials: ${data.financialsSummary || "No summary"}

Consider the music business context — are there registrations missing? Revenue opportunities? Career-building actions?`

  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "DashboardActionItems")
  }
}

// ========== TASK AI ==========

export const getTaskSuggestions = async (goal: string): Promise<string> => {
  const prompt = `You are an AI task manager for musicians.
Goal: "${goal}"
Suggest 3-5 actionable tasks, one per line starting with "TASK:".`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "TaskSuggestions")
  }
}

// ========== AGENTIC PLANNER ==========

export const getAgenticPlan = async (goal: string, context: string): Promise<any> => {
  const prompt = `You are an expert music career planner.
Goal: "${goal}"
Context: ${context}

Return JSON:
{
  "project": { "name": "...", "description": "...", "type": "...", "milestones": [{ "name": "...", "targetDate": "YYYY-MM-DD" }] },
  "tasks": [{ "name": "...", "description": "...", "priority": "High/Medium/Low", "dueDate": "YYYY-MM-DD" }]
}`
  try {
    const result = await getModel().generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim())
  } catch (e) {
    throw handleError(e, "AgenticPlan")
  }
}

// ========== MARKETING AI ==========

export const getMarketingRecommendations = async (context: string): Promise<string> => {
  const prompt = `You are a music marketing expert.
Context: ${context}
Generate 5-7 actionable, creative marketing strategies.`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "MarketingRecommendations")
  }
}

export const getAIMarketingCopy = async (data: {
  subject: string
  details: string
  audience: string
  type: "social_media_post" | "email_subject" | "ad_copy" | "bio_snippet"
  tone?: string
}): Promise<string> => {
  let prompt = `You are an AI Music Marketer. Promote: "${data.subject}". Details: ${data.details}. Audience: ${data.audience}. Tone: ${data.tone || "Engaging"}.`
  switch (data.type) {
    case "social_media_post":
      prompt += " Generate 2-3 social media posts with emojis and hashtags."
      break
    case "email_subject":
      prompt += " Generate 5 catchy email subject lines."
      break
    case "ad_copy":
      prompt += " Generate 2 ad copy variations."
      break
    case "bio_snippet":
      prompt += " Craft a compelling artist bio snippet."
      break
  }
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "MarketingCopy")
  }
}

// ========== RELEASE AI ==========

export const getReleaseTimingRecommendations = async (data: {
  releaseType: string
  genre: string
  fanbaseSize: string
  marketing: string
}): Promise<string> => {
  const prompt = `You are an expert music release strategist.
Release: ${data.releaseType}, Genre: ${data.genre}, Fanbase: ${data.fanbaseSize}, Marketing: ${data.marketing}
Recommend 3-5 optimal release timings with rationale.`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "ReleaseTiming")
  }
}

// ========== TOUR AI ==========

export const getTourManagementAdvice = async (data: {
  query: string
  genre?: string
  budget?: string
}): Promise<string> => {
  const prompt = `You are an AI Tour Manager. Query: "${data.query}"
${data.genre ? `Genre: ${data.genre}` : ""} ${data.budget ? `Budget: ${data.budget}` : ""}
Provide practical advice on routing, budgeting, promotion, logistics.`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "TourAdvice")
  }
}

// ========== BRAND AI ==========

export const generateEPKBiography = async (profile: {
  mission?: string
  values?: string[]
  archetype?: string
  voice?: string[]
  audience?: string
  usp?: string
}): Promise<{ shortBio: string; longBio: string }> => {
  const prompt = `Based on this artist profile, generate a short bio (2-3 sentences) and long bio (2-3 paragraphs).
Mission: ${profile.mission || "N/A"}
Values: ${profile.values?.join(", ") || "N/A"}
Audience: ${profile.audience || "N/A"}
USP: ${profile.usp || "N/A"}

Return JSON: { "shortBio": "...", "longBio": "..." }`
  try {
    const result = await getModel().generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim())
  } catch (e) {
    throw handleError(e, "EPKBiography")
  }
}

// ========== FINANCIAL AI ==========

export const getFinancialAdvice = async (topic: string, context?: string): Promise<string> => {
  const prompt = `You are a financial advisor for musicians. Topic: "${topic}"
${context ? `Context: "${context}"` : ""}
Provide practical advice. Include disclaimer: AI, not certified advisor.`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "FinancialAdvice")
  }
}

// ========== CONTENT AI ==========

export const getAILyricsFeedback = async (lyrics: string): Promise<string> => {
  const prompt = `${AI_SYSTEM_PROMPT}

You are an AI Songwriting Coach. Analyze these lyrics:
---
${lyrics}
---
Provide specific feedback on structure, emotion, imagery, and marketability. Consider how these lyrics would perform in the current music landscape where AI can generate music — what makes these HUMAN and authentic?`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "LyricsFeedback")
  }
}

export const getRhymeSuggestions = async (word: string, type: "rhyme" | "synonym" | "related"): Promise<string[]> => {
  let prompt = `Songwriting assistant. Word: "${word}". Type: ${type}.`
  if (type === "rhyme") prompt += " Provide 10-15 rhyming words."
  else if (type === "synonym") prompt += " Provide 5-10 synonyms."
  else prompt += " Provide 5-10 related words."
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text().split("\n").map((l) => l.replace(/^[-*+~]\s*/, "").trim()).filter(Boolean)
  } catch (e) {
    throw handleError(e, "RhymeSuggestions")
  }
}

// ========== GENERAL AI ==========

export const getGeneralAdvice = async (topic: string, context?: string): Promise<string> => {
  const relevantKnowledge = searchKnowledgeBase(topic)
  const knowledgeContext = relevantKnowledge.length > 0
    ? `\n\nRelevant knowledge from music business handbooks:\n${relevantKnowledge.map(k => `- ${k.topic}: ${k.content.substring(0, 200)}...`).join("\n")}`
    : ""

  const prompt = `${AI_SYSTEM_PROMPT}

User question: "${topic}"
${context ? `Context: "${context}"` : ""}
${knowledgeContext}

Provide practical, actionable advice based on your music industry knowledge. Reference specific concepts when relevant.`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "GeneralAdvice")
  }
}

export const getArtistPlan = async (data: Record<string, any>): Promise<string> => {
  const prompt = `You are an expert artist career coach.
Onboarding answers: ${JSON.stringify(data, null, 2)}
Generate a personalized plan with milestones, weekly goals, and action items.`
  try {
    const result = await getModel().generateContent(prompt)
    return result.response.text()
  } catch (e) {
    throw handleError(e, "ArtistPlan")
  }
}
