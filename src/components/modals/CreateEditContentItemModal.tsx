import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Chip,
  OutlinedInput,
  Theme,
  useTheme,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
    ContentItem,
    ContentItemType,
    ContentItemStatus,
    CONTENT_ITEM_TYPE_OPTIONS,
    CONTENT_ITEM_STATUS_OPTIONS
} from '../../../types'; // Assuming types are in root types.ts
import { createContentItem, updateContentItem, CreateContentItemData, UpdateContentItemData } from '../../services/contentService';

interface CreateEditContentItemModalProps {
  open: boolean;
  onClose: () => void;
  contentItem: ContentItem | null;
  onSave: () => void; // Callback after successful save
}

const CreateEditContentItemModal: React.FC<CreateEditContentItemModalProps> = ({ open, onClose, contentItem, onSave }) => {
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ContentItemType | string>(CONTENT_ITEM_TYPE_OPTIONS.length > 0 ? CONTENT_ITEM_TYPE_OPTIONS[0] : '');
  const [status, setStatus] = useState<ContentItemStatus | string>(CONTENT_ITEM_STATUS_OPTIONS.length > 0 ? CONTENT_ITEM_STATUS_OPTIONS[0] : '');
  const [tags, setTags] = useState<string[]>([]);
  const [filePathOrUrl, setFilePathOrUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  // fileSize might be set by upload logic later
  // source might be set by specific creation contexts (e.g. AI strategy)

  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title);
      setDescription(contentItem.description || '');
      setType(contentItem.type);
      setStatus(contentItem.status);
      setTags(Array.isArray(contentItem.tags) ? contentItem.tags : []);
      setFilePathOrUrl(contentItem.filePathOrUrl || '');
      setThumbnailUrl(contentItem.thumbnailUrl || '');
    } else {
      // Reset for create mode
      setTitle('');
      setDescription('');
      setType(CONTENT_ITEM_TYPE_OPTIONS.length > 0 ? CONTENT_ITEM_TYPE_OPTIONS[0] : '');
      setStatus(CONTENT_ITEM_STATUS_OPTIONS.length > 0 ? CONTENT_ITEM_STATUS_OPTIONS[0] : 'Draft');
      setTags([]);
      setFilePathOrUrl('');
      setThumbnailUrl('');
    }
  }, [contentItem, open]);

  const mutationOptions = {
    onSuccess: (savedItem: ContentItem) => {
      onSave();
      toast.success(`Content Item "${savedItem.title}" ${contentItem ? 'updated' : 'created'} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  };

  const createMutation = useMutation(createContentItem, mutationOptions);
  const updateMutation = useMutation(
    (data: UpdateContentItemData) => updateContentItem(contentItem!.id, data),
    mutationOptions
  );

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const itemData: CreateContentItemData | UpdateContentItemData = {
      title,
      description,
      type,
      status,
      tags: tags.filter(tag => tag.trim() !== ''),
      filePathOrUrl,
      thumbnailUrl,
      // source: contentItem ? contentItem.source : 'Uploaded', // Or determine based on context
    };

    if (contentItem) { // Edit mode
      updateMutation.mutate(itemData);
    } else { // Create mode
      createMutation.mutate(itemData as CreateContentItemData);
    }
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value.split(',').map(tag => tag.trim()));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>{contentItem ? `Edit Content Item: ${contentItem.title}` : 'Create New Content Item'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="normal" name="title" label="Title" type="text" fullWidth variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required sx={{ mb: 2 }} />
        <TextField margin="normal" name="description" label="Description (Optional)" type="text" fullWidth multiline rows={3} variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="content-type-label">Type</InputLabel>
              <Select labelId="content-type-label" name="type" value={type} label="Type" onChange={(e) => setType(e.target.value as ContentItemType)} required>
                {CONTENT_ITEM_TYPE_OPTIONS.map((opt) => ( <MenuItem key={opt} value={opt}>{opt}</MenuItem> ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="content-status-label">Status</InputLabel>
              <Select labelId="content-status-label" name="status" value={status} label="Status" onChange={(e) => setStatus(e.target.value as ContentItemStatus)} required>
                {CONTENT_ITEM_STATUS_OPTIONS.map((opt) => ( <MenuItem key={opt} value={opt}>{opt}</MenuItem> ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
            margin="normal"
            name="filePathOrUrl"
            label="File Path or URL (e.g., for images, videos, docs)"
            type="text"
            fullWidth
            variant="outlined"
            value={filePathOrUrl}
            onChange={(e) => setFilePathOrUrl(e.target.value)}
            sx={{ mb: 2 }}
            // TODO: Replace with file upload component later
        />
        <TextField
            margin="normal"
            name="thumbnailUrl"
            label="Thumbnail URL (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          name="tags"
          label="Tags (Optional, comma-separated)"
          type="text"
          fullWidth
          variant="outlined"
          value={tags.join(', ')}
          onChange={handleTagsChange}
          sx={{ mb: 2 }}
        />
        {/* TODO: Add fields for associatedProjectId, campaignId (e.g. with Select components fetching projects/campaigns) */}

      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isLoading || !title.trim()}>
          {isLoading ? <CircularProgress size={24} /> : (contentItem ? 'Save Changes' : 'Create Content Item')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditContentItemModal;
