import { create } from 'zustand';
import api from '../utils/api';
import { showApiError } from '../utils/toast';

const useRecipeStore = create((set, get) => ({
  // State
  recipes: [],
  currentRecipe: null,
  loading: false,
  totalRecipes: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',

  // Actions
  setLoading: (loading) => set({ loading }),

  // Fetch all recipes with pagination and search
  fetchRecipes: async (params = {}) => {
    const state = get();
    console.log(`fetching from backend: `);
    set({ loading: true });
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (search.trim()) {
        queryParams.append('search', search.trim());
      }

      const response = await api.get(`/recipes?${queryParams}`);
      const { recipes, total, page: currentPage, totalPages } = response.data.data;

      set({
        recipes,
        totalRecipes: total,
        currentPage,
        totalPages,
        limit,
        searchQuery: search,
        sortBy,
        sortOrder,
        loading: false
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });
      showApiError(error);
      return { success: false };
    }
  },

  // Fetch a single recipe by ID
  fetchRecipeById: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/recipes/${id}`);
      const { recipe } = response.data.data;

      set({
        currentRecipe: recipe,
        loading: false
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });
      showApiError(error);
      return { success: false };
    }
  },

  // Clear current recipe
  clearCurrentRecipe: () => {
    set({ currentRecipe: null });
  },

  // Update search and fetch
  searchRecipes: async (searchQuery) => {
    const state = get();
    await get().fetchRecipes({
      page: 1,
      limit: state.limit,
      search: searchQuery,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder
    });
  },

  // Change page
  changePage: async (page) => {
    const state = get();
    await get().fetchRecipes({
      page,
      limit: state.limit,
      search: state.searchQuery,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder
    });
  },

  // Change sort
  changeSort: async (sortBy, sortOrder) => {
    const state = get();
    await get().fetchRecipes({
      page: 1,
      limit: state.limit,
      search: state.searchQuery,
      sortBy,
      sortOrder
    });
  }
}));

export default useRecipeStore; 