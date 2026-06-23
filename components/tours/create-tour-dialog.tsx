'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

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

interface CreateTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTourCreated: (tour: Tour) => void;
}

export function CreateTourDialog({ open, onOpenChange, onTourCreated }: CreateTourDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
    regions: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [regionInput, setRegionInput] = useState('');

  const tourTypes = [
    { value: 'headlining', label: 'Headlining' },
    { value: 'supporting', label: 'Supporting' },
    { value: 'festival', label: 'Festival' },
    { value: 'residency', label: 'Residency' },
    { value: 'acoustic', label: 'Acoustic' },
    { value: 'virtual', label: 'Virtual' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.start_date || !formData.end_date) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          start_date: formData.start_date.toISOString(),
          end_date: formData.end_date.toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        onTourCreated(data.data);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      start_date: undefined,
      end_date: undefined,
      regions: []
    });
    setRegionInput('');
  };

  const addRegion = () => {
    if (regionInput.trim() && !formData.regions.includes(regionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        regions: [...prev.regions, regionInput.trim()]
      }));
      setRegionInput('');
    }
  };

  const removeRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.filter(r => r !== region)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Tour</DialogTitle>
          <DialogDescription>
            Set up a new tour to start planning your performances and managing logistics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tour Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter tour name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your tour"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tour Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tour type" />
              </SelectTrigger>
              <SelectContent>
                {tourTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Regions</Label>
            <div className="flex gap-2">
              <Input
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                placeholder="Add region (e.g., North America)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRegion())}
              />
              <Button type="button" onClick={addRegion} variant="outline">
                Add
              </Button>
            </div>
            {formData.regions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.regions.map((region) => (
                  <span
                    key={region}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-200"
                    onClick={() => removeRegion(region)}
                  >
                    {region} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Tour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}