import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

import { getContentItems, getLyricsItems, deleteContentItem, deleteLyricsItem } from '../services/contentService';
import { ContentItem, LyricsItem } from '../../types';
import ContentItemDisplay from '../components/content/ContentItemDisplay';
import LyricsItemDisplay from '../components/content/LyricsItemDisplay';
import CreateEditContentItemModal from '../components/modals/CreateEditContentItemModal';
import CreateEditLyricsItemModal from '../components/modals/CreateEditLyricsItemModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ContentManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState(0);

  const [isContentModalOpen, setContentModalOpen] = useState(false);
  const [editingContentItem, setEditingContentItem] = useState<ContentItem | null>(null);
  const [contentItemToDelete, setContentItemToDelete] = useState<ContentItem | null>(null);

  const [isLyricsModalOpen, setLyricsModalOpen] = useState(false);
  const [editingLyricsItem, setEditingLyricsItem] = useState<LyricsItem | null>(null);
  const [lyricsItemToDelete, setLyricsItemToDelete] = useState<LyricsItem | null>(null);

  // Data Fetching
  const { data: contentItems, isLoading: isLoadingContent, isError: isErrorContent, error: errorContent, refetch: refetchContentItems } =
    useQuery<ContentItem[], Error>('contentItems', getContentItems, { enabled: currentTab === 0 });

  const { data: lyricsItems, isLoading: isLoadingLyrics, isError: isErrorLyrics, error: errorLyrics, refetch: refetchLyricsItems } =
    useQuery<LyricsItem[], Error>('lyricsItems', getLyricsItems, { enabled: currentTab === 1 });

  // Mutations
  const commonDeleteOptions = (itemName: string, queryKeyToInvalidate: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeyToInvalidate);
      toast.success(`${itemName} deleted successfully!`);
    },
    onError: (err: Error) => toast.error(`Error deleting ${itemName.toLowerCase()}: ${err.message}`),
  });

  const deleteContentItemMutation = useMutation(deleteContentItem, {
    ...commonDeleteOptions('Content Item', 'contentItems'),
    onSettled: () => setContentItemToDelete(null),
  });

  const deleteLyricsItemMutation = useMutation(deleteLyricsItem, {
    ...commonDeleteOptions('Lyrics Item', 'lyricsItems'),
    onSettled: () => setLyricsItemToDelete(null),
  });


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (newValue === 0) refetchContentItems(); // Refetch when tab becomes active
    if (newValue === 1) refetchLyricsItems();   // Refetch when tab becomes active
  };

  // Content Item Modal Handlers
  const handleOpenCreateContentModal = () => { setEditingContentItem(null); setContentModalOpen(true); };
  const handleOpenEditContentModal = (item: ContentItem) => { setEditingContentItem(item); setContentModalOpen(true); };
  const handleContentModalClose = () => { setContentModalOpen(false); setEditingContentItem(null); };
  const handleContentItemSaved = () => { queryClient.invalidateQueries('contentItems'); handleContentModalClose(); };
  const confirmDeleteContentItem = () => { if (contentItemToDelete) deleteContentItemMutation.mutate(contentItemToDelete.id); };

  // Lyrics Item Modal Handlers
  const handleOpenCreateLyricsModal = () => { setEditingLyricsItem(null); setLyricsModalOpen(true); };
  const handleOpenEditLyricsModal = (item: LyricsItem) => { setEditingLyricsItem(item); setLyricsModalOpen(true); };
  const handleLyricsModalClose = () => { setLyricsModalOpen(false); setEditingLyricsItem(null); };
  const handleLyricsItemSaved = () => { queryClient.invalidateQueries('lyricsItems'); handleLyricsModalClose(); };
  const confirmDeleteLyricsItem = () => { if (lyricsItemToDelete) deleteLyricsItemMutation.mutate(lyricsItemToDelete.id); };


  const renderContentItems = () => {
    if (isLoadingContent) return <Box sx={{mt:2, textAlign: 'center'}}><CircularProgress /><Typography sx={{mt:1}}>Loading content items...</Typography></Box>;
    if (isErrorContent && errorContent) return <Alert severity="error" sx={{mt:2}}>Error fetching content: {errorContent.message}</Alert>;
    if (!contentItems || contentItems.length === 0) {
      return (
        <Paper elevation={0} sx={{p:3, textAlign: 'center', mt: 2, backgroundColor: 'transparent'}}>
            <Typography variant="h6" gutterBottom>No general content items yet.</Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreateContentModal}>Add Content Item</Button>
        </Paper>
      );
    }
    return (
      <Grid container spacing={2} sx={{mt:1}}>
        {contentItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ContentItemDisplay item={item} onEdit={handleOpenEditContentModal} onDelete={setContentItemToDelete} displayType="card" />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderLyricsItems = () => {
    if (isLoadingLyrics) return <Box sx={{mt:2, textAlign: 'center'}}><CircularProgress /><Typography sx={{mt:1}}>Loading lyrics...</Typography></Box>;
    if (isErrorLyrics && errorLyrics) return <Alert severity="error" sx={{mt:2}}>Error fetching lyrics: {errorLyrics.message}</Alert>;
     if (!lyricsItems || lyricsItems.length === 0) {
      return (
        <Paper elevation={0} sx={{p:3, textAlign: 'center', mt: 2, backgroundColor: 'transparent'}}>
            <Typography variant="h6" gutterBottom>No lyrics items yet.</Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreateLyricsModal}>Add Lyrics</Button>
        </Paper>
      );
    }
    return (
      <Box sx={{mt:1}}>
        {lyricsItems.map((item) => (
          <LyricsItemDisplay key={item.id} item={item} onEdit={handleOpenEditLyricsModal} onDelete={setLyricsItemToDelete} />
        ))}
      </Box>
    );
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Content Hub
        </Typography>
        <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={currentTab === 0 ? handleOpenCreateContentModal : handleOpenCreateLyricsModal}
        >
          {currentTab === 0 ? 'New Content Item' : 'New Lyrics'}
        </Button>
      </Box>

      <Paper elevation={2} sx={{backgroundColor: 'background.paper', mb:3}}>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="inherit" variant="fullWidth" centered>
          <Tab label="General Content" id="content-tab-0" aria-controls="content-tabpanel-0" />
          <Tab label="Lyrics & Songwriting" id="content-tab-1" aria-controls="content-tabpanel-1" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        {renderContentItems()}
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        {renderLyricsItems()}
      </TabPanel>

      {/* Modals */}
      {isContentModalOpen && ( // Ensure modal is only in DOM when open to reset its state if needed
        <CreateEditContentItemModal
          open={isContentModalOpen}
          onClose={handleContentModalClose}
          contentItem={editingContentItem}
          onSave={handleContentItemSaved}
        />
      )}
      {isLyricsModalOpen && ( // Ensure modal is only in DOM when open
        <CreateEditLyricsItemModal
          open={isLyricsModalOpen}
          onClose={handleLyricsModalClose}
          lyricsItem={editingLyricsItem}
          onSave={handleLyricsItemSaved}
        />
      )}

      {/* Delete Confirmations */}
      <Dialog open={!!contentItemToDelete} onClose={() => setContentItemToDelete(null)}>
        <DialogTitle>Delete Content Item?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "<strong>{contentItemToDelete?.title}</strong>"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContentItemToDelete(null)}>Cancel</Button>
          <Button onClick={confirmDeleteContentItem} color="error" variant="contained" disabled={deleteContentItemMutation.isLoading}>
            {deleteContentItemMutation.isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!lyricsItemToDelete} onClose={() => setLyricsItemToDelete(null)}>
        <DialogTitle>Delete Lyrics Item?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "<strong>{lyricsItemToDelete?.title}</strong>"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLyricsItemToDelete(null)}>Cancel</Button>
          <Button onClick={confirmDeleteLyricsItem} color="error" variant="contained" disabled={deleteLyricsItemMutation.isLoading}>
            {deleteLyricsItemMutation.isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default ContentManagementPage;
