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

## Tech Stack

- React 19
- React Router DOM 7
- Zustand (State Management)
- Axios (HTTP Client)
- Bootstrap 5
- React JSON Schema Form (for future recipe forms)

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── LoginForm.js       # Login form component
│   ├── RegisterForm.js    # Registration form component
│   └── ProtectedRoute.js  # Route protection component
├── pages/
│   ├── HomePage.js        # Home page
│   ├── LoginPage.js       # Login page
│   └── RegisterPage.js    # Registration page
├── store/
│   └── authStore.js       # Authentication state management
├── utils/
│   └── api.js            # API configuration and interceptors
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

The frontend is configured to connect to the backend API at `http://localhost:5000/api`. Make sure your backend server is running on this port.

## Authentication Flow

1. **Registration**: Users can create new accounts with username, email, and password
2. **Login**: Users can authenticate with email and password
3. **Token Management**: JWT tokens are automatically stored in localStorage and included in API requests
4. **Token Refresh**: Access tokens are automatically refreshed when they expire
5. **Logout**: Users can logout, which clears all authentication data

## Protected Routes

The following routes require authentication:
- `/my-recipes` - User's recipe collection
- `/add-recipe` - Create new recipe form
- `/edit-recipe/:id` - Edit existing recipe form

Unauthenticated users are redirected to the login page when accessing protected routes.

## Future Features

- Recipe CRUD operations
- Recipe search and filtering
- User profile management
- Recipe sharing and social features
- Image upload for recipes

## Development Notes

- The application uses Bootstrap 5 classes for styling
- Form validation is handled both client-side and server-side
- Error messages are displayed to users for better UX
- Loading states provide visual feedback during API calls
- The navbar dynamically shows different options based on authentication status
