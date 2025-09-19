"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X, Tag, FolderOpen, FileType } from "lucide-react";

export interface Filters {
  type: string | null;
  tags: string[];
  categories: string[];
  projectId: string | null;
}

interface ContentFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const CONTENT_TYPES = [
  { value: "audio", label: "Audio", icon: "🎵" },
  { value: "video", label: "Video", icon: "🎬" },
  { value: "image", label: "Image", icon: "🖼️" },
  { value: "document", label: "Document", icon: "📄" },
  { value: "archive", label: "Archive", icon: "📦" },
  { value: "other", label: "Other", icon: "📁" }
];

export function ContentFilters({ filters, onChange }: ContentFiltersProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    setLoading(true);
    try {
      const [tagsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/content/tags/all", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        }),
        fetch("/api/content/categories/all", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
      ]);

      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json();
        setAvailableTags(tagsData.tags || []);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setAvailableCategories(categoriesData.categories || []);
      }
    } catch (error) {
      // Failed to load filter options
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof Filters, value: string | string[] | null) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilter("tags", newTags);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter("categories", newCategories);
  };

  const clearAllFilters = () => {
    onChange({
      type: null,
      tags: [],
      categories: [],
      projectId: null
    });
  };

  const hasActiveFilters = filters.type || filters.tags.length > 0 || filters.categories.length > 0 || filters.projectId;

  return (
    <div className="space-y-3">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        {/* Content Type Filter */}
        <Select value={filters.type || ""} onValueChange={(value) => updateFilter("type", value || null)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <FileType className="h-4 w-4" />
              <SelectValue placeholder="Content Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {CONTENT_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Tag className="h-4 w-4" />
              Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Tags</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {availableTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
                {availableTags.length === 0 && !loading && (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Categories Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Categories</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
                {availableCategories.length === 0 && !loading && (
                  <p className="text-sm text-muted-foreground">No categories available</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {CONTENT_TYPES.find(t => t.value === filters.type)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("type", null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleCategory(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}