import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const MarketingCampaignsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Marketing Campaigns
      </Typography>
      <Typography paragraph>
        Plan and track your marketing campaigns.
      </Typography>
      {/* Placeholder for campaigns list, create campaign button etc. */}
    </Container>
  );
};

export default MarketingCampaignsPage;
