"use client";

import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, Image, Music, Video, FileText, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

export function ContentUpload({ open, onClose, onUploadComplete }: ContentUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    categories: "",
    isPublic: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <Image className="h-8 w-8" />;
    if (type.startsWith("audio/")) return <Music className="h-8 w-8" />;
    if (type.startsWith("video/")) return <Video className="h-8 w-8" />;
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-8 w-8" />;
    if (type.includes("zip") || type.includes("rar")) return <Archive className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map(file => {
      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      return fileWithPreview;
    });
    
    setFiles(prev => [...prev, ...filesWithPreview]);
    
    // Auto-fill title if only one file and no title set
    if (newFiles.length === 1 && !formData.title) {
      setFormData(prev => ({
        ...prev,
        title: newFiles[0].name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        
        uploadFormData.append("file", file);
        uploadFormData.append("title", formData.title || file.name);
        uploadFormData.append("description", formData.description);
        uploadFormData.append("tags", formData.tags);
        uploadFormData.append("categories", formData.categories);
        uploadFormData.append("is_public", formData.isPublic.toString());

        const response = await fetch("/api/content/upload", {
          method: "POST",
          body: uploadFormData,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      onUploadComplete();
      handleClose();
    } catch (error) {
      // Upload error
      // Show error toast (implement proper error handling)
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    setFiles([]);
    setFormData({
      title: "",
      description: "",
      tags: "",
      categories: "",
      isPublic: false
    });
    setUploadProgress(0);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              "hover:border-primary hover:bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Support for images, audio, video, documents, and archives
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(Array.from(e.target.files));
                }
              }}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({files.length})</Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        {getFileIcon(file)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title"
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter content description"
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
                disabled={uploading}
              />
              {formData.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.split(",").map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="categories">Categories</Label>
              <Input
                id="categories"
                value={formData.categories}
                onChange={(e) => setFormData(prev => ({ ...prev, categories: e.target.value }))}
                placeholder="Enter categories separated by commas"
                disabled={uploading}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={files.length === 0 || uploading}
            >
              {uploading ? "Uploading..." : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}