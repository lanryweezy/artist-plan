"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Music,
  FileText,
  DollarSign,
  Calendar,
  Users,
  X,
  Disc,
  MapPin,
  Mic
} from "lucide-react"

const quickActions = [
  { label: "New Project", icon: FolderOpen, href: "/projects" },
  { label: "Add Song", icon: Music, href: "/publishing" },
  { label: "Record Expense", icon: DollarSign, href: "/finances" },
  { label: "Add Contact", icon: Users, href: "/team" },
  { label: "Schedule Event", icon: Calendar, href: "/calendar" },
  { label: "New Release", icon: Disc, href: "/releases" },
]

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {isOpen && (
        <Card className="mb-2 w-48 shadow-lg">
          <CardContent className="p-2 space-y-1">
            {quickActions.map(action => (
              <a
                key={action.label}
                href={action.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </a>
            ))}
          </CardContent>
        </Card>
      )}
      <Button
        size="lg"
        className="rounded-full h-12 w-12 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </Button>
    </div>
  )
}

function FolderOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
