"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Plus, ArrowRight, BookOpen, Shield, Zap } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ElementType
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  tips?: string[]
  variant?: "default" | "compact" | "hero"
}

export function EmptyState({
  title,
  description,
  icon: Icon = Music,
  action,
  secondaryAction,
  tips,
  variant = "default"
}: EmptyStateProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Icon className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        {action && (
          <Button size="sm" onClick={action.onClick}>
            <Plus className="h-3 w-3 mr-1" />
            {action.label}
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>

        <div className="flex gap-2">
          {action && (
            <Button onClick={action.onClick}>
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {tips && tips.length > 0 && (
          <div className="mt-8 w-full max-w-md">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick tips</p>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ====== PAGE-SPECIFIC EMPTY STATES ======

export function LegalEmptyState() {
  return (
    <EmptyState
      title="No Copyrights Registered Yet"
      description="Register your compositions and sound recordings to protect your intellectual property and enable royalty collection."
      icon={Shield}
      action={{ label: "Register First Work", onClick: () => {} }}
      tips={[
        "Copyright exists upon creation, but registration provides legal protection",
        "Register both composition AND sound recording for full protection",
        "Cost: $35-45 per registration at copyright.gov",
        "Register within 3 months of publication for statutory damages eligibility"
      ]}
    />
  )
}

export function RoyaltiesEmptyState() {
  return (
    <EmptyState
      title="No Royalty Data Yet"
      description="Connect your streaming platforms and collection agencies to start tracking royalties."
      icon={DollarSign}
      action={{ label: "Connect Services", onClick: () => {} }}
      secondaryAction={{ label: "Learn About Royalties", onClick: () => {} }}
      tips={[
        "Register with a PRO (ASCAP or BMI) for performance royalties",
        "Register with MLC for streaming mechanical royalties",
        "Register with SoundExchange for non-interactive digital royalties",
        "Missing registrations = uncollected royalties in 'black box' pools"
      ]}
    />
  )
}

export function SongsEmptyState() {
  return (
    <EmptyState
      title="No Songs in Your Catalog"
      description="Start building your song catalog to track ownership, splits, and metadata."
      icon={Music}
      action={{ label: "Add First Song", onClick: () => {} }}
      tips={[
        "Include ISRC, ISWC, and IPI numbers when available",
        "Document writer and publisher splits for each song",
        "Clean metadata = faster royalty collection"
      ]}
    />
  )
}

export function TeamEmptyState() {
  return (
    <EmptyState
      title="No Team Members Yet"
      description="Start building your professional team. According to Passman, hire a lawyer first (they have relationships), then a manager."
      icon={Users}
      action={{ label: "Add First Contact", onClick: () => {} }}
      tips={[
        "Lawyer first — they have industry relationships to get your music heard",
        "Manager second — for strategy and career direction",
        "Agent third — when ready to tour regularly",
        "Business manager last — when income justifies the expense"
      ]}
    />
  )
}

export function GrantsEmptyState() {
  return (
    <EmptyState
      title="No Grant Applications Yet"
      description="Grants are free money for your music projects. Start researching and applying."
      icon={Award}
      action={{ label: "Add First Grant", onClick: () => {} }}
      secondaryAction={{ label: "Research Grants", onClick: () => {} }}
      tips={[
        "Grants are non-repayable — you don't pay them back",
        "Apply to organizations whose mission aligns with your project",
        "Start with local/state arts councils before national foundations",
        "Include clear budgets and measurable impact in proposals"
      ]}
    />
  )
}

export function ToursEmptyState() {
  return (
    <EmptyState
      title="No Tours Planned"
      description="Start planning your next tour. Use the tour budget calculator to estimate expenses and revenue."
      icon={Globe}
      action={{ label: "Plan First Tour", onClick: () => {} }}
      secondaryAction={{ label: "Open Tour Budget", onClick: () => {} }}
      tips={[
        "New artists often see zero or negative profit from touring initially",
        "The value is in marketing, fan building, and industry connections",
        "Start with small shows and low overhead to build your tour fund",
        "Merch is often the most profitable part of touring"
      ]}
    />
  )
}

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
