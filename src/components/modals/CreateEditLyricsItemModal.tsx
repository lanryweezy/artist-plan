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
} from '@mui/material';
import { toast } from 'react-toastify';
import {
    LyricsItem,
    LyricsItemStatus,
    LYRICS_ITEM_STATUS_OPTIONS
} from '../../../types'; // Assuming types are in root types.ts
import { createLyricsItem, updateLyricsItem, CreateLyricsItemData, UpdateLyricsItemData } from '../../services/contentService';

interface CreateEditLyricsItemModalProps {
  open: boolean;
  onClose: () => void;
  lyricsItem: LyricsItem | null;
  onSave: () => void; // Callback after successful save
}

const CreateEditLyricsItemModal: React.FC<CreateEditLyricsItemModalProps> = ({ open, onClose, lyricsItem, onSave }) => {
  const [title, setTitle] = useState('');
  const [lyricsText, setLyricsText] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LyricsItemStatus | string>(LYRICS_ITEM_STATUS_OPTIONS.length > 0 ? LYRICS_ITEM_STATUS_OPTIONS[0] : '');
  const [tags, setTags] = useState<string[]>([]);
  // const [associatedProjectId, setAssociatedProjectId] = useState<string>('');

  useEffect(() => {
    if (lyricsItem) {
      setTitle(lyricsItem.title);
      setLyricsText(lyricsItem.lyricsText);
      setNotes(lyricsItem.notes || '');
      setStatus(lyricsItem.status);
      setTags(Array.isArray(lyricsItem.tags) ? lyricsItem.tags : []);
      // setAssociatedProjectId(lyricsItem.associatedProjectId || '');
    } else {
      // Reset for create mode
      setTitle('');
      setLyricsText('');
      setNotes('');
      setStatus(LYRICS_ITEM_STATUS_OPTIONS.length > 0 ? LYRICS_ITEM_STATUS_OPTIONS[0] : 'Idea');
      setTags([]);
      // setAssociatedProjectId('');
    }
  }, [lyricsItem, open]);

  const mutationOptions = {
    onSuccess: (savedItem: LyricsItem) => {
      onSave();
      toast.success(`Lyrics "${savedItem.title}" ${lyricsItem ? 'updated' : 'created'} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  };

  const createMutation = useMutation(createLyricsItem, mutationOptions);
  const updateMutation = useMutation(
    (data: UpdateLyricsItemData) => updateLyricsItem(lyricsItem!.id, data),
    mutationOptions
  );

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const itemData: CreateLyricsItemData | UpdateLyricsItemData = {
      title,
      lyricsText,
      notes,
      status,
      tags: tags.filter(tag => tag.trim() !== ''),
      // associatedProjectId: associatedProjectId || undefined,
    };

    if (lyricsItem) { // Edit mode
      updateMutation.mutate(itemData);
    } else { // Create mode
      createMutation.mutate(itemData as CreateLyricsItemData);
    }
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value.split(',').map(tag => tag.trim()));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>{lyricsItem ? `Edit Lyrics: ${lyricsItem.title}` : 'Create New Lyrics Item'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="normal" name="title" label="Title" type="text" fullWidth variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required sx={{ mb: 2 }} />
        <TextField
            margin="normal"
            name="lyricsText"
            label="Lyrics"
            type="text"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={lyricsText}
            onChange={(e) => setLyricsText(e.target.value)}
            required
            sx={{ mb: 2, fontFamily: 'monospace' }}
        />
        <TextField margin="normal" name="notes" label="Notes (Optional, e.g., chords, structure)" type="text" fullWidth multiline rows={3} variant="outlined" value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="lyrics-status-label">Status</InputLabel>
              <Select labelId="lyrics-status-label" name="status" value={status} label="Status" onChange={(e) => setStatus(e.target.value as LyricsItemStatus)} required>
                {LYRICS_ITEM_STATUS_OPTIONS.map((opt) => ( <MenuItem key={opt} value={opt}>{opt}</MenuItem> ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
            margin="normal"
            name="tags"
            label="Tags (Optional, comma-separated)"
            type="text"
            fullWidth
            variant="outlined"
            value={tags.join(', ')}
            onChange={handleTagsChange}
            />
          </Grid>
        </Grid>

        {/* TODO: Add field for associatedProjectId (e.g. with Select components fetching projects) */}

      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isLoading || !title.trim() || !lyricsText.trim()}>
          {isLoading ? <CircularProgress size={24} /> : (lyricsItem ? 'Save Changes' : 'Create Lyrics Item')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditLyricsItemModal;
