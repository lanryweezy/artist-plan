"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Sparkles, Music, TrendingUp, DollarSign, Loader2, Bot, User, AlertCircle, Zap, FileText, Target } from "lucide-react"
import { aiAgentChat, aiContractReview, aiContentGeneration, aiReleasePlanning } from "@/services/ai"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date; agent?: string; error?: boolean }

const suggestedPrompts = [
  { icon: Music, label: "Release EP", prompt: "I want to release my EP next month. Create a complete release plan with timeline, registrations, and marketing." },
  { icon: TrendingUp, label: "Marketing Plan", prompt: "Create a marketing campaign for my new single on Instagram and TikTok." },
  { icon: DollarSign, label: "Revenue Check", prompt: "What are all the ways I can earn money as an independent artist? What am I missing?" },
  { icon: Target, label: "Career Next Steps", prompt: "I have 1000 monthly listeners and 5 songs on Spotify. What should I do next to grow?" },
  { icon: Zap, label: "Full Release Setup", prompt: "Set up everything for my album release: timeline, registrations, distribution, marketing." },
  { icon: FileText, label: "Contract Review", prompt: "What red flags should I look for in a record deal? What clauses should I negotiate?" },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm your AI career assistant powered by Gemini. I have deep knowledge of the music business from Exploration.io, Passman's handbook, and Berklee Online.\n\nI can:\n• Answer any music business question\n• Plan releases with full timelines\n• Generate marketing content\n• Review contracts for red flags\n• Advise on career strategy\n\nAsk me anything or try a suggested prompt below!", timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content, timestamp: new Date() }])
    setInputValue("")
    setIsTyping(true)
    setError(null)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const { response, agent } = await aiAgentChat(content, history)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date(), agent }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${msg}`, timestamp: new Date(), error: true }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg"><Sparkles className="h-5 w-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold">AI Career Agent</h1>
              <p className="text-sm text-muted-foreground">Powered by Gemini • Music business expert • Can chat AND take actions</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`p-2 rounded-full shrink-0 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"}`}>
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : message.error ? "bg-red-500/10 border border-red-500/30" : "bg-muted"}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{message.content}</div>
                  {message.agent && <Badge variant="outline" className="text-xs mt-2">{message.agent} agent</Badge>}
                  <p className="text-xs opacity-50 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full text-white shrink-0"><Bot className="h-4 w-4" /></div>
                <div className="bg-muted rounded-lg p-4"><div className="flex items-center space-x-2"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm text-muted-foreground">Analyzing...</span></div></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map(p => (
                <Button key={p.label} variant="outline" size="sm" onClick={() => handleSend(p.prompt)} disabled={isTyping} className="flex items-center gap-2">
                  <p.icon className="h-4 w-4" />{p.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={e => { e.preventDefault(); handleSend(inputValue) }} className="flex space-x-2">
            <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Ask about music business, contracts, royalties, career strategy..." disabled={isTyping} className="flex-1" />
            <Button type="submit" disabled={isTyping || !inputValue.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
