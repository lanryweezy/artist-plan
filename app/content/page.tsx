"use client";

import { useState } from "react";
import { ContentManager } from "@/components/content/content-manager";
import { ContentUpload } from "@/components/content/content-upload";
import { ContentSearch } from "@/components/content/content-search";
import { ContentFilters } from "@/components/content/content-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FolderOpen, Search, Filter } from "lucide-react";

export default function ContentPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    type: null,
    tags: [],
    categories: [],
    projectId: null
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Organize and manage all your creative assets
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ContentSearch 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <ContentFilters
            filters={activeFilters}
            onChange={setActiveFilters}
          />
        </CardContent>
      </Card>

      {/* Content Manager */}
      <ContentManager
        searchQuery={searchQuery}
        filters={activeFilters}
      />

      {/* Upload Dialog */}
      {showUpload && (
        <ContentUpload
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {
            setShowUpload(false);
            // Refresh content list
          }}
        />
      )}
    </div>
  );
}