"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

// Mock data - in real app this would come from API
const mockFinancialData = [
  { month: "Jul", income: 1200, expenses: 800 },
  { month: "Aug", income: 1500, expenses: 950 },
  { month: "Sep", income: 1800, expenses: 1100 },
  { month: "Oct", income: 2200, expenses: 1300 },
  { month: "Nov", income: 1900, expenses: 1200 },
  { month: "Dec", income: 2500, expenses: 1400 },
]

export function FinancialOverview() {
  const currentMonth = mockFinancialData[mockFinancialData.length - 1]
  const previousMonth = mockFinancialData[mockFinancialData.length - 2]
  const netIncome = currentMonth.income - currentMonth.expenses
  const previousNetIncome = previousMonth.income - previousMonth.expenses
  
  const incomeChange = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
  const expenseChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
  const netChange = ((netIncome - previousNetIncome) / Math.abs(previousNetIncome)) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-xl lg:text-2xl font-bold text-green-600">${currentMonth.income.toLocaleString()}</p>
              <Badge variant={incomeChange >= 0 ? "default" : "destructive"} className="text-xs">
                {incomeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(incomeChange).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">This Month Income</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-xl lg:text-2xl font-bold text-red-600">${currentMonth.expenses.toLocaleString()}</p>
              <Badge variant={expenseChange <= 0 ? "default" : "destructive"} className="text-xs">
                {expenseChange <= 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(expenseChange).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">This Month Expenses</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className={`text-xl lg:text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netIncome.toLocaleString()}
              </p>
              <Badge variant={netChange >= 0 ? "default" : "destructive"} className="text-xs">
                {netChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(netChange).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">Net Income</p>
          </div>
        </div>
        
        <div className="h-48 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockFinancialData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#incomeGradient)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expenseGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}