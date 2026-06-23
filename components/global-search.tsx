"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  X,
  Music,
  FileText,
  DollarSign,
  Calendar,
  Users,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  Command
} from "lucide-react"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  page: string
  icon: React.ElementType
  tags: string[]
}

const searchableContent: SearchResult[] = [
  // Legal
  { id: "l1", title: "Copyright Registration", description: "Register compositions and sound recordings", category: "Legal", page: "/legal", icon: Shield, tags: ["copyright", "register", "protect"] },
  { id: "l2", title: "ISRC Codes", description: "International Standard Recording Code for each track", category: "Legal", page: "/legal", icon: Key, tags: ["isrc", "code", "recording"] },
  { id: "l3", title: "Sync Licenses", description: "License music for film, TV, ads, games", category: "Legal", page: "/legal", icon: FileText, tags: ["sync", "license", "film", "tv"] },
  // Royalties
  { id: "r1", title: "Performance Royalties", description: "From radio, TV, venues, streaming via PROs", category: "Royalties", page: "/royalties", icon: DollarSign, tags: ["performance", "royalty", "ascap", "bmi"] },
  { id: "r2", title: "Mechanical Royalties", description: "From streaming, downloads, physical sales", category: "Royalties", page: "/royalties", icon: DollarSign, tags: ["mechanical", "royalty", "mlc", "hfa"] },
  { id: "r3", title: "Sync Fees", description: "One-time fees for film/TV/ad placements", category: "Royalties", page: "/royalties", icon: DollarSign, tags: ["sync", "fee", "placement"] },
  { id: "r4", title: "SoundExchange", description: "Non-interactive digital performance royalties", category: "Royalties", page: "/royalties", icon: DollarSign, tags: ["soundexchange", "pandora", "siriusxm"] },
  // Contracts
  { id: "c1", title: "Contract Review", description: "AI-powered contract analysis for red flags", category: "Contracts", page: "/contracts", icon: FileText, tags: ["contract", "review", "red flag"] },
  { id: "c2", title: "Work for Hire", description: "Danger clause — publisher owns 100%", category: "Contracts", page: "/contracts", icon: AlertTriangle, tags: ["work for hire", "danger", "ownership"] },
  { id: "c3", title: "Controlled Composition", description: "Limits mechanical royalties on your own songs", category: "Contracts", page: "/contracts", icon: AlertTriangle, tags: ["controlled composition", "mechanical"] },
  // Rights
  { id: "rt1", title: "Registration Tracker", description: "Track status with all 13 collection agencies", category: "Rights", page: "/rights", icon: Shield, tags: ["register", "ascap", "mlc", "soundexchange"] },
  { id: "rt2", title: "MLC Registration", description: "Register for streaming mechanical royalties", category: "Rights", page: "/rights", icon: Shield, tags: ["mlc", "mechanical", "streaming"] },
  { id: "rt3", title: "PRO Registration", description: "ASCAP or BMI for performance royalties", category: "Rights", page: "/rights", icon: Shield, tags: ["ascap", "bmi", "pro", "performance"] },
  // Publishing
  { id: "p1", title: "Song Catalog", description: "Manage all your songs with splits and metadata", category: "Publishing", page: "/publishing", icon: Music, tags: ["song", "catalog", "splits"] },
  { id: "p2", title: "Split Sheets", description: "Track writer ownership percentages", category: "Publishing", page: "/publishing", icon: Users, tags: ["split", "sheet", "writer", "ownership"] },
  { id: "p3", title: "Publishing Deals", description: "Admin, co-publishing, exclusive, work-for-hire", category: "Publishing", page: "/publishing", icon: FileText, tags: ["publishing", "deal", "admin"] },
  // Distribution
  { id: "d1", title: "DSP Status", description: "Where your music is available", category: "Distribution", page: "/distribution", icon: Globe, tags: ["distribution", "spotify", "apple", "streaming"] },
  { id: "d2", title: "Metadata Health", description: "Check ISRC, ISWC, IPI across platforms", category: "Distribution", page: "/metadata", icon: CheckCircle, tags: ["metadata", "health", "isrc", "iswc"] },
  // Tools
  { id: "t1", title: "Split Calculator", description: "Calculate revenue splits for co-written songs", category: "Tools", page: "/tools", icon: Calculator, tags: ["split", "calculator", "revenue"] },
  { id: "t2", title: "Sync Navigator", description: "8-step workflow for getting music placed", category: "Tools", page: "/tools", icon: Zap, tags: ["sync", "workflow", "placement"] },
  { id: "t3", title: "Producer Deals", description: "Traditional, beat lease, and label deals", category: "Tools", page: "/tools", icon: Music, tags: ["producer", "deal", "beat"] },
  { id: "t4", title: "Trademark Guide", description: "Protect your artist name and brand", category: "Tools", page: "/tools", icon: Shield, tags: ["trademark", "name", "brand"] },
  // YouTube
  { id: "y1", title: "YouTube CMS", description: "Content ID, claiming, and monetization", category: "YouTube", page: "/youtube", icon: Video, tags: ["youtube", "content id", "monetize"] },
  { id: "y2", title: "YouTube Monetization", description: "How to earn from YouTube videos", category: "YouTube", page: "/youtube", icon: DollarSign, tags: ["youtube", "monetize", "ads"] },
  // Tours
  { id: "tv1", title: "Tour Budget", description: "Plan expenses and revenue for tours", category: "Tours", page: "/tour-budget", icon: DollarSign, tags: ["tour", "budget", "expenses"] },
  { id: "tv2", title: "Merch Economics", description: "Hall fees, margins, and pricing", category: "Tours", page: "/tour-budget", icon: ShoppingBag, tags: ["merch", "hall fees", "margin"] },
  // Grants
  { id: "g1", title: "Grant Tracker", description: "Track grant applications and deadlines", category: "Grants", page: "/grants", icon: Award, tags: ["grant", "funding", "application"] },
  // Tax
  { id: "tx1", title: "Tax Report", description: "Track income, expenses, deductions", category: "Tax", page: "/tax", icon: FileText, tags: ["tax", "income", "expense", "deduction"] },
  { id: "tx2", title: "Schedule C", description: "Self-employment tax filing guide", category: "Tax", page: "/tax", icon: FileText, tags: ["schedule c", "tax", "self-employed"] },
]

const categoryColors: Record<string, string> = {
  Legal: "bg-purple-500/10 text-purple-500",
  Royalties: "bg-green-500/10 text-green-500",
  Contracts: "bg-red-500/10 text-red-500",
  Rights: "bg-blue-500/10 text-blue-500",
  Publishing: "bg-yellow-500/10 text-yellow-500",
  Distribution: "bg-orange-500/10 text-orange-500",
  Tools: "bg-teal-500/10 text-teal-500",
  YouTube: "bg-red-500/10 text-red-500",
  Tours: "bg-indigo-500/10 text-indigo-500",
  Grants: "bg-emerald-500/10 text-emerald-500",
  Tax: "bg-gray-500/10 text-gray-500",
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const queryLower = query.toLowerCase()
    const matched = searchableContent.filter(item =>
      item.title.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower) ||
      item.tags.some(tag => tag.includes(queryLower))
    )
    setResults(matched.slice(0, 10))
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="w-full max-w-xl mx-4" onClick={e => e.stopPropagation()}>
        <Card className="shadow-2xl">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 p-4 border-b">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search anything... (copyright, royalty, contract, ISRC, YouTube...)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 text-lg"
              />
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.map(result => {
                  const Icon = result.icon
                  return (
                    <a
                      key={result.id}
                      href={result.page}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.description}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${categoryColors[result.category]}`}>
                        {result.category}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )
                })}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No results found for "{query}"</p>
                <p className="text-sm">Try searching for copyright, royalty, contract, ISRC, YouTube, etc.</p>
              </div>
            )}

            {query.length < 2 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <p>Type to search across all 27+ pages</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">K</kbd>
                  <span className="ml-1">to open search</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Local icon components
function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function Calculator(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
      <line x1="16" y1="18" x2="16" y2="18.01" />
    </svg>
  )
}

function Video(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function Award(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}
