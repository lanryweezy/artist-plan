import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
// import MoreVertIcon from '@mui/icons-material/MoreVert'; // For a menu
import { toast } from 'react-toastify'; // Import toast

import { getTasks, createTask, updateTask, deleteTask, CreateTaskData, UpdateTaskData } from '../services/taskService';
import { Task, TaskPriority, Subtask } from '../../types'; // Corrected path
import { taskPriorityOptions } from '../../types'; // Corrected path

// Helper to get priority color
const getPriorityColor = (priority?: TaskPriority): string => {
  switch (priority) {
    case 'High': return 'error.main';
    case 'Medium': return 'warning.main';
    case 'Low': return 'info.main';
    default: return 'text.secondary';
  }
};
const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'Completed': return 'success.main';
      case 'Ongoing': return 'info.main';
      case 'Todo': return 'default'; // Or a specific color like grey
      default: return 'text.secondary';
    }
  };

const TasksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form state for create/edit
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'Todo' | 'Ongoing' | 'Completed'>('Todo');
  const [currentPriority, setCurrentPriority] = useState<TaskPriority>('None');
  const [currentDueDate, setCurrentDueDate] = useState<string>(''); // Store as YYYY-MM-DD string

  // Fetching tasks
  const { data: tasks, isLoading, isError, error } = useQuery<Task[], Error>('tasks', getTasks);

  // Mutation for creating tasks
  const createTaskMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks'); // Refetch tasks after creation
      setCreateModalOpen(false); // Close modal
      // Reset form
      setCurrentTitle('');
      setCurrentDescription('');
      setCurrentStatus('Todo');
      setCurrentPriority('None');
      setCurrentDueDate('');
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries('tasks');
      setCreateModalOpen(false);
      setCurrentTitle('');
      setCurrentDescription('');
      setCurrentStatus('Todo');
      setCurrentPriority('None');
      setCurrentDueDate('');
      toast.success(`Task "${newTask.title}" created successfully!`);
    },
    onError: (err: Error) => {
      console.error("Error creating task:", err.message);
      toast.error(`Error creating task: ${err.message}`);
    }
  });

  // Mutation for updating tasks
  const updateTaskMutation = useMutation(({ taskId, data }: { taskId: string, data: UpdateTaskData }) => updateTask(taskId, data), {
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries('tasks');
      // Optionally, update the specific task in the cache for a more optimistic update feel
      // queryClient.setQueryData(['tasks', updatedTask._id], updatedTask);
      setEditModalOpen(false);
      toast.success(`Task "${updatedTask.title}" updated successfully!`);
    },
    onError: (err: Error) => {
        console.error("Error updating task:", err.message);
        toast.error(`Error updating task: ${err.message}`);
      }
  });

  // Mutation for deleting tasks
  const deleteTaskMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      setDeleteConfirmOpen(false);
      toast.success(`Task "${selectedTask?.title || 'Task'}" deleted successfully!`);
      setSelectedTask(null);
    },
    onError: (err: Error) => {
        console.error("Error deleting task:", err.message);
        toast.error(`Error deleting task: ${err.message}`);
      }
  });


  const handleOpenCreateModal = () => {
    setCurrentTitle('');
    setCurrentDescription('');
    setCurrentStatus('Todo');
    setCurrentPriority('None');
    setCurrentDueDate('');
    setCreateModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setCurrentTitle(task.title);
    setCurrentDescription(task.description || '');
    setCurrentStatus(task.status);
    setCurrentPriority(task.priority);
    setCurrentDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditModalOpen(true);
  };

  const handleOpenDeleteConfirm = (task: Task) => {
    setSelectedTask(task);
    setDeleteConfirmOpen(true);
  };

  const handleCreateSubmit = () => {
    const taskData: CreateTaskData = {
      title: currentTitle,
      description: currentDescription,
      status: currentStatus,
      priority: currentPriority,
      dueDate: currentDueDate || undefined, // Send undefined if empty
    };
    createTaskMutation.mutate(taskData);
  };

  const handleEditSubmit = () => {
    if (!selectedTask) return;
    const taskData: UpdateTaskData = {
      title: currentTitle,
      description: currentDescription,
      status: currentStatus,
      priority: currentPriority,
      dueDate: currentDueDate || undefined,
    };
    updateTaskMutation.mutate({ taskId: selectedTask.id, data: taskData });
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      deleteTaskMutation.mutate(selectedTask.id);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading tasks...</Typography>
      </Container>
    );
  }

  if (isError && error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Error fetching tasks: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          New Task
        </Button>
      </Box>

      {tasks && tasks.length > 0 ? (
        <Paper elevation={3} sx={{ p: 0 }}>
          <List disablePadding>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditModal(task)} sx={{mr: 0.5}}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteConfirm(task)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemIcon sx={{minWidth: 30, mr: 1}}>
                    <IconButton
                        size="small"
                        onClick={() => updateTaskMutation.mutate({taskId: task.id, data: {status: task.status === 'Completed' ? 'Todo' : 'Completed'}})}
                        disabled={updateTaskMutation.isLoading && selectedTask?.id === task.id}
                    >
                        {task.status === 'Completed' ? <CheckCircleOutlineIcon color="success" /> : <RadioButtonUncheckedIcon />}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={
                        <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                            {task.description && <Typography component="span" variant="body2" color="text.secondary" sx={{display: 'block'}}>{task.description}</Typography>}
                            <Chip
                                label={task.status}
                                size="small"
                                sx={{ mr: 1, mt:0.5, backgroundColor: getStatusColor(task.status), color: task.status === 'Completed' || task.status === 'Ongoing' ? 'common.white' : 'text.primary' }}
                            />
                            <Chip
                                icon={task.priority === 'High' ? <PriorityHighIcon /> : task.priority === 'Low' ? <LowPriorityIcon /> : undefined}
                                label={task.priority !== 'None' ? task.priority : 'No Priority'}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1, mt:0.5, color: getPriorityColor(task.priority), borderColor: getPriorityColor(task.priority) }}
                            />
                            {task.dueDate && (
                                <Typography component="span" variant="caption" color="text.secondary">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Box>
                    }
                  />
                </ListItem>
                {index < tasks.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography sx={{textAlign: 'center', mt: 5}}>No tasks found. Create one to get started!</Typography>
      )}

      {/* Create Task Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" type="text" fullWidth variant="outlined" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} sx={{mb:2}} required />
          <TextField margin="dense" label="Description (Optional)" type="text" fullWidth multiline rows={3} variant="outlined" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} sx={{mb:2}} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" sx={{mb:2}}>
                <InputLabel>Status</InputLabel>
                <Select value={currentStatus} label="Status" onChange={(e) => setCurrentStatus(e.target.value as typeof currentStatus)}>
                  <MenuItem value="Todo">Todo</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" sx={{mb:2}}>
                <InputLabel>Priority</InputLabel>
                <Select value={currentPriority} label="Priority" onChange={(e) => setCurrentPriority(e.target.value as TaskPriority)}>
                  {taskPriorityOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <DatePicker
            label="Due Date (Optional)"
            value={currentDueDate ? new Date(currentDueDate) : null}
            onChange={(newValue) => setCurrentDueDate(newValue ? newValue.toISOString().split('T')[0] : '')}
            slotProps={{ textField: { fullWidth: true, margin: 'dense', variant: 'outlined' } }}
          />
        </DialogContent>
        <DialogActions sx={{p: '0 24px 20px'}}>
          <Button onClick={() => setCreateModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained" disabled={createTaskMutation.isLoading || !currentTitle.trim()}>
            {createTaskMutation.isLoading ? <CircularProgress size={20} /> : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Modal */}
      {selectedTask && (
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Task: {selectedTask.title}</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="Title" type="text" fullWidth variant="outlined" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} sx={{mb:2}} required />
            <TextField margin="dense" label="Description (Optional)" type="text" fullWidth multiline rows={3} variant="outlined" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} sx={{mb:2}} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" sx={{mb:2}}>
                        <InputLabel>Status</InputLabel>
                        <Select value={currentStatus} label="Status" onChange={(e) => setCurrentStatus(e.target.value as typeof currentStatus)}>
                        <MenuItem value="Todo">Todo</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" sx={{mb:2}}>
                        <InputLabel>Priority</InputLabel>
                        <Select value={currentPriority} label="Priority" onChange={(e) => setCurrentPriority(e.target.value as TaskPriority)}>
                        {taskPriorityOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <DatePicker
              label="Due Date (Optional)"
              value={currentDueDate ? new Date(currentDueDate) : null}
              onChange={(newValue) => setCurrentDueDate(newValue ? newValue.toISOString().split('T')[0] : '')}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', variant: 'outlined' } }}
            />
          </DialogContent>
          <DialogActions sx={{p: '0 24px 20px'}}>
            <Button onClick={() => setEditModalOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained" color="primary" disabled={updateTaskMutation.isLoading || !currentTitle.trim()}>
              {updateTaskMutation.isLoading ? <CircularProgress size={20} /> : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedTask && (
        <Dialog open={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Delete Task?</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the task: "{selectedTask.title}"? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteTaskMutation.isLoading}>
              {deleteTaskMutation.isLoading ? <CircularProgress size={20}/> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default TasksPage;
