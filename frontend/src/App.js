import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import ToastDemo from './components/ToastDemo';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/toast-demo" element={<ToastDemo />} />
            
            <Route 
              path="/add-recipe" 
              element={
                <ProtectedRoute>
                  <AddRecipePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/edit-recipe/:id" 
              element={
                <ProtectedRoute>
                  <EditRecipePage />
                </ProtectedRoute>
              } 
            />
            
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
