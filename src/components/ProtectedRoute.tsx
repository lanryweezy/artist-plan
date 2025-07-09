import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface ProtectedRouteProps {
  // No children prop needed when using Outlet for nested routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isLoadingAuth = useAuthStore((state) => state.isLoading); // To handle initial auth check if async
  const token = useAuthStore((state) => state.token); // Check token directly for initial load
  const location = useLocation();

  // This effect handles the case where Zustand rehydration might not be instant
  // or if there's an async check for authentication initially.
  // For now, we rely on the synchronous `isAuthenticated` after rehydration.
  // A more robust solution might involve an initial "auth check" state in the store.

  if (isLoadingAuth && !token) { // Show loading spinner if auth state is loading (e.g. initial check) AND no token yet
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated()) {
    // Redirect them to the /login page, saving the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Render the child route components (which will be the Layout and its children)
};

export default ProtectedRoute;
