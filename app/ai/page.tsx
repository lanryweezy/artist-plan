"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Sparkles, Music, TrendingUp, DollarSign, Loader2, Bot, User, AlertCircle, Zap, FileText, Target, Globe, Shield, Users } from "lucide-react"
import { aiWithMemory, memoryStore } from "@/services/memory"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date }

const prompts = [
  { icon: Music, label: "Release Plan", prompt: "Plan my next release — timeline, registrations, and marketing strategy." },
  { icon: Target, label: "What Next?", prompt: "What are the top 3 things I should focus on this week?" },
  { icon: DollarSign, label: "Revenue Check", prompt: "Analyze my revenue streams and find missing income." },
  { icon: TrendingUp, label: "Fan Growth", prompt: "How do I grow my fanbase from where I am now?" },
  { icon: FileText, label: "Contract Help", prompt: "What red flags should I look for in a record deal?" },
  { icon: Shield, label: "Rights Check", prompt: "Am I registered everywhere I need to be?" },
  { icon: Users, label: "Team Advice", prompt: "When should I hire a manager vs agent vs lawyer?" },
  { icon: Globe, label: "Tour Strategy", prompt: "Plan a tour route and budget for my next tour." },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: `Hi ${memoryStore.get().name}! I'm your AI career agent.\n\nI know everything about your career:\n• Your ${memoryStore.get().songs.length} songs and their registrations\n• Your $${memoryStore.get().monthlyRevenue.toLocaleString()}/month revenue breakdown\n• Your ${memoryStore.get().totalFans.toLocaleString()} fans and ${memoryStore.get().vipFans} VIP supporters\n• Which registrations you're missing\n• Your team and upcoming releases\n\nI'm not just a chatbot — I'm your digital manager who remembers everything.\n\nAsk me anything or try a prompt below.`, timestamp: new Date() },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async (content: string) => {
    if (!content.trim() || typing) return
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content, timestamp: new Date() }])
    setInput("")
    setTyping(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await aiWithMemory(content, history)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() }])
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`, timestamp: new Date() }])
    } finally {
      setTyping(false)
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
              <p className="text-sm text-muted-foreground">Remembers your career • Powered by Gemini</p>
            </div>
          </div>
        </div>

        {messages.length <= 1 && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">What do you need?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {prompts.map(p => (
                  <button key={p.label} onClick={() => send(p.prompt)} className="p-3 border rounded-lg text-left hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2 mb-1"><p.icon className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{p.label}</span></div>
                  </button>
                ))}
              </div>
            </div>
            <Card className="border-dashed">
              <CardContent className="p-3 text-center text-sm text-muted-foreground">
                <p>I can also: review contracts, check registrations, plan tours, analyze revenue, generate content ideas, and more.</p>
                <p className="mt-1">Just ask me anything about your music career.</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.slice(messages.length <= 1 ? 0 : 1).map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`p-2 rounded-full shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-4 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.content}</div>
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
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your music career..." disabled={typing} className="flex-1" />
            <Button type="submit" disabled={typing || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
