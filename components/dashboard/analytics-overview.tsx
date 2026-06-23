"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Play, Heart } from "lucide-react"

// Mock analytics data
const streamingData = [
  { platform: "Spotify", plays: 8420, growth: 12.5 },
  { platform: "Apple Music", plays: 3240, growth: 8.3 },
  { platform: "YouTube", plays: 5680, growth: 15.2 },
  { platform: "SoundCloud", plays: 1890, growth: -2.1 },
  { platform: "Bandcamp", plays: 450, growth: 22.8 }
]

const audienceData = [
  { age: "18-24", percentage: 28, color: "#8884d8" },
  { age: "25-34", percentage: 35, color: "#82ca9d" },
  { age: "35-44", percentage: 22, color: "#ffc658" },
  { age: "45-54", percentage: 12, color: "#ff7300" },
  { age: "55+", percentage: 3, color: "#00ff00" }
]

const engagementMetrics = [
  { metric: "Total Plays", value: "19.7K", change: "+12.3%", icon: Play, color: "text-blue-600" },
  { metric: "Followers", value: "2.3K", change: "+8.7%", icon: Users, color: "text-green-600" },
  { metric: "Likes", value: "1.2K", change: "+15.2%", icon: Heart, color: "text-red-600" },
  { metric: "Shares", value: "456", change: "+22.1%", icon: TrendingUp, color: "text-purple-600" }
]

export function AnalyticsOverview() {
  const totalPlays = streamingData.reduce((sum, platform) => sum + platform.plays, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Streaming Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Streaming Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-2xl font-bold">{totalPlays.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Plays This Month</p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streamingData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="platform" type="category" width={80} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), "Plays"]}
                  />
                  <Bar dataKey="plays" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {streamingData.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between text-sm">
                  <span>{platform.platform}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{platform.plays.toLocaleString()}</span>
                    <Badge 
                      variant={platform.growth >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {platform.growth >= 0 ? "+" : ""}{platform.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Audience Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {engagementMetrics.map((metric) => (
                <div key={metric.metric} className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-lg font-bold">{metric.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{metric.metric}</p>
                  <Badge variant="outline" className="text-xs">
                    {metric.change}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Age Demographics Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Audience"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Age Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {audienceData.map((item) => (
                <div key={item.age} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.age}: {item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}