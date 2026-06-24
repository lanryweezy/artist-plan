"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderOpen,
  DollarSign,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Music,
  MapPin,
  Zap,
  CheckCircle,
  Palette,
  Scale,
  Award,
  BookOpen,
  TrendingUp,
  Globe,
  Users,
  Disc,
  Receipt,
  PiggyBank,
  Shield,
  ClipboardList,
  Calculator,
  Database,
  Wrench,
  Video,
  Download,
  Link2,
  ChevronDown,
  ChevronRight,
  Heart
} from "lucide-react"

interface NavGroup {
  label: string
  items: { name: string; href: string; icon: React.ElementType }[]
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    label: "Operations",
    items: [
      { name: "Projects", href: "/projects", icon: FolderOpen },
      { name: "Tasks", href: "/tasks", icon: CheckCircle },
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Tours", href: "/tours", icon: MapPin },
      { name: "Team", href: "/team", icon: Users },
    ]
  },
  {
    label: "Money",
    items: [
      { name: "Finances", href: "/finances", icon: DollarSign },
      { name: "Royalties", href: "/royalties", icon: TrendingUp },
      { name: "Tax", href: "/tax", icon: Receipt },
      { name: "Investment", href: "/investment", icon: PiggyBank },
      { name: "Grants", href: "/grants", icon: Award },
    ]
  },
  {
    label: "Release",
    items: [
      { name: "Content", href: "/content", icon: FileText },
      { name: "Releases", href: "/releases", icon: Disc },
      { name: "Distribution", href: "/distribution", icon: Globe },
      { name: "Metadata", href: "/metadata", icon: Database },
      { name: "Marketing", href: "/marketing", icon: Megaphone },
      { name: "YouTube", href: "/youtube", icon: Video },
    ]
  },
  {
    label: "Legal",
    items: [
      { name: "Legal", href: "/legal", icon: Scale },
      { name: "Contracts", href: "/contracts", icon: ClipboardList },
      { name: "Rights", href: "/rights", icon: Shield },
    ]
  },
  {
    label: "Growth",
    items: [
      { name: "Brand", href: "/brand", icon: Palette },
      { name: "Fans", href: "/fans", icon: Heart },
      { name: "Publishing", href: "/publishing", icon: BookOpen },
    ]
  },
  {
    label: "Live",
    items: [
      { name: "Tour Budget", href: "/tour-budget", icon: Calculator },
      { name: "Export", href: "/export", icon: Download },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Overview", "Operations", "Money", "Release", "Legal", "Growth", "Live"]))

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
      <div className="flex h-16 items-center px-4 lg:px-6 border-b">
        <div className="flex items-center space-x-2">
          <Music className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          <span className="text-lg lg:text-xl font-bold">Artist Plan</span>
        </div>
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
          <Button variant="ghost" className={cn("w-full justify-start text-sm", pathname === "/ai" && "bg-secondary")}>
            <Zap className="mr-2 h-4 w-4 text-primary" />
            AI Assistant
          </Button>
        </Link>
        <Link href="/workflows">
          <Button variant="ghost" className={cn("w-full justify-start text-sm", pathname === "/workflows" && "bg-secondary")}>
            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
            Workflows
          </Button>
        </Link>
        <Link href="/tools">
          <Button variant="ghost" className={cn("w-full justify-start text-sm", pathname === "/tools" && "bg-secondary")}>
            <Wrench className="mr-2 h-4 w-4" />
            Tools
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
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Video(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}
