"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  MapPin,
  Music,
  FileText,
  Shield
} from "lucide-react"

interface TourExpense {
  id: string
  category: string
  item: string
  amount: number
}

interface TourShow {
  id: string
  venue: string
  city: string
  guarantee: number
  expectedAttendance: number
  ticketPrice: number
  merchPerHead: number
  merchCut: number
}

const defaultExpenses: TourExpense[] = [
  { id: "1", category: "Transportation", item: "Tour bus rental (per week)", amount: 3500 },
  { id: "2", category: "Transportation", item: "Gas/diesel", amount: 800 },
  { id: "3", category: "Crew", item: "Tour manager ($2,000-5,000/week)", amount: 3000 },
  { id: "4", category: "Crew", item: "Sound engineer", amount: 1500 },
  { id: "5", category: "Crew", item: "Monitor engineer", amount: 1200 },
  { id: "6", category: "Crew", item: "Lighting tech", amount: 1000 },
  { id: "7", category: "Crew", item: "Merch seller", amount: 800 },
  { id: "8", category: "Crew", item: "Band members (per person)", amount: 2000 },
  { id: "9", category: "Accommodation", item: "Hotels (per night, 2 rooms)", amount: 300 },
  { id: "10", category: "Accommodation", item: "Per diem (per person/day)", amount: 50 },
  { id: "11", category: "Production", item: "Backline rental", amount: 1500 },
  { id: "12", category: "Production", item: "Insurance", amount: 500 },
  { id: "13", category: "Marketing", item: "Poster/flyer printing", amount: 300 },
  { id: "14", category: "Marketing", item: "Social media ads", amount: 500 },
  { id: "15", category: "Venue", item: "Hall fees (per show, ~25-30% of merch)", amount: 200 },
]

const defaultShows: TourShow[] = [
  { id: "1", venue: "The Roxy", city: "Los Angeles", guarantee: 2000, expectedAttendance: 300, ticketPrice: 20, merchPerHead: 8, merchCut: 75 },
  { id: "2", venue: "Slim's", city: "San Francisco", guarantee: 1500, expectedAttendance: 250, ticketPrice: 18, merchPerHead: 7, merchCut: 75 },
  { id: "3", venue: "Doug Fir Lounge", city: "Portland", guarantee: 1200, expectedAttendance: 200, ticketPrice: 15, merchPerHead: 6, merchCut: 70 },
  { id: "4", venue: "Neumos", city: "Seattle", guarantee: 1800, expectedAttendance: 350, ticketPrice: 18, merchPerHead: 8, merchCut: 75 },
  { id: "5", venue: "Urban Lounge", city: "Salt Lake City", guarantee: 800, expectedAttendance: 150, ticketPrice: 15, merchPerHead: 5, merchCut: 70 },
  { id: "6", venue: "Globe Hall", city: "Denver", guarantee: 1200, expectedAttendance: 200, ticketPrice: 18, merchPerHead: 7, merchCut: 75 },
  { id: "7", venue: "Blueberry Hill", city: "St. Louis", guarantee: 1000, expectedAttendance: 180, ticketPrice: 15, merchPerHead: 6, merchCut: 70 },
  { id: "8", venue: "The Basement", city: "Nashville", guarantee: 1500, expectedAttendance: 250, ticketPrice: 18, merchPerHead: 7, merchCut: 75 },
]

function BudgetTab() {
  const [expenses, setExpenses] = useState<TourExpense[]>(defaultExpenses)
  const [newExpense, setNewExpense] = useState({ category: "", item: "", amount: 0 })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const weeklyExpenses = expenses.reduce((sum, e) => {
    if (e.category === "Crew") return sum + e.amount
    return sum
  }, 0)

  const categories = Array.from(new Set(expenses.map(e => e.category)))

  const addExpense = () => {
    if (!newExpense.item || newExpense.amount <= 0) return
    setExpenses(prev => [...prev, { ...newExpense, id: Date.now().toString() }])
    setNewExpense({ category: "", item: "", amount: 0 })
  }

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Tour Cost</p>
            <p className="text-3xl font-bold text-red-500">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Weekly Burn Rate</p>
            <p className="text-3xl font-bold">${weeklyExpenses.toLocaleString()}/wk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Per-Show Cost</p>
            <p className="text-3xl font-bold">${(totalExpenses / 8).toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 grid grid-cols-3 gap-2">
          <Input placeholder="Category" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} />
          <Input placeholder="Item" value={newExpense.item} onChange={e => setNewExpense({...newExpense, item: e.target.value})} />
          <Input type="number" placeholder="Amount" value={newExpense.amount || ""} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
        </div>
        <Button onClick={addExpense}><Plus className="h-4 w-4" /></Button>
      </div>

      {categories.map(cat => (
        <Card key={cat}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              {cat}
              <Badge variant="secondary">${expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0).toLocaleString()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenses.filter(e => e.category === cat).map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{exp.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${exp.amount.toLocaleString()}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeExpense(exp.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RevenueTab() {
  const [shows, setShows] = useState<TourShow[]>(defaultShows)

  const totalGuarantees = shows.reduce((s, sh) => s + sh.guarantee, 0)
  const totalTicketRevenue = shows.reduce((s, sh) => s + (sh.expectedAttendance * sh.ticketPrice), 0)
  const totalMerchRevenue = shows.reduce((s, sh) => s + (sh.expectedAttendance * sh.merchPerHead), 0)
  const totalMerchToVenue = shows.reduce((s, sh) => s + (sh.expectedAttendance * sh.merchPerHead * (1 - sh.merchCut / 100)), 0)
  const netMerch = totalMerchRevenue - totalMerchToVenue
  const totalRevenue = totalGuarantees + netMerch

  const totalExpenses = 18600
  const profit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Guarantees</p>
            <p className="text-3xl font-bold">${totalGuarantees.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Merch (Net)</p>
            <p className="text-3xl font-bold">${netMerch.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Profit/Loss</p>
            <p className={`text-3xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
              {profit >= 0 ? "+" : ""}${profit.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Show-by-Show Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shows.map(show => {
              const showTicket = show.expectedAttendance * show.ticketPrice
              const showMerch = show.expectedAttendance * show.merchPerHead
              const showMerchToVenue = showMerch * (1 - show.merchCut / 100)
              const showNet = show.guarantee + (showMerch - showMerchToVenue)

              return (
                <div key={show.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{show.venue}</p>
                      <p className="text-xs text-muted-foreground">{show.city} • {show.expectedAttendance} people • ${show.ticketPrice} tickets</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Guarantee</p>
                      <p className="font-medium">${show.guarantee.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Tickets</p>
                      <p className="font-medium">${showTicket.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Merch</p>
                      <p className="font-medium">${(showMerch - showMerchToVenue).toFixed(0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Total</p>
                      <p className="font-bold">${showNet.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GuideTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Touring Economics from Passman
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>"You're lucky to take home 40% to 50% of your gross income" from touring.</p>
          <p>A manager's 15% of gross on touring can take a huge bite — if you earn $100K gross and net $45K, manager gets $15K (33% of your take-home).</p>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium mb-1">Passman's Tips to Maximize Tour Profit:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• "You don't always need to carry as many people as you think"</li>
              <li>• "Larger staging means more trucks and crew — fans are there to see YOU"</li>
              <li>• "Travel light — hub from one city, play venues within short flight"</li>
              <li>• "You can make more money by cutting costs than by earning more income"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Streams on Tour</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between p-2 border rounded">
              <span>Guarantees / Door Splits</span>
              <span className="font-medium">Primary</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Merch Sales</span>
              <span className="font-medium">Often largest profit</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Sponsorship</span>
              <span className="font-medium">When available</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>VIP Packages</span>
              <span className="font-medium">High margin add-on</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between p-2 border rounded">
              <span>Transportation</span>
              <span className="font-medium text-red-500">Biggest cost</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Crew & Band</span>
              <span className="font-medium">Weekly salaries</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Accommodation</span>
              <span className="font-medium">Hotels + per diem</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Production</span>
              <span className="font-medium">Backline, insurance</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Marketing</span>
              <span className="font-medium">Ads, posters</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Merch Economics</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Hall fees:</strong> Venues take 25-30% of gross merch sales</p>
          <p>• <strong>Tour merchandiser:</strong> Takes 15-25% of net profit, handles production/transport/sales</p>
          <p>• <strong>Artist typically keeps:</strong> 75-80% of net profit after merchandiser costs</p>
          <p>• <strong>Merch advances:</strong> Merchandisers may advance funds for production — but these are RECOUPABLE (unlike label advances)</p>
          <p>• <strong>Performance minimum:</strong> Merchandisers set minimum attendance/merch targets — miss them and they can cancel</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TourBudgetPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tour Budget</h1>
          <p className="text-muted-foreground">Plan and track tour finances</p>
        </div>

        <Tabs defaultValue="budget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="budget" className="gap-2">
              <Calculator className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="revenue" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <FileText className="h-4 w-4" />
              Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budget"><BudgetTab /></TabsContent>
          <TabsContent value="revenue"><RevenueTab /></TabsContent>
          <TabsContent value="guide"><GuideTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

