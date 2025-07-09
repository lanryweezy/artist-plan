import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const TasksPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tasks
      </Typography>
      <Typography paragraph>
        Manage your tasks and to-do items here.
      </Typography>
      {/* Placeholder for tasks list, filters, create task button etc. */}
    </Container>
  );
};

export default TasksPage;
