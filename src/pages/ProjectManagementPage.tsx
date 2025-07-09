import React, { useState, useEffect } from 'react';
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
// import { useNavigate } from 'react-router-dom'; // For navigating to a project detail page (future)

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    CreateProjectData,
    UpdateProjectData
} from '../services/projectService';
import { Project, ProjectType, projectTypeOptions, ALL_PROJECT_STATUSES } from '../../types'; // Using imported ALL_PROJECT_STATUSES
// If ProjectStatus and ALL_PROJECT_STATUSES are not in root types.ts, define locally or import
// For now, using a local definition for status options
// const localProjectStatusOptions: Project['status'][] = ['New', 'Idea', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Archived'];
import { toast } from 'react-toastify';


// Helper to get status color (can be expanded)
const getProjectStatusColor = (status?: Project['status']) => {
  switch (status) {
    case 'Completed': return 'success.light'; // Using .light for better contrast with dark text on chip
    case 'In Progress': return 'info.light';
    case 'Planning': return 'secondary.light';
    case 'On Hold': return 'warning.light';
    case 'Archived': return 'grey.700'; // Darker grey for archived
    case 'New' : return 'primary.light';
    case 'Idea': return 'default';
    default: return 'text.secondary';
  }
};
const getProjectStatusTextColor = (status?: Project['status']) => {
    switch (status) {
      case 'Completed': case 'In Progress': case 'Planning': case 'New': case 'On Hold':
        return 'common.black'; // Or a dark text color that works with light chip backgrounds
      case 'Archived':
        return 'common.white';
      default: return 'text.primary';
    }
  };


const ProjectManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const [isCreateEditModalOpen, setCreateEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [currentName, setCurrentName] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentProjectType, setCurrentProjectType] = useState<ProjectType | string>(projectTypeOptions.length > 0 ? projectTypeOptions[0] : '');
  const [currentStatus, setCurrentStatus] = useState<Project['status']>(ALL_PROJECT_STATUSES[0]);
  const [currentStartDate, setCurrentStartDate] = useState<string>('');
  const [currentEndDate, setCurrentEndDate] = useState<string>('');
  const [currentDueDate, setCurrentDueDate] = useState<string>('');
  const [currentBudget, setCurrentBudget] = useState<string>('');


  const { data: projects, isLoading, isError, error } = useQuery<Project[], Error>('projects', getProjects);

  const commonMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setCreateEditModalOpen(false);
      setDeleteConfirmOpen(false);
      setEditingProject(null);
    },
  };

  const createProjectMutation = useMutation(createProject, {
    ...commonMutationOptions,
    onSuccess: (newProject) => {
        commonMutationOptions.onSuccess();
        toast.success(`Project "${newProject.name}" created!`);
    },
    onError: (err: Error) => {
      toast.error(`Error creating project: ${err.message}`);
    },
  });

  const updateProjectMutation = useMutation(
    ({ projectId, data }: { projectId: string; data: UpdateProjectData }) => updateProject(projectId, data),
    {
      ...commonMutationOptions,
      onSuccess: (updatedProject) => {
        commonMutationOptions.onSuccess();
        toast.success(`Project "${updatedProject.name}" updated!`);
      },
      onError: (err: Error) => {
        toast.error(`Error updating project: ${err.message}`);
      },
    }
  );

  const deleteProjectMutation = useMutation(deleteProject, {
    ...commonMutationOptions,
    onSuccess: () => {
        commonMutationOptions.onSuccess();
        toast.success(`Project "${editingProject?.name || 'Project'}" deleted successfully!`);
    },
    onError: (err: Error) => {
      toast.error(`Error deleting project: ${err.message}`);
    },
  });

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setCurrentName('');
    setCurrentDescription('');
    setCurrentProjectType(projectTypeOptions.length > 0 ? projectTypeOptions[0] : '');
    setCurrentStatus(ALL_PROJECT_STATUSES[0]);
    setCurrentStartDate('');
    setCurrentEndDate('');
    setCurrentDueDate('');
    setCurrentBudget('');
    setCreateEditModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setCurrentName(project.name);
    setCurrentDescription(project.description || '');
    setCurrentProjectType(project.projectType || (projectTypeOptions.length > 0 ? projectTypeOptions[0] : ''));
    setCurrentStatus(project.status);
    setCurrentStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '');
    setCurrentEndDate(project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '');
    setCurrentDueDate(project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '');
    setCurrentBudget(project.budget?.toString() || '');
    setCreateEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setEditingProject(project);
    setDeleteConfirmOpen(true);
  };

  const handleModalClose = () => {
    setCreateEditModalOpen(false);
    setEditingProject(null); // Clear editing project when modal closes
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmOpen(false);
     // Keep editingProject set for the toast message in mutation, will be cleared by commonMutationOptions
  };


  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const projectData: CreateProjectData | UpdateProjectData = {
      name: currentName,
      description: currentDescription,
      projectType: currentProjectType,
      status: currentStatus,
      startDate: currentStartDate || undefined,
      endDate: currentEndDate || undefined,
      dueDate: currentDueDate || undefined,
      budget: currentBudget ? parseFloat(currentBudget) : undefined,
    };

    if (editingProject) {
      updateProjectMutation.mutate({ projectId: editingProject.id, data: projectData });
    } else {
      createProjectMutation.mutate(projectData as CreateProjectData);
    }
  };

  const confirmDeleteProject = () => {
    if (editingProject) {
      deleteProjectMutation.mutate(editingProject.id);
    }
  };


  if (isLoading) return <Container sx={{mt:4, textAlign: 'center'}}><CircularProgress /><Typography sx={{mt:1}}>Loading projects...</Typography></Container>;
  if (isError && error) return <Container sx={{mt:4}}><Alert severity="error">Error fetching projects: {error.message}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
          New Project
        </Button>
      </Box>

      {projects && projects.length > 0 ? (
        <Paper elevation={2} sx={{ p: 0, backgroundColor: 'background.paper' }}>
          <List disablePadding>
            {projects.map((project, index) => (
              <React.Fragment key={project.id}>
                <ListItem
                  // onClick={() => navigate(`/project-management/${project.id}`)} // Future: navigate to detail
                  // button // Make item clickable
                  secondaryAction={
                    <Box>
                      <Tooltip title="Edit Project">
                        <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project);}} sx={{ mr: 0.5 }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Project">
                        <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(project);}}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon sx={{minWidth: 40, mr: 1}}>
                    <FolderIcon sx={{color: getProjectStatusColor(project.status), fontSize: '2rem'}}/>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="h6">{project.name}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mb: 0.5 }}>
                          {project.projectType}
                        </Typography>
                        <Chip
                            label={project.status}
                            size="small"
                            sx={{
                                backgroundColor: getProjectStatusColor(project.status),
                                color: getProjectStatusTextColor(project.status),
                                fontWeight: 500
                            }}
                        />
                        {project.dueDate && (
                          <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1.5 }}>
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < projects.length - 1 && <Divider component="li" variant="inset" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{p:3, textAlign: 'center', mt: 5, backgroundColor: 'background.paper'}}>
            <Typography variant="h6" gutterBottom>No projects yet.</Typography>
            <Typography color="text.secondary" paragraph>Get started by creating your first project!</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
                Create New Project
            </Button>
        </Paper>
      )}

      {/* Create/Edit Project Modal */}
      <Dialog open={isCreateEditModalOpen} onClose={handleModalClose} fullWidth maxWidth="md">
        <DialogTitle>{editingProject ? `Edit Project: ${editingProject.name}` : 'Create New Project'}</DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
            <DialogContent>
            <TextField autoFocus margin="normal" label="Project Name" type="text" fullWidth variant="outlined" value={currentName} onChange={(e) => setCurrentName(e.target.value)} sx={{ mb: 2 }} required />
            <TextField margin="normal" label="Description (Optional)" type="text" fullWidth multiline rows={4} variant="outlined" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} sx={{ mb: 2 }} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="project-type-label">Project Type</InputLabel>
                    <Select labelId="project-type-label" value={currentProjectType} label="Project Type" onChange={(e) => setCurrentProjectType(e.target.value as ProjectType)}>
                    {projectTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="project-status-label">Status</InputLabel>
                    <Select labelId="project-status-label" value={currentStatus} label="Status" onChange={(e) => setCurrentStatus(e.target.value as Project['status'])}>
                  {ALL_PROJECT_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                    <DatePicker
                        label="Start Date (Optional)"
                        value={currentStartDate ? new Date(currentStartDate) : null}
                        onChange={(newValue) => setCurrentStartDate(newValue ? newValue.toISOString().split('T')[0] : '')}
                        slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <DatePicker
                        label="End Date (Optional)"
                        value={currentEndDate ? new Date(currentEndDate) : null}
                        onChange={(newValue) => setCurrentEndDate(newValue ? newValue.toISOString().split('T')[0] : '')}
                        slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <DatePicker
                        label="Due Date (Optional)"
                        value={currentDueDate ? new Date(currentDueDate) : null}
                        onChange={(newValue) => setCurrentDueDate(newValue ? newValue.toISOString().split('T')[0] : '')}
                        slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                </Grid>
            </Grid>
            <TextField margin="normal" label="Budget (Optional)" type="number" fullWidth variant="outlined" value={currentBudget} onChange={(e) => setCurrentBudget(e.target.value)} InputProps={{ inputProps: { min: 0, step: "0.01" } }}/>

            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleModalClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading || !currentName.trim()}>
                {(createProjectMutation.isLoading || updateProjectMutation.isLoading) ? <CircularProgress size={24} /> : (editingProject ? 'Save Changes' : 'Create Project')}
            </Button>
            </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {editingProject && (
        <Dialog open={isDeleteConfirmOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Delete Project?</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the project: "<strong>{editingProject.name}</strong>"?</Typography>
            <Typography color="text.secondary" sx={{mt:1}}>This action cannot be undone. Associated tasks may also be affected (e.g., unlinked or deleted, depending on backend logic).</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={confirmDeleteProject} color="error" variant="contained" disabled={deleteProjectMutation.isLoading}>
              {deleteProjectMutation.isLoading ? <CircularProgress size={24}/> : "Delete Project"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

    </Container>
  );
};

export default ProjectManagementPage;
