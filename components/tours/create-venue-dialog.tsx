'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface CreateVenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVenueCreated: (venue: Venue) => void;
}

export function CreateVenueDialog({ open, onOpenChange, onVenueCreated }: CreateVenueDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    website: '',
    notes: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    },
    contacts: [] as Array<{
      name: string;
      role: string;
      email: string;
      phone: string;
    }>
  });
  const [loading, setLoading] = useState(false);

  const venueTypes = [
    { value: 'club', label: 'Club' },
    { value: 'theater', label: 'Theater' },
    { value: 'arena', label: 'Arena' },
    { value: 'stadium', label: 'Stadium' },
    { value: 'festival_stage', label: 'Festival Stage' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'house_concert', label: 'House Concert' },
    { value: 'virtual', label: 'Virtual' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.location.address || !formData.location.city || !formData.location.country) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined
      };

      const response = await fetch('/api/tours/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const data = await response.json();
        onVenueCreated(data.data);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: '',
      website: '',
      notes: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
      },
      contacts: []
    });
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', role: '', email: '', phone: '' }]
    }));
  };

  const updateContact = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
          <DialogDescription>
            Add a venue to your database for booking shows and managing logistics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter venue name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Venue Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {venueTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="Enter capacity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://venue-website.com"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  placeholder="City"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, state: e.target.value }
                  }))}
                  placeholder="State or Province"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.location.country}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, country: e.target.value }
                  }))}
                  placeholder="Country"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.location.postal_code}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, postal_code: e.target.value }
                  }))}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Contacts</h3>
              <Button type="button" variant="outline" size="sm" onClick={addContact}>
                Add Contact
              </Button>
            </div>
            
            {formData.contacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Contact {index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeContact(index)}
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Role"
                    value={contact.role}
                    onChange={(e) => updateContact(index, 'role', e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContact(index, 'email', e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about the venue"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Venue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}