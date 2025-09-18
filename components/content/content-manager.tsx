"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "./content-item";
// import { ContentVersionHistory } from "./content-version-history";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, List, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentManagerProps {
  searchQuery: string;
  filters: {
    type: string | null;
    tags: string[];
    categories: string[];
    projectId: string | null;
  };
}

interface ContentVersion {
  version: number;
  file_url: string;
  file_size: number;
  created_at: string;
  notes?: string;
}

interface ContentMetadata {
  duration?: number;
  bitrate?: number;
  format?: string;
  genre?: string;
  bpm?: number;
  key?: string;
  [key: string]: unknown;
}

interface ContentData {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  tags: string[];
  categories: string[];
  current_version: number;
  versions: ContentVersion[];
  metadata?: ContentMetadata;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  owner_id: string;
  project_id?: string;
}

export function ContentManager({ searchQuery, filters }: ContentManagerProps) {
  const [content, setContent] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    loadContent();
  }, [searchQuery, filters]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.append("query", searchQuery);
      if (filters.type) params.append("content_type", filters.type);
      if (filters.tags.length > 0) params.append("tags", filters.tags.join(","));
      if (filters.categories.length > 0) params.append("categories", filters.categories.join(","));
      if (filters.projectId) params.append("project_id", filters.projectId);

      const response = await fetch(`/api/content?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // Failed to load content
        setContent([]);
      }
    } catch (error) {
      // Error loading content
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpdate = (updatedContent: ContentData) => {
    setContent(prev => 
      prev.map(item => 
        item.id === updatedContent.id ? updatedContent : item
      )
    );
  };

  const handleContentDelete = (contentId: string) => {
    setContent(prev => prev.filter(item => item.id !== contentId));
    if (selectedContent?.id === contentId) {
      setSelectedContent(null);
    }
  };

  const handleShowVersionHistory = (contentItem: ContentData) => {
    setSelectedContent(contentItem);
    setShowVersionHistory(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-4",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Library</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {content.length} item{content.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadContent}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {content.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || Object.values(filters).some(f => f && (Array.isArray(f) ? f.length > 0 : true))
                  ? "Try adjusting your search or filters"
                  : "Upload your first content item to get started"
                }
              </p>
            </div>
          ) : (
            <div className={cn(
              "grid gap-4",
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {content.map((item) => (
                <ContentItem
                  key={item.id}
                  content={item}
                  viewMode={viewMode}
                  onUpdate={handleContentUpdate}
                  onDelete={handleContentDelete}
                  // onShowVersionHistory={handleShowVersionHistory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version History Dialog */}
      {/* {showVersionHistory && selectedContent && (
        <ContentVersionHistory
          content={selectedContent}
          open={showVersionHistory}
          onClose={() => {
            setShowVersionHistory(false);
            setSelectedContent(null);
          }}
        />
      )} */}
    </>
  );
}