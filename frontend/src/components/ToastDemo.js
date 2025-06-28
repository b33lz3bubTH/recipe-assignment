import React from 'react';
import { showToast } from '../utils/toast';

const ToastDemo = () => {
  const handleShowSuccess = () => {
    showToast.success('This is a success message!');
  };

  const handleShowError = () => {
    showToast.error('This is an error message!');
  };

  const handleShowWarning = () => {
    showToast.warning('This is a warning message!');
  };

  const handleShowInfo = () => {
    showToast.info('This is an info message!');
  };

  const handleShowLoading = () => {
    const toastId = showToast.loading('Loading...');
    setTimeout(() => {
      showToast.update(toastId, 'Loading completed!', 'success');
    }, 3000);
  };

  const handleShowApiError = () => {
    showToast.error('Invalid email format');
  };

  const handleShowValidationError = () => {
    showToast.error('Email is required');
    setTimeout(() => {
      showToast.error('Password must be at least 6 characters');
    }, 1000);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Toast Notification Demo</h3>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">
                Click the buttons below to see different types of toast notifications.
              </p>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <button 
                    className="btn btn-success w-100" 
                    onClick={handleShowSuccess}
                  >
                    Show Success Toast
                  </button>
                </div>
                
                <div className="col-md-6">
                  <button 
                    className="btn btn-danger w-100" 
                    onClick={handleShowError}
                  >
                    Show Error Toast
                  </button>
                </div>
                
                <div className="col-md-6">
                  <button 
                    className="btn btn-warning w-100" 
                    onClick={handleShowWarning}
                  >
                    Show Warning Toast
                  </button>
                </div>
                
                <div className="col-md-6">
                  <button 
                    className="btn btn-info w-100" 
                    onClick={handleShowInfo}
                  >
                    Show Info Toast
                  </button>
                </div>
                
                <div className="col-md-6">
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={handleShowLoading}
                  >
                    Show Loading Toast
                  </button>
                </div>
                
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-danger w-100" 
                    onClick={handleShowApiError}
                  >
                    Show API Error
                  </button>
                </div>
                
                <div className="col-12">
                  <button 
                    className="btn btn-outline-warning w-100" 
                    onClick={handleShowValidationError}
                  >
                    Show Validation Errors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo; 