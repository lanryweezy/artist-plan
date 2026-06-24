"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Sparkles, Music, TrendingUp, DollarSign, Loader2, Bot, User, AlertCircle, Zap, FileText, Target, Globe, Shield } from "lucide-react"
import { aiAgentChat } from "@/services/ai"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date; agent?: string; error?: boolean }

const agents = [
  { name: "Career", icon: Target, color: "text-yellow-500" },
  { name: "Marketing", icon: TrendingUp, color: "text-blue-500" },
  { name: "Finance", icon: DollarSign, color: "text-green-500" },
  { name: "Content", icon: Music, color: "text-purple-500" },
  { name: "Release", icon: Globe, color: "text-orange-500" },
  { name: "Legal", icon: Shield, color: "text-red-500" },
]

const prompts = [
  { icon: Music, label: "Release Plan", prompt: "Create a complete release plan for my next single including timeline, registrations, distribution, and marketing." },
  { icon: Target, label: "What Next?", prompt: "What are the top 3 things I should focus on this week to grow my music career?" },
  { icon: DollarSign, label: "Revenue Check", prompt: "Analyze my revenue streams and tell me where I'm leaving money on the table." },
  { icon: TrendingUp, label: "Fan Growth", prompt: "How can I grow from 2,340 monthly listeners to 10,000? Give me a specific plan." },
  { icon: FileText, label: "Contract Help", prompt: "What red flags should I look for in a publishing deal? What terms should I negotiate?" },
  { icon: Shield, label: "Rights Check", prompt: "Am I registered with all the collection agencies I need? What am I missing?" },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "I'm your AI music business agent. I know the industry inside out — from Exploration.io, Passman's handbook, and Berklee Online.\n\nI can:\n• **Plan releases** with full timelines and registrations\n• **Review contracts** for red flags and negotiation points\n• **Analyze revenue** and find missing income streams\n• **Grow your fanbase** with platform-specific strategies\n• **Check your rights** — are you registered everywhere you need to be?\n• **Give career advice** based on your actual situation\n\nI'm not just a chatbot — I'm your digital manager. Ask me anything or try a prompt below.", timestamp: new Date() },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async (content: string) => {
    if (!content.trim() || typing) return
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content, timestamp: new Date() }])
    setInput("")
    setTyping(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const { response, agent } = await aiAgentChat(content, history)
      setActiveAgent(agent)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date(), agent }])
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`, timestamp: new Date(), error: true }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg"><Sparkles className="h-5 w-5 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold">AI Career Agent</h1>
                <p className="text-sm text-muted-foreground">Music business expert powered by Gemini</p>
              </div>
            </div>
            {activeAgent && (
              <Badge variant="outline" className="text-xs">
                {agents.find(a => a.name.toLowerCase() === activeAgent)?.icon && (() => { const A = agents.find(a => a.name.toLowerCase() === activeAgent)!.icon; return <A className="h-3 w-3 mr-1" /> })()}
                {activeAgent} agent
              </Badge>
            )}
          </div>
        </div>

        {messages.length <= 1 && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">What do you need help with?</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {prompts.map(p => (
                  <button key={p.label} onClick={() => send(p.prompt)} className="p-3 border rounded-lg text-left hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2 mb-1"><p.icon className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{p.label}</span></div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.slice(messages.length <= 1 ? 0 : 1).map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`p-2 rounded-full shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-4 ${msg.role === "user" ? "bg-primary text-primary-foreground" : msg.error ? "bg-red-500/10 border border-red-500/30" : "bg-muted"}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.content}</div>
                  {msg.agent && <Badge variant="outline" className="text-xs mt-2">{msg.agent} agent</Badge>}
                  <p className="text-xs opacity-50 mt-2">{msg.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full text-white shrink-0"><Bot className="h-4 w-4" /></div>
                <div className="bg-muted rounded-lg p-4"><div className="flex items-center space-x-2"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm text-muted-foreground">Thinking...</span></div></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t">
          <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex space-x-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about music business, contracts, royalties, career strategy..." disabled={typing} className="flex-1" />
            <Button type="submit" disabled={typing || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
