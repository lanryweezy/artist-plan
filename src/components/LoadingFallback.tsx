import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingFallback: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.primary">
        Loading Artist Plan...
      </Typography>
    </Box>
  );
};

export default LoadingFallback;