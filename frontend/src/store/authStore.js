import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import { showToast, showApiError } from '../utils/toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      // Register user
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, tokens } = response.data.data;
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          showToast.success('Registration successful! Welcome to Recipe App.');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          showApiError(error);
          return { success: false };
        }
      },

      // Login user
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, tokens } = response.data.data;
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          showToast.success(`Welcome back, ${user.username}!`);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          showApiError(error);
          return { success: false };
        }
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        // Clear localStorage
        localStorage.removeItem('auth-storage');
        showToast.info('You have been logged out successfully.');
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const { accessToken, user } = get();
        if (accessToken && user) {
          // Set isAuthenticated to true if we have both token and user
          set({ isAuthenticated: true });
        } else {
          // Clear any invalid state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false
          });
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