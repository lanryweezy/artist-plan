import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom'; // For future navigation to detail page
import { toast } from 'react-toastify';

import {
    getCampaigns,
    deleteCampaign,
    // createCampaign, (will be in modal)
    // updateCampaign, (will be in modal)
} from '../services/campaignService';
import { Campaign, CampaignType, CampaignStatus } from '../../types'; // CAMPAIGN_TYPE_OPTIONS, CAMPAIGN_STATUS_OPTIONS will be used in modal
import CreateEditCampaignModal from '../components/modals/CreateEditCampaignModal'; // Adjusted path

// Helper to get status color
const getCampaignStatusColor = (status?: CampaignStatus | string) => {
  switch (status) {
    case 'Completed': return 'success.light';
    case 'Active': return 'info.light';
    case 'Planning': return 'secondary.light';
    case 'Draft': return 'default';
    case 'On Hold': return 'warning.light';
    case 'Archived': return 'grey.700';
    default: return 'text.secondary';
  }
};
const getCampaignStatusTextColor = (status?: CampaignStatus | string) => {
    switch (status) {
      case 'Completed': case 'Active': case 'Planning': case 'On Hold':
        return 'common.black';
      case 'Archived':
        return 'common.white';
      default: return 'text.primary';
    }
  };

// CampaignCard Sub-component (can be moved to its own file later, e.g., src/components/CampaignCard.tsx)
const CampaignCardDisplay: React.FC<{ campaign: Campaign; onEdit: (campaign: Campaign) => void; onDelete: (campaign: Campaign) => void; }> = ({ campaign, onEdit, onDelete }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper', '&:hover': {boxShadow: 6} }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3" noWrap title={campaign.name}>
                    {campaign.name}
                </Typography>
                <Chip
                    label={campaign.campaignType}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{mb: 1, height: 60, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                    {campaign.description || 'No description available.'}
                </Typography>
                <Chip
                    label={campaign.status}
                    size="small"
                    sx={{
                        backgroundColor: getCampaignStatusColor(campaign.status),
                        color: getCampaignStatusTextColor(campaign.status),
                        fontWeight: 500,
                        mb: 1
                    }}
                />
                {(campaign.startDate || campaign.endDate) && (
                    <Typography variant="caption" display="block" color="text.secondary">
                        {campaign.startDate ? `Start: ${new Date(campaign.startDate).toLocaleDateString()}` : ''}
                        {campaign.startDate && campaign.endDate ? ' - ' : ''}
                        {campaign.endDate ? `End: ${new Date(campaign.endDate).toLocaleDateString()}` : ''}
                    </Typography>
                )}
                 {campaign.budget && (
                    <Typography variant="caption" display="block" color="text.secondary" sx={{mt:0.5}}>
                        Budget: {campaign.budget}
                    </Typography>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pt:0, pb:1, pr:1 }}>
                <Tooltip title="Edit Campaign">
                    <IconButton size="small" onClick={() => onEdit(campaign)}>
                        <EditIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Campaign">
                    <IconButton size="small" onClick={() => onDelete(campaign)}>
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};


const MarketingCampaignsPage: React.FC = () => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);


  const { data: campaigns, isLoading, isError, error } = useQuery<Campaign[], Error>('campaigns', getCampaigns);

  const deleteCampaignMutation = useMutation(deleteCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries('campaigns');
      toast.success(`Campaign "${campaignToDelete?.name || 'Campaign'}" deleted successfully!`);
      setCampaignToDelete(null); // Close delete confirmation
    },
    onError: (err: Error) => {
      toast.error(`Error deleting campaign: ${err.message}`);
      setCampaignToDelete(null);
    },
  });


  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setModalOpen(true);
  };

  const handleOpenDeleteConfirm = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
  };

  const confirmDelete = () => {
    if (campaignToDelete) {
        deleteCampaignMutation.mutate(campaignToDelete.id);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCampaign(null);
  };

  const handleCampaignSaved = () => {
    queryClient.invalidateQueries('campaigns');
    handleModalClose();
  }


  if (isLoading) return <Container sx={{mt:4, textAlign: 'center'}}><CircularProgress /><Typography sx={{mt:1}}>Loading campaigns...</Typography></Container>;
  if (isError && error) return <Container sx={{mt:4}}><Alert severity="error">Error fetching campaigns: {error.message}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Marketing Campaigns
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
          New Campaign
        </Button>
      </Box>

      {campaigns && campaigns.length > 0 ? (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item key={campaign.id} xs={12} sm={6} md={4} lg={3}> {/* Adjusted lg for potentially more cards */}
              <CampaignCardDisplay
                campaign={campaign}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteConfirm}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{p:3, textAlign: 'center', mt: 5, backgroundColor: 'background.paper'}}>
            <Typography variant="h6" gutterBottom>No marketing campaigns yet.</Typography>
            <Typography color="text.secondary" paragraph>Plan your next release, tour promotion, or brand awareness push!</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
                Create New Campaign
            </Button>
        </Paper>
      )}

      {isModalOpen && ( /* Ensure modal is only in DOM when open to reset its internal state if needed */
        <CreateEditCampaignModal
            open={isModalOpen}
            onClose={handleModalClose}
            campaign={editingCampaign}
            onCampaignSaved={handleCampaignSaved}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {campaignToDelete && (
        <Dialog open={!!campaignToDelete} onClose={() => setCampaignToDelete(null)}>
            <DialogTitle>Delete Campaign?</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete the campaign: "<strong>{campaignToDelete.name}</strong>"?</Typography>
                <Typography color="text.secondary" sx={{mt:1}}>This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setCampaignToDelete(null)}>Cancel</Button>
                <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleteCampaignMutation.isLoading}>
                    {deleteCampaignMutation.isLoading ? <CircularProgress size={24} /> : "Delete Campaign"}
                </Button>
            </DialogActions>
        </Dialog>
      )}

    </Container>
  );
};

export default MarketingCampaignsPage;
