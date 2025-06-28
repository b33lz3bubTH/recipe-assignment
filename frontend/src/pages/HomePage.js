import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useRecipeStore from '../store/recipeStore';
import RecipeCard from '../components/RecipeCard';
import SearchAndSort from '../components/SearchAndSort';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const {
    recipes,
    loading,
    totalRecipes,
    currentPage,
    totalPages,
    fetchRecipes,
    searchRecipes,
    changePage,
    changeSort
  } = useRecipeStore();

  // Use ref to track if we've already fetched for current auth state
  const lastAuthState = useRef(null);

  // Memoize the fetch functions to prevent infinite loops
  const loadAuthenticatedRecipes = useCallback(async () => {
    await fetchRecipes({ page: 1, limit: 10 });
  }, [fetchRecipes]);

  const loadUnauthenticatedRecipes = useCallback(async () => {
    await fetchRecipes({ page: 1, limit: 5 });
  }, [fetchRecipes]);

  // Load recipes on mount and when auth status changes
  useEffect(() => {
    console.log(`isAuthenticated changed: `, isAuthenticated);
    // Only fetch if auth state changed or we haven't fetched yet
    if (lastAuthState.current !== isAuthenticated) {
      lastAuthState.current = isAuthenticated;
      
      if (isAuthenticated) {
        // For authenticated users: fetch with pagination
        loadAuthenticatedRecipes();
      } else {
        // For non-authenticated users: fetch only 5 recipes
        loadUnauthenticatedRecipes();
      }
    }
  }, [isAuthenticated, loadAuthenticatedRecipes, loadUnauthenticatedRecipes]);

  const handleSearch = useCallback((searchQuery) => {
    if (isAuthenticated) {
      searchRecipes(searchQuery);
    }
  }, [isAuthenticated, searchRecipes]);

  const handleSort = useCallback((sortBy, sortOrder) => {
    if (isAuthenticated) {
      changeSort(sortBy, sortOrder);
    }
  }, [isAuthenticated, changeSort]);

  const handlePageChange = useCallback((page) => {
    if (isAuthenticated) {
      changePage(page);
    }
  }, [isAuthenticated, changePage]);

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 text-primary mb-3">
            <i className="fas fa-utensils me-3"></i>
            Recipe Collection
          </h1>
          <p className="lead text-muted">
            {isAuthenticated 
              ? `Welcome back, ${user?.username}! Discover and explore amazing recipes.`
              : 'Discover amazing recipes from our community. Sign up to see all recipes and create your own!'
            }
          </p>
        </div>
      </div>

      {/* Search and Sort Section (only for authenticated users) */}
      {isAuthenticated && (
        <SearchAndSort
          onSearch={handleSearch}
          onSort={handleSort}
          currentSortBy="createdAt"
          currentSortOrder="desc"
        />
      )}

      {/* Info Box for Unauthenticated Users */}
      {!isAuthenticated && recipes.length > 0 && (
        <div className="alert alert-info text-center mb-4" role="alert">
          <div className="d-flex align-items-center justify-content-center">
            <i className="fas fa-info-circle fa-2x me-3 text-info"></i>
            <div>
              <h5 className="alert-heading mb-1">Want to see more recipes?</h5>
              <p className="mb-2">Currently showing 5 latest recipes. Sign up or login to view all recipes and create your own!</p>
              <div className="d-flex gap-2 justify-content-center">
                <Link to="/login" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary">
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading recipes...</p>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && recipes.length > 0 && (
        <>
          {/* Results Info (only for authenticated users) */}
          {isAuthenticated && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-muted mb-0">
                    Showing {recipes.length} of {totalRecipes} recipes
                  </p>
                  <Link to="/add-recipe" className="btn btn-success">
                    <i className="fas fa-plus me-1"></i>
                    Add New Recipe
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recipe Cards */}
          <div className="row">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination (only for authenticated users) */}
          {isAuthenticated && totalPages > 1 && (
            <div className="mt-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* No Recipes State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-search fa-4x text-muted"></i>
          </div>
          <h3 className="text-muted mb-3">No recipes found</h3>
          <p className="text-muted mb-4">
            {isAuthenticated 
              ? "Try adjusting your search criteria or add a new recipe!"
              : "Be the first to add a recipe to our collection!"
            }
          </p>
          {isAuthenticated && (
            <Link to="/add-recipe" className="btn btn-primary">
              <i className="fas fa-plus me-1"></i>
              Add Your First Recipe
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(HomePage); 