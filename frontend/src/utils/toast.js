import { toast } from 'react-toastify';

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Toast types
export const showToast = {
  // Success toast
  success: (message) => {
    toast.success(message, toastConfig);
  },

  // Error toast
  error: (message) => {
    toast.error(message, {
      ...toastConfig,
      autoClose: 7000, // Keep error toasts longer
    });
  },

  // Warning toast
  warning: (message) => {
    toast.warning(message, toastConfig);
  },

  // Info toast
  info: (message) => {
    toast.info(message, toastConfig);
  },

  // Loading toast
  loading: (message) => {
    return toast.loading(message, {
      ...toastConfig,
      autoClose: false,
    });
  },

  // Update loading toast
  update: (toastId, message, type = 'success') => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 5000,
    });
  },

  // Dismiss toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

// Helper function to show API errors
export const showApiError = (error) => {
  let message = 'An unexpected error occurred';
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.status === 401) {
    message = 'Authentication failed. Please login again.';
  } else if (error.response?.status === 403) {
    message = 'You do not have permission to perform this action.';
  } else if (error.response?.status === 404) {
    message = 'The requested resource was not found.';
  } else if (error.response?.status === 500) {
    message = 'Server error. Please try again later.';
  } else if (error.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  showToast.error(message);
};

// Helper function to show validation errors
export const showValidationError = (errors) => {
  if (typeof errors === 'string') {
    showToast.error(errors);
    return;
  }

  if (Array.isArray(errors)) {
    errors.forEach(error => showToast.error(error));
    return;
  }

  if (typeof errors === 'object') {
    Object.values(errors).forEach(error => {
      if (error) showToast.error(error);
    });
    return;
  }

  showToast.error('Validation failed');
};

export default showToast; 