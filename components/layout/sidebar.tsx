"use client"

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
  Link2,
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
  Download
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckCircle,
  },
  {
    name: "Finances",
    href: "/finances",
    icon: DollarSign,
  },
  {
    name: "Royalties",
    href: "/royalties",
    icon: TrendingUp,
  },
  {
    name: "Tax",
    href: "/tax",
    icon: Receipt,
  },
  {
    name: "Export",
    href: "/export",
    icon: Download,
  },
  {
    name: "Investment",
    href: "/investment",
    icon: PiggyBank,
  },
  {
    name: "Content",
    href: "/content",
    icon: FileText,
  },
  {
    name: "Releases",
    href: "/releases",
    icon: Disc,
  },
  {
    name: "Distribution",
    href: "/distribution",
    icon: Globe,
  },
  {
    name: "YouTube",
    href: "/youtube",
    icon: Video,
  },
  {
    name: "Metadata Health",
    href: "/metadata",
    icon: Database,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Marketing",
    href: "/marketing",
    icon: BarChart3,
  },
  {
    name: "Tours",
    href: "/tours",
    icon: MapPin,
  },
  {
    name: "Tour Budget",
    href: "/tour-budget",
    icon: Calculator,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Brand",
    href: "/brand",
    icon: Palette,
  },
  {
    name: "Publishing",
    href: "/publishing",
    icon: BookOpen,
  },
  {
    name: "Grants",
    href: "/grants",
    icon: Award,
  },
  {
    name: "Legal",
    href: "/legal",
    icon: Scale,
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: ClipboardList,
  },
  {
    name: "Rights & Registration",
    href: "/rights",
    icon: Shield,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: Link2,
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: Zap,
  },
  {
    name: "Tools",
    href: "/tools",
    icon: Wrench,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-4 lg:px-6 border-b">
        <div className="flex items-center space-x-2">
          <Music className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          <span className="text-lg lg:text-xl font-bold">Artist Plan</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 lg:px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sm lg:text-base",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="mr-2 lg:mr-3 h-4 w-4" />
                <span className="truncate">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-2 lg:p-3 border-t">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start text-sm lg:text-base">
            <Settings className="mr-2 lg:mr-3 h-4 w-4" />
            <span className="truncate">Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}