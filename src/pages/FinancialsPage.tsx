import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const FinancialsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financials
      </Typography>
      <Typography paragraph>
        Track your income, expenses, budgets, and financial goals.
      </Typography>
      {/* Placeholder for financials dashboard, records, budgets, goals sections */}
    </Container>
  );
};

export default FinancialsPage;
