import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography paragraph>
        Welcome to your Artist Plan dashboard! This is where your overview and key metrics will appear.
      </Typography>
      {/* Placeholder for dashboard content */}
    </Container>
  );
};

export default DashboardPage;
