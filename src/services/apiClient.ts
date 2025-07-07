import axios from 'axios';
// import useAuthStore from '../store/authStore'; // No longer needed here for setting token

// Using Vite's import.meta.env for environment variables
// Ensure you have a .env file at the root of your project (e.g., .env.local)
// with VITE_BACKEND_API_URL=http://your-backend-api-url.com/api
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// The request interceptor to add the token is now effectively handled by:
// 1. The `onRehydrateStorage` in `authStore.ts` setting the header on app load.
// 2. The `setUserAndToken` and `logout` methods in `authStore.ts` updating the header.

// Optional: Response interceptor for global error handling (e.g., 401 to trigger logout)
// This can remain here or be enhanced.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If a 401 occurs, it means the token is invalid or expired.
      // The authStore.logout() will clear the token and update UI.
      // We should call it, but avoid circular dependencies if authStore imports apiClient.
      // A common pattern is to have an event emitter or call logout directly from components/hooks that catch the 401.
      // For now, just logging. A component that uses a service calling this might handle logout.
      console.error('API Client: Unauthorized (401). Token may be invalid or expired.');
      // To trigger logout from here without circular dependency:
      // Option 1: Dispatch a custom event that a top-level component listens for to call logout.
      // Option 2: Directly import and call useAuthStore.getState().logout() if no circular dependency is created.
      // Let's assume for now that components calling services will handle the logout trigger on 401.
    }
    return Promise.reject(error);
  }
);

export default apiClient;
