import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import './navbar.css';

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleScrollToSection = (className) => {
    if (location.pathname === '/') {
      document.querySelector(className)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.querySelector(className)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">🌍 <strong>Climate Educator</strong></span>
      </div>
      <div className="navbar-right">
        <button className="nav-btn filled" onClick={() => handleScrollToSection('.hero-section')}>Home</button>
        <button className="nav-btn filled" onClick={() => handleScrollToSection('.weather-section')}>Weather</button>
        <Link to="/contact" className="nav-link"><button className="nav-btn filled">Contact</button></Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link"><button className="nav-btn outline">Sign In</button></Link>
            <Link to="/signup" className="nav-link"><button className="nav-btn filled">Sign Up</button></Link>
          </>
        ) : (
          <button className="nav-btn outline" onClick={handleLogout}>Sign Out</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
