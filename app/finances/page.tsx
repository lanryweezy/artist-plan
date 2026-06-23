"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  Download,
  Filter
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  source?: string
  project?: string
}

const mockTransactions: Transaction[] = [
  { id: "1", description: "Spotify Streams", amount: 1250.00, type: "income", category: "Streaming", date: "2026-01-15", source: "Spotify", project: "Summer Vibes Remix" },
  { id: "2", description: "Studio Session", amount: -350.00, type: "expense", category: "Production", date: "2026-01-14", project: "Midnight Dreams" },
  { id: "3", description: "Apple Music Royalties", amount: 890.00, type: "income", category: "Streaming", date: "2026-01-13", source: "Apple Music" },
  { id: "4", description: "Cover Art Design", amount: -200.00, type: "expense", category: "Artwork", date: "2026-01-12", project: "City Lights" },
  { id: "5", description: "Live Performance", amount: 2500.00, type: "income", category: "Live", date: "2026-01-10" },
  { id: "6", description: "Marketing Campaign", amount: -500.00, type: "expense", category: "Marketing", date: "2026-01-09", project: "Summer Vibes Remix" },
  { id: "7", description: "YouTube Ad Revenue", amount: 320.00, type: "income", category: "Streaming", date: "2026-01-08", source: "YouTube" },
  { id: "8", description: "Mixing & Mastering", amount: -800.00, type: "expense", category: "Production", date: "2026-01-07", project: "City Lights" },
  { id: "9", description: "Merch Sales", amount: 450.00, type: "income", category: "Merch", date: "2026-01-06" },
  { id: "10", description: "Software Subscription", amount: -29.99, type: "expense", category: "Tools", date: "2026-01-05" },
]

const monthlyData = [
  { month: "Aug", income: 1800, expenses: 900 },
  { month: "Sep", income: 2200, expenses: 1100 },
  { month: "Oct", income: 1900, expenses: 800 },
  { month: "Nov", income: 2800, expenses: 1500 },
  { month: "Dec", income: 3200, expenses: 1200 },
  { month: "Jan", income: 5410, expenses: 1879 },
]

const categoryData = [
  { name: "Streaming", value: 2460, color: "#8b5cf6" },
  { name: "Live", value: 2500, color: "#10b981" },
  { name: "Merch", value: 450, color: "#f59e0b" },
]

const categoryColors: Record<string, string> = {
  Streaming: "bg-purple-100 text-purple-800",
  Production: "bg-blue-100 text-blue-800",
  Marketing: "bg-pink-100 text-pink-800",
  Artwork: "bg-orange-100 text-orange-800",
  Live: "bg-green-100 text-green-800",
  Merch: "bg-yellow-100 text-yellow-800",
  Tools: "bg-gray-100 text-gray-800",
}

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    return matchesSearch && matchesType
  })

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
  const netIncome = totalIncome - totalExpenses

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Finances</h1>
            <p className="text-muted-foreground">
              Track your income, expenses, and financial goals
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>-8% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Income</p>
                  <p className={`text-3xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${netIncome.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${netIncome >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <Wallet className={`h-6 w-6 ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`} />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <span>Profit margin: {((netIncome / totalIncome) * 100).toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Monthly income vs expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Income Sources
              </CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-medium">${cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest income and expenses</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex gap-1">
                  {["all", "income", "expense"].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(type as typeof filterType)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {transaction.source && <span>• {transaction.source}</span>}
                        {transaction.project && <span>• {transaction.project}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={categoryColors[transaction.category]}>
                      {transaction.category}
                    </Badge>
                    <span className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
