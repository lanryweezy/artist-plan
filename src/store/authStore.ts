import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../../types'; // Corrected path: types.ts is at root
import apiClient from '../services/apiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: () => boolean;
  setUserAndToken: (user: User | null, token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

// Define a helper function to update apiClient headers
const updateApiClientAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: () => !!get().token && !!get().user,
      setUserAndToken: (user, token) => {
        set({ user, token, error: null, isLoading: false });
        updateApiClientAuthHeader(token);
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      logout: () => {
        set({ user: null, token: null, error: null, isLoading: false });
        updateApiClientAuthHeader(null);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => {
        // This function is called when persisted state is rehydrated.
        // We use it to ensure the apiClient header is set on app load if a token exists.
        return (state, error) => {
          if (error) {
            console.error('AuthStore: Failed to rehydrate from localStorage', error);
          } else if (state?.token) {
            updateApiClientAuthHeader(state.token);
            // console.log('AuthStore: Token rehydrated to apiClient headers');
          }
        };
      },
    }
  )
);

// Ensure the header is set on initial load if rehydration hasn't completed yet
// or if onRehydrateStorage is not perfectly timed with apiClient import.
// This is a bit of a belt-and-suspenders approach.
const initialTokenOnLoad = useAuthStore.getState().token;
if (initialTokenOnLoad) {
  updateApiClientAuthHeader(initialTokenOnLoad);
}

export default useAuthStore;
