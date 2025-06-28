import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Register user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, tokens } = response.data.data;
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Login user
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, tokens } = response.data.data;
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        
        // Clear localStorage
        localStorage.removeItem('auth-storage');
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const { accessToken, user } = get();
        if (accessToken && user) {
          // Token will be automatically added by the API interceptor
        }
      },

      // Refresh token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const response = await api.post('/auth/refresh', {
            refreshToken
          });
          
          const { accessToken } = response.data.data.tokens;
          
          set({
            accessToken,
            isLoading: false
          });
          
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore; 