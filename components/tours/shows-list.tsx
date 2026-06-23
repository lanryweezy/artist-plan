'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';

interface Show {
  id: string;
  title: string;
  date: string;
  venue_id: string;
  status: string;
  ticket_price?: number;
  expected_attendance?: number;
  actual_attendance?: number;
  setlist: string[];
  notes?: string;
  financials?: {
    guarantee?: number;
    door_split_percentage?: number;
    actual_payout?: number;
    expenses: Record<string, number>;
  };
  logistics?: {
    load_in_time?: string;
    show_start_time?: string;
    curfew_time?: string;
  };
}

interface ShowsListProps {
  tourId: string;
}

export function ShowsList({ tourId }: ShowsListProps) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchShows();
  }, [tourId]);

  const fetchShows = async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}/shows`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setShows(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tentative': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'postponed': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBD';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredShows = shows.filter(show => 
    filterStatus === 'all' || show.status === filterStatus
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Shows & Performances</h2>
          <p className="text-gray-600">Manage your tour dates and performance details</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Show
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All Shows ({shows.length})
        </Button>
        <Button
          variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('confirmed')}
        >
          Confirmed ({shows.filter(s => s.status === 'confirmed').length})
        </Button>
        <Button
          variant={filterStatus === 'tentative' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('tentative')}
        >
          Tentative ({shows.filter(s => s.status === 'tentative').length})
        </Button>
        <Button
          variant={filterStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('completed')}
        >
          Completed ({shows.filter(s => s.status === 'completed').length})
        </Button>
      </div>

      {/* Shows List */}
      {filteredShows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {shows.length === 0 ? 'No shows scheduled' : 'No shows match your filter'}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {shows.length === 0 
                ? 'Add your first show to start building your tour schedule'
                : 'Try adjusting your filter to see more shows'
              }
            </p>
            {shows.length === 0 && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Show
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredShows.map((show) => (
            <Card key={show.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{show.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(show.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(show.status)}>
                    {show.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Venue & Time */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Venue & Time
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Venue ID: {show.venue_id}</div>
                      <div>Show: {formatTime(show.logistics?.show_start_time)}</div>
                      <div>Curfew: {formatTime(show.logistics?.curfew_time)}</div>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Attendance
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Expected: {show.expected_attendance?.toLocaleString() || 'TBD'}</div>
                      <div>Actual: {show.actual_attendance?.toLocaleString() || 'TBD'}</div>
                      <div>Ticket: ${show.ticket_price || 'TBD'}</div>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Financials
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Guarantee: ${show.financials?.guarantee?.toLocaleString() || 'TBD'}</div>
                      <div>Payout: ${show.financials?.actual_payout?.toLocaleString() || 'TBD'}</div>
                      <div>Door Split: {show.financials?.door_split_percentage || 0}%</div>
                    </div>
                  </div>

                  {/* Setlist */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Setlist
                    </h4>
                    <div className="text-sm text-gray-600">
                      {show.setlist.length > 0 ? (
                        <div>
                          {show.setlist.slice(0, 3).map((song, index) => (
                            <div key={index}>{index + 1}. {song}</div>
                          ))}
                          {show.setlist.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{show.setlist.length - 3} more songs
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500">No setlist yet</div>
                      )}
                    </div>
                  </div>
                </div>

                {show.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">Notes</h5>
                    <p className="text-sm text-gray-600">{show.notes}</p>
                  </div>
                )}

                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    Edit Show
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}