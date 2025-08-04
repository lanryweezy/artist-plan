import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DebugInfo: React.FC = () => {
  const envVars = {
    'VITE_BACKEND_API_URL': import.meta.env.VITE_BACKEND_API_URL,
    'VITE_GEMINI_API_KEY': import.meta.env.VITE_GEMINI_API_KEY ? '***SET***' : 'NOT SET',
    'MODE': import.meta.env.MODE,
    'PROD': import.meta.env.PROD,
    'DEV': import.meta.env.DEV,
  };

  return (
    <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 9999, maxWidth: 400 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">🐛 Debug Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Environment Variables:</Typography>
            {Object.entries(envVars).map(([key, value]) => (
              <Typography key={key} variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                <strong>{key}:</strong> {value || 'undefined'}
              </Typography>
            ))}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>App Status:</Typography>
            <Typography variant="body2">
              ✅ React loaded<br/>
              ✅ Main component rendered<br/>
              🔍 Check console for errors
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DebugInfo;