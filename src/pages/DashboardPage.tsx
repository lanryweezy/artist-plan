import React from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Icon, // For using MUI string icons or SVG components
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment'; // Example Icon for Tasks
import WorkspacesIcon from '@mui/icons-material/Workspaces'; // Example Icon for Projects
import useAuthStore from '../store/authStore';
import { getDashboardSummary, DashboardSummaryData } from '../services/dashboardService';
import { APP_NAME } from '../constants';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color?: string; // e.g., 'primary.main', 'secondary.main', or a direct hex value
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%', // Ensure cards in a row are same height
      textAlign: 'center'
    }}
  >
    <Box sx={{ fontSize: 40, color: color || 'primary.main', mb: 1 }}>
      {icon}
    </Box>
    <Typography variant="h6" component="h3" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" component="p">
      {value}
    </Typography>
  </Paper>
);


const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: summaryData, isLoading, isError, error } = useQuery<DashboardSummaryData, Error>(
    'dashboardSummary',
    getDashboardSummary
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{mt: 2}}>Loading dashboard data...</Typography>
      </Container>
    );
  }

  if (isError && error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Error fetching dashboard data: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Welcome back, {user?.name || 'Artist'}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Active Tasks"
            value={summaryData?.incompleteTasks ?? 'N/A'}
            icon={<AssignmentIcon fontSize="inherit" />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Ongoing Projects"
            value={summaryData?.ongoingProjects ?? 'N/A'}
            icon={<WorkspacesIcon fontSize="inherit" />}
            color="primary.main"
          />
        </Grid>
        {/* Add more SummaryCard instances here for other data points as they become available */}
        {/* Example:
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Upcoming Deadlines"
            value={summaryData?.upcomingDeadlinesCount ?? 'N/A'}
            icon={<EventBusyIcon fontSize="inherit" />}
            color="error.main"
          />
        </Grid>
        */}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        {/* Placeholder for quick action buttons, e.g., Create Task, New Project, Add Expense */}
        <Button variant="contained" sx={{mr: 1}}>Create New Task</Button>
        <Button variant="outlined">New Project</Button>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Activity
        </Typography>
        <Paper elevation={2} sx={{p:2}}>
            <Typography>No recent activity to display yet.</Typography>
        </Paper>
        {/* Placeholder for recent activity feed */}
      </Box>

    </Container>
  );
};

export default DashboardPage;
