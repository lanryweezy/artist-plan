"use client"

import { useState, useCallback } from "react"
import { GoogleGenAI } from "@google/genai"

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null
const MODEL = "gemini-2.5-flash"

interface AIState {
  isLoading: boolean
  error: string | null
  response: string | null
}

export function useAI() {
  const [state, setState] = useState<AIState>({
    isLoading: false,
    error: null,
    response: null,
  })

  const generate = useCallback(async (prompt: string, options?: { temperature?: number }) => {
    if (!ai) {
      setState({ isLoading: false, error: "Gemini API key not configured", response: null })
      return null
    }

    setState({ isLoading: true, error: null, response: null })

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { temperature: options?.temperature ?? 0.7 },
      })

      const text = response.text || ""
      setState({ isLoading: false, error: null, response: text })
      return text
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed"
      setState({ isLoading: false, error: message, response: null })
      return null
    }
  }, [])

  const generateJSON = useCallback(async (prompt: string, options?: { temperature?: number }) => {
    if (!ai) {
      setState({ isLoading: false, error: "Gemini API key not configured", response: null })
      return null
    }

    setState({ isLoading: true, error: null, response: null })

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          temperature: options?.temperature ?? 0.7,
          responseMimeType: "application/json",
        },
      })

      const text = response.text || "{}"
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setState({ isLoading: false, error: null, response: JSON.stringify(parsed) })
      return parsed
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed"
      setState({ isLoading: false, error: message, response: null })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, response: null })
  }, [])

  return {
    ...state,
    generate,
    generateJSON,
    reset,
  }
}
