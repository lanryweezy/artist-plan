import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const ProjectsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Management
      </Typography>
      <Typography paragraph>
        Oversee your projects, track progress, and manage details.
      </Typography>
      {/* Placeholder for projects list, create project button etc. */}
    </Container>
  );
};

export default ProjectsPage;
