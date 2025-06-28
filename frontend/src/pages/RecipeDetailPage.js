import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useRecipeStore from '../store/recipeStore';
import useAuthStore from '../store/authStore';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { currentRecipe, loading, fetchRecipeById, clearCurrentRecipe } = useRecipeStore();

  useEffect(() => {
    if (id) {
      fetchRecipeById(id);
    }

    return () => {
      clearCurrentRecipe();
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if current user is the creator of the recipe
  const isRecipeCreator = user?.username === currentRecipe?.createdBy;

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle fa-4x text-warning"></i>
          </div>
          <h3 className="text-muted mb-3">Recipe not found</h3>
          <p className="text-muted mb-4">The recipe you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-1"></i>
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-1"></i>
            Back to Recipes
          </button>
        </div>
      </div>

      <div className="row">
        {/* Recipe Image */}
        <div className="col-lg-6 mb-4">
          {currentRecipe.imageUrl ? (
            <img
              src={currentRecipe.imageUrl}
              className="img-fluid rounded shadow"
              alt={currentRecipe.title}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="d-flex align-items-center justify-content-center rounded shadow"
              style={{ 
                height: '400px', 
                backgroundColor: '#f8f9fa',
                color: '#6c757d'
              }}
            >
              <div className="text-center">
                <i className="fas fa-utensils fa-5x mb-3"></i>
                <p className="text-muted">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Details */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* Recipe Title and Meta */}
              <div className="mb-4">
                <h1 className="display-5 text-primary mb-2">{currentRecipe.title}</h1>
                <div className="d-flex align-items-center text-muted mb-3">
                  <i className="fas fa-user me-2"></i>
                  <span>By {currentRecipe.createdBy}</span>
                </div>
                <div className="d-flex align-items-center text-muted mb-3">
                  <i className="fas fa-calendar me-2"></i>
                  <span>Created on {formatDate(currentRecipe.createdAt)}</span>
                </div>
                {currentRecipe.updatedAt !== currentRecipe.createdAt && (
                  <div className="d-flex align-items-center text-muted mb-3">
                    <i className="fas fa-edit me-2"></i>
                    <span>Updated on {formatDate(currentRecipe.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* Cooking Time */}
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary fs-6 me-2">
                    <i className="fas fa-clock me-1"></i>
                    {currentRecipe.cookingTime}
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <h3 className="h5 text-secondary mb-3">
                  <i className="fas fa-list me-2"></i>
                  Ingredients ({currentRecipe.ingredients.length})
                </h3>
                <ul className="list-group list-group-flush">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="list-group-item border-0 px-0 py-2">
                      <i className="fas fa-check text-success me-2"></i>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <h3 className="h5 text-secondary mb-3">
                  <i className="fas fa-utensils me-2"></i>
                  Instructions
                </h3>
                <div className="bg-light p-3 rounded">
                  <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                    {currentRecipe.instructions}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                {isAuthenticated && (
                  <>
                    {/* Only show edit button if user is the recipe creator */}
                    {isRecipeCreator && (
                      <Link 
                        to={`/edit-recipe/${currentRecipe._id}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit Recipe
                      </Link>
                    )}
                    <button className="btn btn-outline-success">
                      <i className="fas fa-heart me-1"></i>
                      Save Recipe
                    </button>
                  </>
                )}
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-share me-1"></i>
                  Share Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Recipes Section (placeholder for future) */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4 text-primary mb-3">
                <i className="fas fa-thumbs-up me-2"></i>
                You might also like...
              </h3>
              <p className="text-muted mb-0">
                Related recipes feature coming soon! Stay tuned for more delicious recipes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage; 