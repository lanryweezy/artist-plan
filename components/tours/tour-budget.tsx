'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, Plus, Edit } from 'lucide-react';

interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
}

interface TourBudgetProps {
  tourId: string;
  budget?: {
    total_budget: number;
    categories: Record<string, number>;
    spent_amount: number;
    currency: string;
  };
}

export function TourBudget({ tourId, budget: initialBudget }: TourBudgetProps) {
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');

  useEffect(() => {
    fetchBudgetData();
  }, [tourId]);

  const fetchBudgetData = async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}/budget`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.data);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (updatedBudget: any) => {
    try {
      const response = await fetch(`/api/tours/${tourId}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedBudget)
      });

      if (response.ok) {
        fetchBudgetData();
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const addCategory = () => {
    if (!newCategoryName || !newCategoryAmount) return;

    const currentBudget = budgetData?.budget || { categories: {} };
    const updatedBudget = {
      ...currentBudget,
      categories: {
        ...currentBudget.categories,
        [newCategoryName]: parseFloat(newCategoryAmount)
      }
    };

    updateBudget(updatedBudget);
    setNewCategoryName('');
    setNewCategoryAmount('');
  };

  const updateCategory = (categoryName: string, amount: number) => {
    const currentBudget = budgetData?.budget || { categories: {} };
    const updatedBudget = {
      ...currentBudget,
      categories: {
        ...currentBudget.categories,
        [categoryName]: amount
      }
    };

    updateBudget(updatedBudget);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const budget = budgetData?.budget || {};
  const totalBudget = Object.values(budget.categories || {}).reduce((sum: number, amount: any) => sum + amount, 0);
  const totalSpent = budgetData?.total_expenses || 0;
  const totalRevenue = budgetData?.total_revenue || 0;
  const netProfit = totalRevenue - totalSpent;
  const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const categories: BudgetCategory[] = Object.entries(budget.categories || {}).map(([name, budgeted]) => ({
    name,
    budgeted: budgeted as number,
    spent: 0 // This would come from actual expense tracking
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Tour Budget & Expenses</h2>
        <p className="text-gray-600">Track your tour budget and monitor expenses</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Allocated budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {budgetUsedPercentage.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">From {budgetData?.show_count || 0} shows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Revenue - Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Usage</CardTitle>
          <CardDescription>Track how much of your budget has been spent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Used</span>
              <span>{budgetUsedPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUsedPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>${totalSpent.toLocaleString()} spent</span>
              <span>${(totalBudget - totalSpent).toLocaleString()} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Manage your budget allocation by category</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium capitalize">{category.name.replace('_', ' ')}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm text-gray-600">
                      Budgeted: ${category.budgeted.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Spent: ${category.spent.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0} 
                      className="h-1"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategory(category.name)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {/* Add New Category */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Budget amount"
                    value={newCategoryAmount}
                    onChange={(e) => setNewCategoryAmount(e.target.value)}
                  />
                </div>
                <Button onClick={addCategory} disabled={!newCategoryName || !newCategoryAmount}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}