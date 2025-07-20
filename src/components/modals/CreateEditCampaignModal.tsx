import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import { Campaign, CampaignType, CampaignStatus, CAMPAIGN_TYPE_OPTIONS, CAMPAIGN_STATUS_OPTIONS, MARKETING_CHANNELS } from '../../../types'; // Assuming types are in root
import { createCampaign, updateCampaign, CreateCampaignData, UpdateCampaignData } from '../../services/campaignService';

interface CreateEditCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaign: Campaign | null; // null for create mode, Campaign object for edit mode
  onCampaignSaved: () => void; // Callback after successful save
}

// For multi-select chip
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, selectedNames: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const CreateEditCampaignModal: React.FC<CreateEditCampaignModalProps> = ({ open, onClose, campaign, onCampaignSaved }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType | string>(CAMPAIGN_TYPE_OPTIONS.length > 0 ? CAMPAIGN_TYPE_OPTIONS[0] : '');
  const [status, setStatus] = useState<CampaignStatus | string>(CAMPAIGN_STATUS_OPTIONS.length > 0 ? CAMPAIGN_STATUS_OPTIONS[0] : '');
  const [startDate, setStartDate] = useState<string>(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>('');     // YYYY-MM-DD
  const [targetAudience, setTargetAudience] = useState('');
  const [keyObjectives, setKeyObjectives] = useState<string[]>([]); // Store as array of strings
  const [budget, setBudget] = useState<string>('');
  const [channels, setChannels] = useState<string[]>([]); // Store as array of strings
  const [linkedProjectId, setLinkedProjectId] = useState<string>(''); // Assuming string for ID

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setDescription(campaign.description || '');
      setCampaignType(campaign.campaignType);
      setStatus(campaign.status);
      setStartDate(campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '');
      setEndDate(campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '');
      setTargetAudience(campaign.targetAudience || '');
      setKeyObjectives(Array.isArray(campaign.keyObjectives) ? campaign.keyObjectives : (campaign.keyObjectives ? [campaign.keyObjectives as unknown as string] : []));
      setBudget(campaign.budget || '');
      setChannels(Array.isArray(campaign.channels) ? campaign.channels : []);
      setLinkedProjectId(campaign.linkedProjectId || '');
    } else {
      // Reset for create mode
      setName('');
      setDescription('');
      setCampaignType(CAMPAIGN_TYPE_OPTIONS.length > 0 ? CAMPAIGN_TYPE_OPTIONS[0] : '');
      setStatus(CAMPAIGN_STATUS_OPTIONS.length > 0 ? CAMPAIGN_STATUS_OPTIONS[0] : 'Draft');
      setStartDate('');
      setEndDate('');
      setTargetAudience('');
      setKeyObjectives([]);
      setBudget('');
      setChannels([]);
      setLinkedProjectId('');
    }
  }, [campaign, open]); // Depend on `open` to reset form when modal is reopened for creation

  const mutationOptions = {
    onSuccess: (savedCampaign: Campaign) => {
      onCampaignSaved(); // This will invalidate queries and close modal in parent
      toast.success(`Campaign "${savedCampaign.name}" ${campaign ? 'updated' : 'created'} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  };

  const createMutation = useMutation(createCampaign, mutationOptions);
  const updateMutation = useMutation(
    (data: UpdateCampaignData) => updateCampaign(campaign!.id, data), // campaign!.id is safe due to edit mode check
    mutationOptions
  );

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const campaignData: CreateCampaignData | UpdateCampaignData = {
      name,
      description,
      campaignType,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      targetAudience,
      keyObjectives: keyObjectives.filter(obj => obj.trim() !== ''), // Filter out empty objectives
      budget,
      channels,
      linkedProjectId: linkedProjectId || undefined,
    };

    if (campaign) { // Edit mode
      updateMutation.mutate(campaignData);
    } else { // Create mode
      createMutation.mutate(campaignData as CreateCampaignData);
    }
  };

  const handleKeyObjectivesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Assuming objectives are comma-separated
    const objectivesArray = event.target.value.split(',').map(obj => obj.trim());
    setKeyObjectives(objectivesArray);
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>{campaign ? `Edit Campaign: ${campaign.name}` : 'Create New Campaign'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Campaign Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description (Optional)"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="campaign-type-label">Campaign Type</InputLabel>
              <Select
                labelId="campaign-type-label"
                name="campaignType"
                value={campaignType}
                label="Campaign Type"
                onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                required
              >
                {CAMPAIGN_TYPE_OPTIONS.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="campaign-status-label">Status</InputLabel>
              <Select
                labelId="campaign-status-label"
                name="status"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                required
              >
                {CAMPAIGN_STATUS_OPTIONS.map((stat) => (
                  <MenuItem key={stat} value={stat}>{stat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date (Optional)"
              value={startDate ? new Date(startDate) : null}
              onChange={(newValue) => setStartDate(newValue ? newValue.toISOString().split('T')[0] : '')}
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date (Optional)"
              value={endDate ? new Date(endDate) : null}
              onChange={(newValue) => setEndDate(newValue ? newValue.toISOString().split('T')[0] : '')}
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </Grid>
        </Grid>

        <TextField
          margin="dense"
          name="targetAudience"
          label="Target Audience (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="keyObjectives"
          label="Key Objectives (Optional, comma-separated)"
          type="text"
          fullWidth
          variant="outlined"
          value={keyObjectives.join(', ')} // Display as comma-separated string
          onChange={handleKeyObjectivesChange} // Custom handler to parse into array
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
                <TextField
                    margin="dense"
                    name="budget"
                    label="Budget (Optional, e.g., $500 or $500-$1000)"
                    type="text" // Kept as text for flexibility like "$500 - $1000"
                    fullWidth
                    variant="outlined"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="channels-label">Channels (Optional)</InputLabel>
                    <Select
                        labelId="channels-label"
                        id="channels-multi-select"
                        multiple
                        value={channels}
                        onChange={(e) => setChannels(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                        input={<OutlinedInput id="select-multiple-chip" label="Channels (Optional)" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        >
                        {MARKETING_CHANNELS.map((channel) => (
                            <MenuItem
                            key={channel.id}
                            value={channel.label} // Store label, or id if preferred
                            style={getStyles(channel.label, channels, theme)}
                            >
                            {channel.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>

        <TextField
          margin="dense"
          name="linkedProjectId"
          label="Linked Project ID (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={linkedProjectId}
          onChange={(e) => setLinkedProjectId(e.target.value)}
          sx={{ mb: 2 }}
          // TODO: Replace with a Project selector/search component for better UX
        />

      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isLoading || !name.trim()}>
          {isLoading ? <CircularProgress size={24} /> : (campaign ? 'Save Changes' : 'Create Campaign')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditCampaignModal;
