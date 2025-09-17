'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, DollarSign, TrendingUp } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  status: string;
  show_count: number;
  total_revenue: number;
  total_expenses: number;
  start_date: string;
  end_date: string;
}

interface TourStatsProps {
  tours: Tour[];
}

export function TourStats({ tours }: TourStatsProps) {
  const activeTours = tours.filter(tour => 
    tour.status === 'in_progress' || tour.status === 'confirmed'
  ).length;
  
  const totalShows = tours.reduce((sum, tour) => sum + tour.show_count, 0);
  
  const totalRevenue = tours.reduce((sum, tour) => sum + tour.total_revenue, 0);
  const totalExpenses = tours.reduce((sum, tour) => sum + tour.total_expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  const upcomingShows = tours.filter(tour => {
    const startDate = new Date(tour.start_date);
    const now = new Date();
    return startDate > now && (tour.status === 'confirmed' || tour.status === 'booking');
  }).reduce((sum, tour) => sum + tour.show_count, 0);

  const stats = [
    {
      title: 'Active Tours',
      value: activeTours,
      icon: Calendar,
      description: 'Currently running or confirmed',
      color: 'text-blue-600'
    },
    {
      title: 'Total Shows',
      value: totalShows,
      icon: MapPin,
      description: 'Across all tours',
      color: 'text-green-600'
    },
    {
      title: 'Net Profit',
      value: `$${netProfit.toLocaleString()}`,
      icon: DollarSign,
      description: 'Revenue minus expenses',
      color: netProfit >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Upcoming Shows',
      value: upcomingShows,
      icon: TrendingUp,
      description: 'Scheduled for future',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}