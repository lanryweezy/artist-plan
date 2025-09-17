'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Users, Star, Search, Filter } from 'lucide-react';
import { CreateVenueDialog } from './create-venue-dialog';

interface Venue {
  id: string;
  name: string;
  type: string;
  capacity?: number;
  location: {
    address: string;
    city: string;
    state?: string;
    country: string;
  };
  rating?: number;
  times_played: number;
  is_favorite: boolean;
  last_played?: string;
}

export function VenueManager() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/tours/venues', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVenues(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueCreated = (newVenue: Venue) => {
    setVenues(prev => [...prev, newVenue]);
    setShowCreateDialog(false);
  };

  const toggleFavorite = async (venueId: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/tours/venues/${venueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_favorite: !isFavorite })
      });

      if (response.ok) {
        setVenues(prev => prev.map(venue => 
          venue.id === venueId 
            ? { ...venue, is_favorite: !isFavorite }
            : venue
        ));
      }
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };

  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case 'club': return 'bg-blue-100 text-blue-800';
      case 'theater': return 'bg-purple-100 text-purple-800';
      case 'arena': return 'bg-red-100 text-red-800';
      case 'stadium': return 'bg-green-100 text-green-800';
      case 'festival_stage': return 'bg-yellow-100 text-yellow-800';
      case 'outdoor': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'favorites' && venue.is_favorite) ||
                         venue.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold">Venue Management</h2>
          <p className="text-gray-600">Manage your venue database and booking information</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search venues by name, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="favorites">Favorites</option>
          <option value="club">Clubs</option>
          <option value="theater">Theaters</option>
          <option value="arena">Arenas</option>
          <option value="stadium">Stadiums</option>
          <option value="festival_stage">Festival Stages</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {venues.length === 0 ? 'No venues yet' : 'No venues match your search'}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {venues.length === 0 
                ? 'Add venues to your database to start booking shows'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {venues.length === 0 && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Venue
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(venue.id, venue.is_favorite)}
                        className="p-1 h-auto"
                      >
                        <Star 
                          className={`w-4 h-4 ${venue.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                        />
                      </Button>
                    </div>
                    <CardDescription>
                      {venue.location.city}, {venue.location.country}
                    </CardDescription>
                  </div>
                  <Badge className={getVenueTypeColor(venue.type)}>
                    {venue.type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {venue.location.address}
                  </div>
                  
                  {venue.capacity && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      Capacity: {venue.capacity.toLocaleString()}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      Played: {venue.times_played} times
                    </div>
                    {venue.rating && (
                      <div className="flex items-center text-yellow-600">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {venue.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  
                  {venue.last_played && (
                    <div className="text-xs text-gray-500">
                      Last played: {new Date(venue.last_played).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Venue Dialog */}
      <CreateVenueDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onVenueCreated={handleVenueCreated}
      />
    </div>
  );
}