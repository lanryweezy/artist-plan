"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, DollarSign, Calculator, Plus, Calendar, Music, TrendingUp, TrendingDown, Trash2 } from "lucide-react"

// Tours Tab
function ToursTab() {
  const tours = [
    { id: "1", name: "Summer Tour 2026", status: "planning", dates: "Aug 1 - Aug 15", shows: 8, cities: "LA, SF, Portland, Seattle, SLC, Denver, St. Louis, Nashville" },
    { id: "2", name: "Spring Weekend Run", status: "completed", dates: "Mar 15 - Mar 18", shows: 3, cities: "NYC, Boston, Philly" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">My Tours</h3>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Tour</Button>
      </div>
      {tours.map(tour => (
        <Card key={tour.id} className="hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{tour.name}</p>
                <p className="text-sm text-muted-foreground">{tour.dates} • {tour.shows} shows • {tour.cities}</p>
              </div>
              <Badge variant={tour.status === "completed" ? "default" : "secondary"}>{tour.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Tour Budget Tab
function BudgetTab() {
  const [shows, setShows] = useState(8)
  const [guarantee, setGuarantee] = useState(1500)
  const [attendance, setAttendance] = useState(200)
  const [ticketPrice, setTicketPrice] = useState(18)
  const [merchPerHead, setMerchPerHead] = useState(7)
  const [merchCut, setMerchCut] = useState(75)
  const [busWeekly, setBusWeekly] = useState(3500)
  const [crewWeekly, setCrewWeekly] = useState(5000)
  const [hotelsNight, setHotelsNight] = useState(200)
  const [perDiem, setPerDiem] = useState(50)
  const [teamSize, setTeamSize] = useState(5)
  const [managerPct, setManagerPct] = useState(15)

  const weeks = Math.ceil(shows / 4)
  const guarantees = shows * guarantee
  const tickets = shows * attendance * ticketPrice
  const merch = shows * attendance * merchPerHead * (merchCut / 100)
  const totalRevenue = guarantees + tickets + merch

  const bus = weeks * busWeekly
  const crew = weeks * crewWeekly
  const hotels = weeks * 7 * hotelsNight
  const diem = weeks * 7 * perDiem * teamSize
  const totalExpenses = bus + crew + hotels + diem

  const managerFee = guarantees * (managerPct / 100)
  const net = totalRevenue - totalExpenses - managerFee

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className="text-xs text-muted-foreground">Shows</label><Input type="number" value={shows} onChange={e => setShows(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Avg Guarantee</label><Input type="number" value={guarantee} onChange={e => setGuarantee(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Avg Attendance</label><Input type="number" value={attendance} onChange={e => setAttendance(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Ticket Price</label><Input type="number" value={ticketPrice} onChange={e => setTicketPrice(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Merch/Head</label><Input type="number" value={merchPerHead} onChange={e => setMerchPerHead(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Your Merch %</label><Input type="number" value={merchCut} onChange={e => setMerchCut(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Manager %</label><Input type="number" value={managerPct} onChange={e => setManagerPct(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Team Size</label><Input type="number" value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} className="h-8" /></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className="text-xs text-muted-foreground">Bus/Week</label><Input type="number" value={busWeekly} onChange={e => setBusWeekly(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Crew/Week</label><Input type="number" value={crewWeekly} onChange={e => setCrewWeekly(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Hotels/Night</label><Input type="number" value={hotelsNight} onChange={e => setHotelsNight(Number(e.target.value))} className="h-8" /></div>
        <div><label className="text-xs text-muted-foreground">Per Diem/Person</label><Input type="number" value={perDiem} onChange={e => setPerDiem(Number(e.target.value))} className="h-8" /></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Guarantees</p><p className="text-lg font-bold">${guarantees.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Merch (Net)</p><p className="text-lg font-bold">${merch.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-lg font-bold text-green-500">${totalRevenue.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Net Profit</p><p className={`text-lg font-bold ${net >= 0 ? "text-green-500" : "text-red-500"}`}>{net >= 0 ? "+" : ""}${net.toLocaleString()}</p></CardContent></Card>
      </div>

      <div className="p-3 bg-muted/50 rounded text-xs space-y-1">
        <p>Expenses: ${totalExpenses.toLocaleString()} (bus ${bus.toLocaleString()} + crew ${crew.toLocaleString()} + hotels ${hotels.toLocaleString()} + per diem ${diem.toLocaleString()})</p>
        <p>Manager fee ({managerPct}%): ${managerFee.toLocaleString()}</p>
        <p className="font-medium">Profit margin: {((net / totalRevenue) * 100).toFixed(1)}%</p>
      </div>
    </div>
  )
}

export default function TouringPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Touring</h1><p className="text-muted-foreground">Plan tours and track budgets</p></div>
        <Tabs defaultValue="tours" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tours" className="gap-2"><MapPin className="h-4 w-4" />Tours</TabsTrigger>
            <TabsTrigger value="budget" className="gap-2"><Calculator className="h-4 w-4" />Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="tours"><ToursTab /></TabsContent>
          <TabsContent value="budget"><BudgetTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
