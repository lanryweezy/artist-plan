import React from 'react';
import { Paper, Typography, Chip, Box, IconButton, Tooltip, ListItemIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from '@mui/icons-material/Mic'; // Or your specific LyricsIcon

import { LyricsItem, LyricsItemStatus } from '../../../types';

interface LyricsItemDisplayProps {
  item: LyricsItem;
  onEdit: (item: LyricsItem) => void;
  onDelete: (item: LyricsItem) => void;
  // displayType?: 'card' | 'listItem'; // Lyrics might typically be list items
}

const getLyricsStatusColor = (status?: LyricsItemStatus | string) => {
    switch (status) {
      case 'Completed': return 'success.light';
      case 'In Progress': return 'info.light';
      case 'Draft': return 'secondary.light';
      case 'Idea': return 'default';
      case 'Archived': return 'grey.700';
      default: return 'text.secondary';
    }
  };
  const getLyricsStatusTextColor = (status?: LyricsItemStatus | string) => {
      switch (status) {
        case 'Completed': case 'In Progress': case 'Draft':
          return 'common.black';
        case 'Archived':
          return 'common.white';
        default: return 'text.primary';
      }
    };


const LyricsItemDisplay: React.FC<LyricsItemDisplayProps> = ({ item, onEdit, onDelete }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, backgroundColor: 'background.paper', '&:hover': {boxShadow: 3} }}>
      <Box sx={{ flexGrow: 1, overflow: 'hidden', pr:1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <ListItemIcon sx={{minWidth: 36, color: 'primary.main'}}>
                <MicIcon />
            </ListItemIcon>
            <Typography variant="h6" component="div" noWrap title={item.title}>
            {item.title}
            </Typography>
        </Box>
        <Chip
            label={item.status}
            size="small"
            sx={{
                mr: 1, mb: 1,
                backgroundColor: getLyricsStatusColor(item.status),
                color: getLyricsStatusTextColor(item.status),
                fontWeight: 500
            }}
        />
        <Typography variant="body2" color="text.secondary" sx={{
            mb: 1,
            whiteSpace: 'pre-wrap', // Preserve line breaks in lyrics preview
            maxHeight: '60px', // Show about 3 lines
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            fontFamily: 'monospace', // Often good for lyrics
            }}>
          {item.lyricsText.substring(0, 150)}{item.lyricsText.length > 150 ? '...' : ''}
        </Typography>
        {item.notes && (
            <Typography variant="caption" color="text.disabled" sx={{fontStyle: 'italic', display: 'block', mb:1}}>
                Notes: {item.notes.substring(0,100)}{item.notes.length > 100 ? '...' : ''}
            </Typography>
        )}
        {item.tags && item.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb:1 }}>
            {item.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined"/>)}
            </Box>
        )}
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {new Date(item.creationDate).toLocaleDateString()}
          {item.lastModifiedDate && ` | Modified: ${new Date(item.lastModifiedDate).toLocaleDateString()}`}
        </Typography>
      </Box>
      <Box sx={{ ml: 1, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <Tooltip title="Edit Lyrics">
          <IconButton size="small" onClick={() => onEdit(item)}>
            <EditIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Lyrics">
          <IconButton size="small" onClick={() => onDelete(item)} sx={{mt:0.5}}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default LyricsItemDisplay;
