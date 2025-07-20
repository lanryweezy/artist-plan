import React from 'react';
import { Card, CardContent, Typography, Chip, CardActions, IconButton, Tooltip, Box, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import DescriptionIcon from '@mui/icons-material/Description'; // For Document
import ArticleIcon from '@mui/icons-material/Article'; // For Press Release, AI Strategy Doc
import MicIcon from '@mui/icons-material/Mic'; // For Lyrics (if displayed here) or Podcast
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'; // For Social Post Snippet
import PaletteIcon from '@mui/icons-material/Palette'; // For Artwork

import { ContentItem, ContentItemType, ContentItemStatus } from '../../../types';

interface ContentItemDisplayProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  displayType?: 'card' | 'listItem';
}

const getItemIcon = (type: ContentItemType | string): React.ReactElement => {
    switch (type) {
        case 'Image': return <ImageIcon />;
        case 'Artwork': return <PaletteIcon />;
        case 'Video': return <VideocamIcon />;
        case 'Audio': return <AudiotrackIcon />;
        case 'Document': return <DescriptionIcon />;
        case 'Social Post Snippet': return <DynamicFeedIcon />;
        case 'Lyrics': return <MicIcon />; // Or specific LyricsIcon if you have one
        case 'Press Release': return <ArticleIcon />;
        case 'AI Strategy Document': return <ArticleIcon />; // Or a BrainIcon
        default: return <DescriptionIcon />;
    }
};

const ContentItemDisplay: React.FC<ContentItemDisplayProps> = ({ item, onEdit, onDelete, displayType = 'card' }) => {

  const content = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ListItemIcon sx={{minWidth: 36, color: 'primary.main'}}>
            {getItemIcon(item.type)}
        </ListItemIcon>
        <Typography variant={displayType === 'card' ? "h6" : "subtitle1"} component="div" noWrap title={item.title}>
          {item.title}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: displayType === 'card' ? 60 : 'auto', overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: displayType === 'card' ? 3 : undefined, WebkitBoxOrient: "vertical" }}>
        {item.description || 'No description.'}
      </Typography>
      <Box sx={{mb:1}}>
        <Chip label={item.type} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
        <Chip label={item.status} size="small" sx={{ mr: 0.5, mb: 0.5, backgroundColor: item.status === 'Published' ? 'success.light' : 'default', color: item.status === 'Published' ? 'black': 'inherit' }} />
      </Box>
      <Typography variant="caption" color="text.secondary" display="block">
        Created: {new Date(item.creationDate).toLocaleDateString()}
        {item.lastModifiedDate && ` | Modified: ${new Date(item.lastModifiedDate).toLocaleDateString()}`}
      </Typography>
      {item.filePathOrUrl && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{mt:0.5, wordBreak: 'break-all'}}>
          Path/URL: {item.filePathOrUrl}
        </Typography>
      )}
       {item.tags && item.tags.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {item.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
        </Box>
      )}
    </>
  );

  const actions = (
    <Box sx={{pt: displayType === 'card' ? 0 : 1 }}>
        <Tooltip title="Edit Content Item">
            <IconButton size="small" onClick={() => onEdit(item)}>
                <EditIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <Tooltip title="Delete Content Item">
            <IconButton size="small" onClick={() => onDelete(item)}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </Box>
  );

  if (displayType === 'card') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper', '&:hover': {boxShadow: 6} }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {content}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {actions}
        </CardActions>
      </Card>
    );
  }

  // Default to listItem style (can be customized further if needed)
  return (
    <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, backgroundColor: 'background.paper' }}>
        <Box sx={{flexGrow: 1}}>
            {content}
        </Box>
        <Box sx={{ ml: 1, flexShrink: 0}}>
            {actions}
        </Box>
    </Paper>
  );
};

export default ContentItemDisplay;
