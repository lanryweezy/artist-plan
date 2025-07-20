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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    getFinancialRecords,
    createFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    // getBudgets, createBudget, updateBudget, deleteBudget, // TODO
    // getFinancialGoals, createFinancialGoal, updateFinancialGoal, deleteFinancialGoal, // TODO
    // Interfaces for create/update data will be needed for modals
} from '../services/financialService'; // Assuming financialService.ts exists
import { FinancialRecord, FinancialRecordType, Budget, FinancialGoal, commonExpenseCategories, budgetPeriodOptions } from '../../types';

// Placeholder for modals - these would be separate components
// import CreateEditFinancialRecordModal from '../components/modals/CreateEditFinancialRecordModal';
// import CreateEditBudgetModal from '../components/modals/CreateEditBudgetModal';
// import CreateEditFinancialGoalModal from '../components/modals/CreateEditFinancialGoalModal';


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
      id={`financials-tabpanel-${index}`}
      aria-labelledby={`financials-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// For Financial Record Modal (Simplified inline for now)
interface FinancialRecordFormData {
    description: string;
    amount: string; // string for form input
    type: FinancialRecordType;
    date: string; // YYYY-MM-DD
    category?: string;
    // budgetId?: string; // TODO: Add budget selector
    // projectId?: string; // TODO: Add project selector
    notes?: string;
}


const FinancialsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState(0);

  // === Financial Records State & Logic ===
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<FinancialRecord | null>(null);
  const [recordFormData, setRecordFormData] = useState<FinancialRecordFormData>({
    description: '', amount: '', type: FinancialRecordType.EXPENSE, date: new Date().toISOString().split('T')[0], category: '', notes: ''
  });

  const { data: financialRecords, isLoading: isLoadingRecords, isError: isErrorRecords, error: errorRecords, refetch: refetchRecords } =
    useQuery<FinancialRecord[], Error>('financialRecords', getFinancialRecords, { enabled: currentTab === 0 });

  const handleRecordFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, fieldName?: string) => {
    if (fieldName === 'type' || fieldName === 'category') { // For Select components
        setRecordFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
    } else if (fieldName === 'date') { // For DatePicker
        setRecordFormData(prev => ({ ...prev, date: e ? (e as Date).toISOString().split('T')[0] : '' }));
    }
    else {
        setRecordFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const resetRecordForm = () => {
    setRecordFormData({ description: '', amount: '', type: FinancialRecordType.EXPENSE, date: new Date().toISOString().split('T')[0], category: '', notes: '' });
  };

  const commonRecordMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries('financialRecords');
      setRecordModalOpen(false);
      setEditingRecord(null);
      resetRecordForm();
    },
  };

  const createRecordMutation = useMutation(createFinancialRecord, {
    ...commonRecordMutationOptions,
    onSuccess: (newRecord) => {
      commonRecordMutationOptions.onSuccess();
      toast.success(`Record "${newRecord.description}" created!`);
    },
    onError: (err: Error) => toast.error(`Error creating record: ${err.message}`),
  });

  const updateRecordMutation = useMutation(
    ({ recordId, data }: { recordId: string; data: Partial<FinancialRecordFormData> }) => updateFinancialRecord(recordId, data as any), // Cast needed if types don't align perfectly
    {
      ...commonRecordMutationOptions,
      onSuccess: (updatedRecord) => {
        commonRecordMutationOptions.onSuccess();
        toast.success(`Record "${updatedRecord.description}" updated!`);
      },
      onError: (err: Error) => toast.error(`Error updating record: ${err.message}`),
    }
  );

  const deleteRecordMutation = useMutation(deleteFinancialRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('financialRecords');
      toast.success(`Record "${recordToDelete?.description || 'Record'}" deleted!`);
      setRecordToDelete(null);
    },
    onError: (err: Error) => {
      toast.error(`Error deleting record: ${err.message}`);
      setRecordToDelete(null);
    },
  });

  const handleOpenCreateRecordModal = () => {
    setEditingRecord(null);
    resetRecordForm();
    setRecordModalOpen(true);
  };

  const handleOpenEditRecordModal = (record: FinancialRecord) => {
    setEditingRecord(record);
    setRecordFormData({
        description: record.description,
        amount: record.amount.toString(),
        type: record.type,
        date: new Date(record.date).toISOString().split('T')[0],
        category: record.category || '',
        notes: record.notes || ''
    });
    setRecordModalOpen(true);
  };

  const handleRecordModalClose = () => {
    setRecordModalOpen(false);
    setEditingRecord(null);
  };

  const handleRecordFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
        ...recordFormData,
        amount: parseFloat(recordFormData.amount),
    };
    if (editingRecord) {
      updateRecordMutation.mutate({ recordId: editingRecord.id, data: payload });
    } else {
      createRecordMutation.mutate(payload);
    }
  };

  const confirmDeleteRecord = () => {
    if (recordToDelete) deleteRecordMutation.mutate(recordToDelete.id);
  };


  // TODO: Add state and logic for Budgets and Financial Goals similar to Records

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (newValue === 0) refetchRecords();
    // if (newValue === 1) refetchBudgets(); // TODO
    // if (newValue === 2) refetchGoals(); // TODO
  };

  const renderFinancialRecordsTab = () => {
    if (isLoadingRecords) return <Box sx={{mt:2, textAlign: 'center'}}><CircularProgress /><Typography sx={{mt:1}}>Loading records...</Typography></Box>;
    if (isErrorRecords && errorRecords) return <Alert severity="error" sx={{mt:2}}>Error: {errorRecords.message}</Alert>;

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateRecordModal}>
                Add Record
            </Button>
        </Box>
        {financialRecords && financialRecords.length > 0 ? (
            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }} aria-label="financial records table">
                    <TableHead>
                        <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {financialRecords.map((record) => (
                        <TableRow key={record.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': {backgroundColor: 'action.hover'} }}>
                            <TableCell component="th" scope="row">{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell>{record.category || '-'}</TableCell>
                            <TableCell align="right" sx={{ color: record.type === FinancialRecordType.INCOME ? 'success.main' : 'error.main', fontWeight: 'medium' }}>
                                {record.type === FinancialRecordType.INCOME ? '+' : '-'}${Math.abs(record.amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={record.type}
                                    size="small"
                                    color={record.type === FinancialRecordType.INCOME ? 'success' : 'error'}
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="Edit Record">
                                    <IconButton size="small" onClick={() => handleOpenEditRecordModal(record)} sx={{mr:0.5}}>
                                        <EditIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Record">
                                    <IconButton size="small" onClick={() => setRecordToDelete(record)}>
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Paper elevation={0} sx={{p:3, textAlign: 'center', mt: 2, backgroundColor: 'transparent'}}>
                <Typography variant="subtitle1">No financial records yet.</Typography>
            </Paper>
        )}

        {/* Financial Record Modal */}
        <Dialog open={isRecordModalOpen} onClose={handleRecordModalClose} fullWidth maxWidth="sm" PaperProps={{component: 'form', onSubmit: handleRecordFormSubmit}}>
            <DialogTitle>{editingRecord ? 'Edit Financial Record' : 'Add New Financial Record'}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="normal" name="description" label="Description" fullWidth required value={recordFormData.description} onChange={handleRecordFormChange} sx={{mb:1}}/>
                <Grid container spacing={2} sx={{mb:1}}>
                    <Grid item xs={12} sm={6}>
                        <TextField margin="normal" name="amount" label="Amount" type="number" fullWidth required value={recordFormData.amount} onChange={handleRecordFormChange} InputProps={{ inputProps: { step: "0.01", min: "0" }}}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="record-type-label">Type</InputLabel>
                            <Select labelId="record-type-label" name="type" value={recordFormData.type} label="Type" onChange={(e) => handleRecordFormChange(e, 'type')}>
                                <MenuItem value={FinancialRecordType.INCOME}>Income</MenuItem>
                                <MenuItem value={FinancialRecordType.EXPENSE}>Expense</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{mb:1}}>
                    <Grid item xs={12} sm={6}>
                         <DatePicker
                            label="Date"
                            value={recordFormData.date ? new Date(recordFormData.date) : new Date()}
                            onChange={(newValue) => handleRecordFormChange(newValue, 'date')}
                            slotProps={{ textField: { fullWidth: true, margin: 'normal', required: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="record-category-label">Category (Optional)</InputLabel>
                            <Select labelId="record-category-label" name="category" value={recordFormData.category} label="Category (Optional)" onChange={(e) => handleRecordFormChange(e, 'category')} displayEmpty>
                                <MenuItem value=""><em>None</em></MenuItem>
                                {commonExpenseCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                {/* TODO: Allow adding custom categories or fetch from a predefined list */}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <TextField margin="normal" name="notes" label="Notes (Optional)" fullWidth multiline rows={2} value={recordFormData.notes} onChange={handleRecordFormChange} />
            </DialogContent>
            <DialogActions sx={{p:'16px 24px'}}>
                <Button onClick={handleRecordModalClose} color="inherit" disabled={createRecordMutation.isLoading || updateRecordMutation.isLoading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={createRecordMutation.isLoading || updateRecordMutation.isLoading || !recordFormData.description.trim() || !recordFormData.amount.trim()}>
                    {(createRecordMutation.isLoading || updateRecordMutation.isLoading) ? <CircularProgress size={24}/> : (editingRecord ? 'Save Changes' : 'Add Record')}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Delete Record Confirmation */}
        <Dialog open={!!recordToDelete} onClose={() => setRecordToDelete(null)}>
            <DialogTitle>Delete Record?</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete the record: "<strong>{recordToDelete?.description}</strong>"?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setRecordToDelete(null)}>Cancel</Button>
                <Button onClick={confirmDeleteRecord} color="error" variant="contained" disabled={deleteRecordMutation.isLoading}>
                    {deleteRecordMutation.isLoading ? <CircularProgress size={24}/> : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
      </>
    );
  };

  const renderBudgetsTab = () => {
    // TODO: Implement UI for Budgets
    return <Typography sx={{mt:2}}>Budgets management UI will be here.</Typography>;
  };

  const renderFinancialGoalsTab = () => {
    // TODO: Implement UI for Financial Goals
    return <Typography sx={{mt:2}}>Financial goals management UI will be here.</Typography>;
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        Financials
      </Typography>

      <Paper elevation={2} sx={{backgroundColor: 'background.paper', mb:3}}>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="inherit" variant="fullWidth" centered>
          <Tab label="Transactions" id="financials-tab-0" aria-controls="financials-tabpanel-0" />
          <Tab label="Budgets" id="financials-tab-1" aria-controls="financials-tabpanel-1" />
          <Tab label="Goals" id="financials-tab-2" aria-controls="financials-tabpanel-2" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        {renderFinancialRecordsTab()}
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        {renderBudgetsTab()}
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        {renderFinancialGoalsTab()}
      </TabPanel>
    </Container>
  );
};

export default FinancialsPage;
