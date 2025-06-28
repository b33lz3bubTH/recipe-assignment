import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected routes - will be implemented later */}
            
            <Route 
              path="/add-recipe" 
              element={
                <ProtectedRoute>
                  <div className="container mt-5">
                    <h2>Add Recipe</h2>
                    <p>This page will allow you to add new recipes (coming soon)</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
