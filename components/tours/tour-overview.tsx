'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Music, TrendingUp, Users, DollarSign, Edit } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  show_count: number;
  total_revenue: number;
  total_expenses: number;
  regions: string[];
  budget?: {
    total_budget: number;
    categories: Record<string, number>;
    spent_amount: number;
    currency: string;
  };
}

interface TourOverviewProps {
  tour: Tour;
  onTourUpdate: (tour: Tour) => void;
}

export function TourOverview({ tour, onTourUpdate }: TourOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'booking': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTourTypeIcon = (type: string) => {
    switch (type) {
      case 'headlining': return '🎤';
      case 'supporting': return '🎸';
      case 'festival': return '🎪';
      case 'residency': return '🏛️';
      case 'acoustic': return '🎵';
      case 'virtual': return '💻';
      default: return '🎵';
    }
  };

  const tourDuration = Math.ceil(
    (new Date(tour.end_date).getTime() - new Date(tour.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const netProfit = tour.total_revenue - tour.total_expenses;
  const profitMargin = tour.total_revenue > 0 ? (netProfit / tour.total_revenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{getTourTypeIcon(tour.type)}</div>
              <div>
                <CardTitle className="text-2xl">{tour.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {tour.description || 'No description provided'}
                </CardDescription>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getStatusColor(tour.status)}>
                    {tour.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {tour.type.replace('_', ' ')} tour
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Tour
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">
                  {tourDuration} days
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tour.start_date).toLocaleDateString()} - {new Date(tour.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Regions</p>
                <p className="font-semibold">
                  {tour.regions.length > 0 ? tour.regions.length : 'None specified'}
                </p>
                <p className="text-xs text-gray-500">
                  {tour.regions.length > 0 ? tour.regions.slice(0, 2).join(', ') : 'Add regions'}
                  {tour.regions.length > 2 && ` +${tour.regions.length - 2} more`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Music className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Shows</p>
                <p className="font-semibold">{tour.show_count}</p>
                <p className="text-xs text-gray-500">
                  {tour.show_count === 0 ? 'No shows scheduled' : 'performances scheduled'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${tour.total_revenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From {tour.show_count} shows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${tour.total_expenses.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Operating costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {profitMargin.toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tour Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Progress</CardTitle>
          <CardDescription>Track your tour's current status and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${tour.status === 'planning' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="font-medium">Planning</span>
              </div>
              <span className="text-sm text-gray-500">Tour concept and initial planning</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${tour.status === 'booking' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="font-medium">Booking</span>
              </div>
              <span className="text-sm text-gray-500">Securing venues and dates</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${tour.status === 'confirmed' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="font-medium">Confirmed</span>
              </div>
              <span className="text-sm text-gray-500">All shows confirmed and ready</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${tour.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="font-medium">In Progress</span>
              </div>
              <span className="text-sm text-gray-500">Tour is currently happening</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${tour.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                <span className="font-medium">Completed</span>
              </div>
              <span className="text-sm text-gray-500">Tour finished successfully</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your tour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Calendar className="w-6 h-6" />
              <span>Add Show</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <MapPin className="w-6 h-6" />
              <span>Add Venue</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="w-6 h-6" />
              <span>Manage Crew</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <DollarSign className="w-6 h-6" />
              <span>Update Budget</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}