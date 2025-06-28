# Recipe App Frontend

A React-based frontend for the Recipe App with authentication and recipe management features.

## Features

- **Authentication System**
  - User registration and login
  - JWT token management with localStorage persistence
  - Protected routes for authenticated users
  - Automatic token refresh

- **State Management**
  - Zustand for global state management
  - Persistent authentication state

- **UI/UX**
  - Bootstrap 5 for responsive design
  - Clean and modern interface
  - Form validation with error handling
  - Loading states and user feedback
  - **Toast Notifications** - Beautiful, responsive toast messages for user feedback

## Tech Stack

- React 19
- React Router DOM 7
- Zustand (State Management)
- Axios (HTTP Client)
- Bootstrap 5
- React Toastify (Toast Notifications)
- React JSON Schema Form (for future recipe forms)

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── LoginForm.js       # Login form component
│   ├── RegisterForm.js    # Registration form component
│   ├── ProtectedRoute.js  # Route protection component
│   └── ToastDemo.js       # Toast notification demo
├── pages/
│   ├── HomePage.js        # Home page
│   ├── LoginPage.js       # Login page
│   └── RegisterPage.js    # Registration page
├── store/
│   └── authStore.js       # Authentication state management
├── utils/
│   ├── api.js            # API configuration and interceptors
│   └── toast.js          # Toast notification utilities
└── App.js                # Main application component
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:3000/api`. Make sure your backend server is running on this port.

## Authentication Flow

1. **Registration**: Users can create new accounts with username, email, and password
2. **Login**: Users can authenticate with email and password
3. **Token Management**: JWT tokens are automatically stored in localStorage and included in API requests
4. **Token Refresh**: Access tokens are automatically refreshed when they expire
5. **Logout**: Users can logout, which clears all authentication data

## Toast Notifications

The application uses React Toastify for beautiful, responsive toast notifications:

### Types of Toasts
- **Success**: Green toast for successful operations
- **Error**: Red toast for errors and failures
- **Warning**: Yellow toast for warnings
- **Info**: Blue toast for informational messages
- **Loading**: Loading toast with progress indicator

### Usage Examples
```javascript
import { showToast, showApiError, showValidationError } from '../utils/toast';

// Success message
showToast.success('Operation completed successfully!');

// Error message
showToast.error('Something went wrong!');

// API error handling
showApiError(error);

// Validation errors
showValidationError({ email: 'Email is required', password: 'Password is too short' });
```

### Toast Demo
Visit `/toast-demo` to see all types of toast notifications in action.

## Protected Routes

The following routes require authentication:
- `/my-recipes` - User's recipe collection
- `/add-recipe` - Create new recipe form
- `/edit-recipe/:id` - Edit existing recipe form

Unauthenticated users are redirected to the login page when accessing protected routes.

## Error Handling

- **Form Validation**: Client-side validation with immediate feedback via toast notifications
- **API Errors**: Automatic error handling with user-friendly messages
- **Network Errors**: Graceful handling of network issues
- **Authentication Errors**: Automatic token refresh and logout on session expiry

## Future Features

- Recipe CRUD operations
- Recipe search and filtering
- User profile management
- Recipe sharing and social features
- Image upload for recipes

## Development Notes

- The application uses Bootstrap 5 classes for styling
- Form validation is handled both client-side and server-side
- Toast notifications provide immediate user feedback
- Loading states provide visual feedback during API calls
- The navbar dynamically shows different options based on authentication status
- All error messages are displayed as toast notifications for better UX
