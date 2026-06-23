import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  console.warn("GEMINI_API_KEY not set")
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" })
const MODEL = "gemini-2.5-flash"

export async function POST(request: NextRequest) {
  try {
    const { prompt, temperature = 0.7, maxTokens = 2048 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    })

    return NextResponse.json({
      text: response.text || "",
      success: true,
    })
  } catch (error) {
    console.error("Gemini API error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message, success: false }, { status: 500 })
  }
}
