import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Create this file for custom styles
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      console.log('Navbar useEffect - token:', token, 'role:', storedRole);
      if (token && storedRole) {
        setIsLoggedIn(true);
        setRole(storedRole);
      } else {
        setIsLoggedIn(false);
        setRole(null);
      }
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Removed the nav-logo div to hide "TravelSite" text */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {role !== 'admin' && <li><Link to="/about">About</Link></li>}
        <li><Link to="/explore">Explore</Link></li>
        {!isLoggedIn && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
        {isLoggedIn && (
          <>
            {role === 'admin' && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
            {role === 'user' && <li><Link to="/trips">Booking</Link></li>}
            <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
