import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
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
              <div className="user-menu">
                <button className="user-button">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user?.username}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className="dropdown-menu">
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

      <style jsx>{`
        .floating-navbar {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 95%;
          max-width: 1200px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 0.8rem 1.5rem;
        }

        .floating-navbar.scrolled {
          top: 10px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #2d3748;
          font-weight: 700;
          font-size: 1.25rem;
          transition: transform 0.2s ease;
        }

        .nav-brand:hover {
          transform: scale(1.05);
          color: #4a5568;
        }

        .brand-icon {
          font-size: 1.5rem;
        }

        .brand-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: #4a5568;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.2s ease;
          background: rgba(102, 126, 234, 0.1);
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          transform: translateY(-2px);
        }

        .link-icon {
          font-size: 0.9rem;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .auth-link {
          padding: 0.6rem 1.2rem;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .auth-link.login {
          color: #4a5568;
          background: rgba(102, 126, 234, 0.1);
        }

        .auth-link.login:hover {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          transform: translateY(-2px);
        }

        .auth-link.register {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .auth-link.register:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: rgba(102, 126, 234, 0.1);
          border: none;
          border-radius: 12px;
          color: #4a5568;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-button:hover {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          transform: translateY(-2px);
        }

        .user-avatar {
          font-size: 1.1rem;
        }

        .user-name {
          font-weight: 600;
        }

        .dropdown-arrow {
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }

        .user-menu:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          min-width: 150px;
        }

        .user-menu:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem 1rem;
          border: none;
          background: none;
          color: #4a5568;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          border-radius: 8px;
          margin: 0.2rem;
        }

        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .item-icon {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .floating-navbar {
            width: 90%;
            padding: 0.6rem 1rem;
          }

          .nav-menu {
            gap: 1rem;
          }

          .brand-text {
            display: none;
          }

          .nav-links {
            display: none;
          }

          .auth-link {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 