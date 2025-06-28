import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 shadow-sm hover-shadow">
        <div className="position-relative">
          {recipe.imageUrl ? ( 
            <img
              src={recipe.imageUrl}
              className="card-img-top"
              alt={recipe.title}
              style={{ height: '200px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="card-img-top d-flex align-items-center justify-content-center"
              style={{ 
                height: '200px', 
                backgroundColor: '#f8f9fa',
                color: '#6c757d'
              }}
            >
              <i className="fas fa-utensils fa-3x"></i>
            </div>
          )}
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary">
              <i className="fas fa-clock me-1"></i>
              {recipe.cookingTime}
            </span>
          </div>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primary mb-2">
            {recipe.title}
          </h5>
          
          <div className="mb-3">
            <small className="text-muted">
              <i className="fas fa-user me-1"></i>
              By {recipe.createdBy}
            </small>
          </div>
          
          <div className="mb-3">
            <h6 className="text-secondary mb-2">
              <i className="fas fa-list me-1"></i>
              Ingredients ({recipe.ingredients.length})
            </h6>
            <p className="card-text small text-muted">
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 && '...'}
            </p>
          </div>
          
          <div className="mb-3">
            <h6 className="text-secondary mb-2">
              <i className="fas fa-utensils me-1"></i>
              Instructions
            </h6>
            <p className="card-text small">
              {truncateText(recipe.instructions)}
            </p>
          </div>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">
                <i className="fas fa-calendar me-1"></i>
                {formatDate(recipe.createdAt)}
              </small>
              <small className="text-muted">
                <i className="fas fa-eye me-1"></i>
                View Details
              </small>
            </div>
            
            <Link 
              to={`/recipes/${recipe._id}`}
              className="btn btn-outline-primary w-100"
            >
              <i className="fas fa-eye me-1"></i>
              View Recipe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 