import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`floating-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link className="nav-brand" to="/">
          <span className="brand-icon">🍳</span>
          <span className="brand-text">Recipe App</span>
        </Link>
        
        <div className="nav-menu">
          <div className="nav-links">
            {isAuthenticated && (
              <Link className="nav-link" to="/add-recipe">
                <span className="link-icon">➕</span>
                Add Recipe
              </Link>
            )}
          </div>
          
          <div className="nav-auth">
            {isAuthenticated ? (
              <div className="user-menu" ref={dropdownRef}>
                <button className="user-button" onClick={toggleDropdown}>
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user?.username}</span>
                  <span className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}>▼</span>
                </button>
                <div className={`dropdown-menu ${isDropdownOpen ? 'open d-block' : 'd-none'}`}>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <span className="item-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link className="auth-link login" to="/login">
                  Login
                </Link>
                <Link className="auth-link register" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 