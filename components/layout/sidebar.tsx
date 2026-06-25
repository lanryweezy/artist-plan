"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  LayoutDashboard, FolderOpen, DollarSign, FileText, Calendar,
  Music, MapPin, Zap, CheckCircle, Palette, Users, Globe,
  Disc, TrendingUp, Settings, ChevronDown, ChevronRight,
  BookOpen, Shield, Award, Sparkles
} from "lucide-react"

interface NavGroup {
  label: string
  items: { name: string; href: string; icon: React.ElementType }[]
}

const navGroups: NavGroup[] = [
  {
    label: "Create",
    items: [
      { name: "Projects", href: "/projects", icon: FolderOpen },
      { name: "Releases", href: "/releases", icon: Disc },
      { name: "Publishing", href: "/publishing", icon: BookOpen },
      { name: "Content", href: "/content", icon: FileText },
    ]
  },
  {
    label: "Money",
    items: [
      { name: "Finances", href: "/finances", icon: DollarSign },
      { name: "Royalties", href: "/royalties", icon: TrendingUp },
      { name: "Tax", href: "/tax", icon: FileText },
      { name: "Grants", href: "/grants", icon: Award },
    ]
  },
  {
    label: "Grow",
    items: [
      { name: "Fans", href: "/fans", icon: Users },
      { name: "Brand", href: "/brand", icon: Palette },
      { name: "Marketing", href: "/marketing", icon: Megaphone },
      { name: "Team", href: "/team", icon: Users },
    ]
  },
  {
    label: "Live",
    items: [
      { name: "Tours", href: "/tours", icon: MapPin },
      { name: "Tour Budget", href: "/tour-budget", icon: Calculator },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Create", "Money", "Grow", "Live"]))

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 border-b">
        <div className="flex items-center space-x-2">
          <Music className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          <span className="text-lg lg:text-xl font-bold">Artist Plan</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navGroups.map(group => {
          const isExpanded = expandedGroups.has(group.label)
          const isActive = group.items.some(item => pathname === item.href)

          return (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-1.5 text-xs font-semibold uppercase tracking-wider",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {group.label}
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>

              {isExpanded && (
                <div className="space-y-0.5 px-2">
                  {group.items.map(item => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-sm h-8",
                            isActive && "bg-secondary font-medium"
                          )}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t space-y-1 p-2">
        <Link href="/ai">
          <Button variant="ghost" className={cn("w-full justify-start text-sm", pathname === "/ai" && "bg-primary/10 text-primary font-medium")}>
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            AI Assistant
          </Button>
        </Link>
        <Link href="/integrations">
          <Button variant="ghost" className={cn("w-full justify-start text-sm", pathname === "/integrations" && "bg-secondary")}>
            <Globe className="mr-2 h-4 w-4" />
            Integrations
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start text-sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}

function Megaphone(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
}

function Calculator(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10.01" /><line x1="12" y1="10" x2="12" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" /><line x1="8" y1="14" x2="8" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="8" y1="18" x2="8" y2="18.01" /><line x1="12" y1="18" x2="12" y2="18.01" /><line x1="16" y1="18" x2="16" y2="18.01" /></svg>
}
