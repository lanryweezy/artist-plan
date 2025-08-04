import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button, Alert } from '@mui/material';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  console.error('Error caught by boundary:', error);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: 3,
        backgroundColor: 'background.default'
      }}
    >
      <Alert severity="error" sx={{ mb: 2, maxWidth: '600px' }}>
        <Typography variant="h6" gutterBottom>
          Application Error
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The app encountered an error and needs to reload.
        </Typography>
        <Typography variant="body2" component="pre" sx={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0,0,0,0.1)',
          padding: 1,
          borderRadius: 1,
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {error.message}
        </Typography>
      </Alert>
      <Button variant="contained" onClick={resetErrorBoundary} sx={{ mr: 1 }}>
        Try Again
      </Button>
      <Button variant="outlined" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </Box>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;