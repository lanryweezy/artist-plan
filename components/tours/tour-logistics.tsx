'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Truck, Users, Route } from 'lucide-react';

interface LogisticsData {
  total_distance_miles: number;
  total_travel_time_hours: number;
  show_count: number;
  shows: Array<{
    id: string;
    title: string;
    date: string;
    venue: {
      name: string;
      location: {
        city: string;
        state?: string;
        country: string;
      };
    };
    logistics?: {
      travel_distance_miles?: number;
      travel_time_hours?: number;
      load_in_time?: string;
      sound_check_time?: string;
      doors_open_time?: string;
      show_start_time?: string;
      curfew_time?: string;
      accommodation?: string;
      parking_info?: string;
    };
  }>;
  crew_members: Array<{
    name: string;
    role: string;
    contact?: string;
  }>;
  equipment_list: Array<{
    item: string;
    quantity: number;
    notes?: string;
  }>;
}

interface TourLogisticsProps {
  tourId: string;
}

export function TourLogistics({ tourId }: TourLogisticsProps) {
  const [logisticsData, setLogisticsData] = useState<LogisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogisticsData();
  }, [tourId]);

  const fetchLogisticsData = async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}/logistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogisticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching logistics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not set';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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

  if (!logisticsData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No logistics data available</h3>
        <p className="text-gray-600">Add shows to your tour to see logistics information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Tour Logistics</h2>
        <p className="text-gray-600">Manage travel, crew, and equipment for your tour</p>
      </div>

      {/* Logistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Route className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logisticsData.total_distance_miles.toLocaleString()}</div>
            <p className="text-xs text-gray-500">miles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travel Time</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(logisticsData.total_travel_time_hours)}</div>
            <p className="text-xs text-gray-500">hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logisticsData.crew_members.length}</div>
            <p className="text-xs text-gray-500">team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Items</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logisticsData.equipment_list.length}</div>
            <p className="text-xs text-gray-500">items tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Show Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Show Schedule & Logistics</CardTitle>
          <CardDescription>Detailed logistics for each show</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logisticsData.shows.map((show, index) => (
              <div key={show.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{show.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {show.venue.name}, {show.venue.location.city}, {show.venue.location.country}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(show.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="outline">Show {index + 1}</Badge>
                </div>

                {show.logistics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Schedule</h5>
                      <div className="text-xs space-y-1">
                        <div>Load In: {formatTime(show.logistics.load_in_time)}</div>
                        <div>Sound Check: {formatTime(show.logistics.sound_check_time)}</div>
                        <div>Doors: {formatTime(show.logistics.doors_open_time)}</div>
                        <div>Show: {formatTime(show.logistics.show_start_time)}</div>
                        <div>Curfew: {formatTime(show.logistics.curfew_time)}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Travel</h5>
                      <div className="text-xs space-y-1">
                        <div>Distance: {show.logistics.travel_distance_miles || 0} miles</div>
                        <div>Time: {show.logistics.travel_time_hours || 0} hours</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Accommodation</h5>
                      <div className="text-xs">
                        {show.logistics.accommodation || 'Not specified'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Parking</h5>
                      <div className="text-xs">
                        {show.logistics.parking_info || 'Not specified'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crew Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crew Members</CardTitle>
            <CardDescription>Tour crew and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            {logisticsData.crew_members.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No crew members added</p>
            ) : (
              <div className="space-y-3">
                {logisticsData.crew_members.map((member, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                    {member.contact && (
                      <div className="text-sm text-gray-500">{member.contact}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment List</CardTitle>
            <CardDescription>Equipment and gear for the tour</CardDescription>
          </CardHeader>
          <CardContent>
            {logisticsData.equipment_list.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No equipment items added</p>
            ) : (
              <div className="space-y-3">
                {logisticsData.equipment_list.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{item.item}</div>
                      {item.notes && (
                        <div className="text-sm text-gray-600">{item.notes}</div>
                      )}
                    </div>
                    <Badge variant="secondary">x{item.quantity}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}