"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Sparkles,
  Music,
  TrendingUp,
  Calendar,
  DollarSign,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { agentChat } from "@/services/agent"
import { getGeneralAdvice } from "@/services/gemini"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  error?: boolean
  actions?: { action: string; result: string; success: boolean }[]
}

const DEMO_USER_ID = "demo-user-001"

const suggestedPrompts = [
  { icon: Music, label: "Release EP", prompt: "I want to release my EP next month. Create a project and tasks for it." },
  { icon: TrendingUp, label: "Marketing Plan", prompt: "Create a marketing campaign for my new single on Instagram and TikTok." },
  { icon: DollarSign, label: "Record Income", prompt: "I just earned $500 from a live show. Record this income." },
  { icon: Calendar, label: "Schedule Session", prompt: "Schedule a recording session for tomorrow at 2pm." },
  { icon: Zap, label: "Full Release Setup", prompt: "Set up everything for my album release: project, tasks, calendar events, and marketing plan." },
  { icon: Music, label: "Lyrics Help", prompt: "Give me rhyme suggestions for the word 'night'." },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI career assistant. I can **talk** and **act**.\n\n💬 **Ask me anything** about your music career\n⚡ **Tell me to do things** and I'll execute them:\n\n• \"Create a project for my EP\"\n• \"Record $500 income from streaming\"\n• \"Schedule a studio session tomorrow\"\n• \"Set up a marketing campaign\"\n• \"Create tasks for my release\"\n\nI can plan, create, and manage your career - just tell me what you want!",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setError(null)

    try {
      // Try agentic mode first
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const result = await agentChat(content, DEMO_USER_ID, history)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
        actions: result.actions?.steps,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      // Fallback to regular AI chat
      try {
        const response = await getGeneralAdvice(content, "Independent musician")
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response,
            timestamp: new Date(),
          },
        ])
      } catch (fallbackErr) {
        const msg = err instanceof Error ? err.message : "Something went wrong"
        setError(msg)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `Error: ${msg}`,
            timestamp: new Date(),
            error: true,
          },
        ])
      }
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Career Agent</h1>
              <p className="text-sm text-muted-foreground">Powered by Gemini • Can chat AND take actions</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`p-2 rounded-full shrink-0 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"}`}>
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : message.error ? "bg-red-50 border border-red-200" : "bg-muted"}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{message.content}</div>

                  {/* Action results */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-1 border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Actions executed:</p>
                      {message.actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {action.success ? (
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                          )}
                          <span className="text-muted-foreground">{action.action}:</span>
                          <span>{action.result}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full text-white shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking & executing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Try these agent commands:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <Button key={p.label} variant="outline" size="sm" onClick={() => handleSend(p.prompt)} disabled={isTyping} className="flex items-center gap-2">
                  <p.icon className="h-4 w-4" />
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue) }} className="flex space-x-2">
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask or tell me to do something..." disabled={isTyping} className="flex-1" />
            <Button type="submit" disabled={isTyping || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
