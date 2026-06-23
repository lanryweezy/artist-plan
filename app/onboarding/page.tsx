"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Music, ArrowRight, ArrowLeft, Check, Globe, Shield, DollarSign, Users, Zap } from "lucide-react"

interface OnboardingData {
  artistName: string
  genre: string
  goals: string[]
  role: "songwriter" | "recording_artist" | "both"
  teamSize: "solo" | "small" | "full"
  currentStage: "starting" | "releasing" | "touring" | "established"
  connectedServices: string[]
}

const genreOptions = ["Pop", "Hip-Hop/Rap", "R&B", "Rock", "Indie", "Country", "Electronic/Dance", "Jazz", "Classical", "Latin", "Metal", "Folk", "Other"]

const goalOptions = [
  { id: "release", label: "Release Music", icon: Music, description: "Record and distribute new music" },
  { id: "tour", label: "Tour & Perform", icon: Globe, description: "Book shows and go on tour" },
  { id: "sync", label: "Get Sync Placements", icon: Zap, description: "License music for film, TV, ads" },
  { id: "publishing", label: "Publishing Income", icon: DollarSign, description: "Collect mechanical and performance royalties" },
  { id: "brand", label: "Build Brand", icon: Users, description: "Grow fanbase and partnerships" },
  { id: "protect", label: "Protect My Music", icon: Shield, description: "Copyright, contracts, and legal" },
]

const stageLabels: Record<string, string> = {
  starting: "Just Starting Out",
  releasing: "Releasing Music",
  touring: "Touring Regularly",
  established: "Established Career",
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    artistName: "",
    genre: "",
    goals: [],
    role: "both",
    teamSize: "solo",
    currentStage: "starting",
    connectedServices: [],
  })

  const totalSteps = 5
  const progress = ((step + 1) / totalSteps) * 100

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const next = () => setStep(s => Math.min(s + 1, totalSteps - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="text-center space-y-6 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Music className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">Welcome to Artist Plan</h1>
      <p className="text-muted-foreground text-lg">
        The all-in-one platform for independent musicians. Let's set up your account in 2 minutes.
      </p>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 border rounded-lg">
          <p className="font-medium">27+</p>
          <p className="text-muted-foreground">Business tools</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="font-medium">45+</p>
          <p className="text-muted-foreground">Integrations</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="font-medium">AI</p>
          <p className="text-muted-foreground">Music business expert</p>
        </div>
      </div>
    </div>,

    // Step 1: Profile
    <div key="profile" className="space-y-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Artist/Band Name</label>
          <Input placeholder="Your stage name" value={data.artistName} onChange={e => setData({...data, artistName: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-medium">Primary Genre</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {genreOptions.map(genre => (
              <Button
                key={genre}
                variant={data.genre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setData({...data, genre})}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">I am primarily a...</label>
          <div className="flex gap-2 mt-2">
            {([
              { value: "songwriter", label: "Songwriter" },
              { value: "recording_artist", label: "Recording Artist" },
              { value: "both", label: "Both" },
            ] as const).map(opt => (
              <Button
                key={opt.value}
                variant={data.role === opt.value ? "default" : "outline"}
                onClick={() => setData({...data, role: opt.value})}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>,

    // Step 2: Goals
    <div key="goals" className="space-y-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-bold">What are your goals?</h2>
        <p className="text-muted-foreground">Select all that apply</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map(goal => {
          const selected = data.goals.includes(goal.id)
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 border rounded-lg text-left transition-all ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selected ? "bg-primary/10" : "bg-muted"}`}>
                  <goal.icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{goal.label}</p>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                </div>
              </div>
              {selected && <Check className="h-4 w-4 text-primary float-right mt-1" />}
            </button>
          )
        })}
      </div>
    </div>,

    // Step 3: Stage
    <div key="stage" className="space-y-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Where are you in your career?</h2>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
      </div>
      <div className="space-y-3">
        {([
          { value: "starting", label: "Just Starting Out", desc: "Haven't released music yet, building my craft" },
          { value: "releasing", label: "Releasing Music", desc: "Have releases on streaming platforms, growing audience" },
          { value: "touring", label: "Touring Regularly", desc: "Playing shows consistently, earning from live performance" },
          { value: "established", label: "Established Career", desc: "Multiple releases, touring, publishing, full team" },
        ] as const).map(stage => (
          <button
            key={stage.value}
            onClick={() => setData({...data, currentStage: stage.value})}
            className={`w-full p-4 border rounded-lg text-left transition-all ${data.currentStage === stage.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{stage.label}</p>
                <p className="text-sm text-muted-foreground">{stage.desc}</p>
              </div>
              {data.currentStage === stage.value && <Check className="h-5 w-5 text-primary" />}
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Quick Connect
    <div key="connect" className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Quick Connect</h2>
        <p className="text-muted-foreground">Connect your most important services (optional, can do later)</p>
      </div>
      <div className="space-y-3">
        {[
          { name: "DistroKid", desc: "Distribution", category: "distribution" },
          { name: "ASCAP", desc: "Performance royalties", category: "pro" },
          { name: "BMI", desc: "Performance royalties", category: "pro" },
          { name: "SoundExchange", desc: "Digital performance royalties", category: "rights" },
          { name: "YouTube", desc: "Content ID & monetization", category: "youtube" },
          { name: "Spotify for Artists", desc: "Streaming analytics", category: "analytics" },
        ].map(service => (
          <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">{service.name}</p>
              <p className="text-xs text-muted-foreground">{service.desc}</p>
            </div>
            <Button
              size="sm"
              variant={data.connectedServices.includes(service.name) ? "default" : "outline"}
              onClick={() => {
                setData(prev => ({
                  ...prev,
                  connectedServices: prev.connectedServices.includes(service.name)
                    ? prev.connectedServices.filter(s => s !== service.name)
                    : [...prev.connectedServices, service.name]
                }))
              }}
            >
              {data.connectedServices.includes(service.name) ? "Connected" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {steps[step]}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <p className="text-sm text-muted-foreground">Step {step + 1} of {totalSteps}</p>
          {step < totalSteps - 1 ? (
            <Button onClick={next}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => window.location.href = "/dashboard"}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
