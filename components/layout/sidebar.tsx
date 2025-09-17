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
  Zap
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
    name: "Finances",
    href: "/finances",
    icon: DollarSign,
  },
  {
    name: "Content",
    href: "/content",
    icon: FileText,
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
    name: "AI Assistant",
    href: "/ai",
    icon: Zap,
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