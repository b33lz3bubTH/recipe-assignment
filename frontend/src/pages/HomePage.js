import React from 'react';
import useAuthStore from '../store/authStore';

const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="jumbotron text-center">
            <h1 className="display-4">Welcome to Recipe App</h1>
            <p className="lead">
              {isAuthenticated 
                ? `Hello ${user?.username}! Discover and share amazing recipes.`
                : 'Discover and share amazing recipes. Please login or register to get started.'
              }
            </p>
            <hr className="my-4" />
            <p>
              This is a recipe management application where you can create, view, and manage your favorite recipes.
            </p>
            {!isAuthenticated && (
              <div className="d-flex justify-content-center gap-3">
                <a className="btn btn-primary btn-lg" href="/login" role="button">
                  Login
                </a>
                <a className="btn btn-outline-primary btn-lg" href="/register" role="button">
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 