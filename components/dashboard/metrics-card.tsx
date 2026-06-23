"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
}

export function MetricsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description
}: MetricsCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground"
  }[changeType]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs lg:text-sm font-medium truncate pr-2">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="text-lg lg:text-2xl font-bold truncate">{value}</div>
        {change && (
          <p className={`text-xs ${changeColor} truncate`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}