'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, MapPin, DollarSign, Users, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { TourOverview } from '@/components/tours/tour-overview';
import { ShowsList } from '@/components/tours/shows-list';
import { VenueManager } from '@/components/tours/venue-manager';
import { TourBudget } from '@/components/tours/tour-budget';
import { TourLogistics } from '@/components/tours/tour-logistics';

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

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTour(data.data);
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
          <Link href="/tours">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/tours">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{tour.name}</h1>
              <Badge className={getStatusColor(tour.status)}>
                {tour.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              {tour.description || 'No description provided'}
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Tour Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">
                  {Math.ceil((new Date(tour.end_date).getTime() - new Date(tour.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Shows</p>
                <p className="font-semibold">{tour.show_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="font-semibold">${tour.total_revenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Regions</p>
                <p className="font-semibold">{tour.regions.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TourOverview tour={tour} onTourUpdate={setTour} />
        </TabsContent>

        <TabsContent value="shows" className="space-y-4">
          <ShowsList tourId={tourId} />
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          <VenueManager />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <TourBudget tourId={tourId} budget={tour.budget} />
        </TabsContent>

        <TabsContent value="logistics" className="space-y-4">
          <TourLogistics tourId={tourId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}