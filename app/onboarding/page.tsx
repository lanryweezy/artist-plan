"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Music, ArrowRight, ArrowLeft, Check } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ name: "", genre: "", goals: [] as string[], stage: "starting" })
  const totalSteps = 5
  const progress = ((step + 1) / totalSteps) * 100

  const toggleGoal = (g: string) => setData(d => ({ ...d, goals: d.goals.includes(g) ? d.goals.filter(x => x !== g) : [...d.goals, g] }))

  const steps = [
    <div key="0" className="text-center space-y-6 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto"><Music className="h-10 w-10 text-primary" /></div>
      <h1 className="text-3xl font-bold">Welcome to Artist Plan</h1>
      <p className="text-muted-foreground">The all-in-one platform for independent musicians. Let's set up your account.</p>
    </div>,
    <div key="1" className="space-y-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div><label className="text-sm font-medium">Artist Name</label><Input placeholder="Your stage name" value={data.name} onChange={e => setData({...data, name: e.target.value})} /></div>
      <div><label className="text-sm font-medium">Genre</label><div className="flex flex-wrap gap-2 mt-2">{["Pop", "Hip-Hop", "R&B", "Rock", "Indie", "Country", "Electronic", "Jazz", "Other"].map(g => <Button key={g} variant={data.genre === g ? "default" : "outline"} size="sm" onClick={() => setData({...data, genre: g})}>{g}</Button>)}</div></div>
    </div>,
    <div key="2" className="space-y-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Your Goals</h2>
      <div className="grid grid-cols-2 gap-2">{["Release Music", "Tour & Perform", "Get Sync Placements", "Publishing Income", "Build Brand", "Protect My Music"].map(g => {
        const sel = data.goals.includes(g)
        return <button key={g} onClick={() => toggleGoal(g)} className={`p-3 border rounded-lg text-left text-sm ${sel ? "border-primary bg-primary/5" : ""}`}>{sel && <Check className="h-4 w-4 text-primary float-right" />}{g}</button>
      })}</div>
    </div>,
    <div key="3" className="space-y-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Your Stage</h2>
      {[{ v: "starting", l: "Just Starting Out", d: "Haven't released music yet" }, { v: "releasing", l: "Releasing Music", d: "Have releases on streaming platforms" }, { v: "touring", l: "Touring Regularly", d: "Playing shows consistently" }, { v: "established", l: "Established Career", d: "Full team, multiple revenue streams" }].map(s => (
        <button key={s.v} onClick={() => setData({...data, stage: s.v})} className={`w-full p-4 border rounded-lg text-left ${data.stage === s.v ? "border-primary bg-primary/5" : ""}`}>
          <div className="flex items-center justify-between"><div><p className="font-medium">{s.l}</p><p className="text-sm text-muted-foreground">{s.d}</p></div>{data.stage === s.v && <Check className="h-5 w-5 text-primary" />}</div>
        </button>
      ))}
    </div>,
    <div key="4" className="text-center space-y-6 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"><Check className="h-10 w-10 text-green-500" /></div>
      <h1 className="text-2xl font-bold">You're all set!</h1>
      <p className="text-muted-foreground">Your account is ready. Start exploring your dashboard.</p>
      <Button size="lg" onClick={() => window.location.href = "/dashboard"}>Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" /></Button>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
      <div className="flex-1 flex items-center justify-center p-6">{steps[step]}</div>
      <div className="p-6 border-t"><div className="max-w-lg mx-auto flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <p className="text-sm text-muted-foreground">Step {step + 1} of {totalSteps}</p>
        {step < totalSteps - 1 ? <Button onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}>Next <ArrowRight className="h-4 w-4 ml-2" /></Button> : null}
      </div></div>
    </div>
  )
}
