'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { TourList } from '@/components/tours/tour-list';
import { CreateTourDialog } from '@/components/tours/create-tour-dialog';
import { TourStats } from '@/components/tours/tour-stats';

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
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/tours', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTours(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourCreated = (newTour: Tour) => {
    setTours(prev => [...prev, newTour]);
    setShowCreateDialog(false);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tour Management</h1>
          <p className="text-gray-600 mt-1">
            Plan, manage, and track your tours and performances
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Tour
        </Button>
      </div>

      {/* Tour Statistics */}
      <TourStats tours={tours} />

      {/* Tours Grid */}
      {tours.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tours yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first tour to start planning performances and managing logistics
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Tour
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{tour.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {tour.description || 'No description'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(tour.status)}>
                    {tour.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(tour.start_date).toLocaleDateString()} - {new Date(tour.end_date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {tour.regions.length > 0 ? tour.regions.join(', ') : 'No regions specified'}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {tour.show_count} shows
                    </div>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${(tour.total_revenue - tour.total_expenses).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.location.href = `/tours/${tour.id}`}
                    >
                      Manage Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Tour Dialog */}
      <CreateTourDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onTourCreated={handleTourCreated}
      />
    </div>
  );
}