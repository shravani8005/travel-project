import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">Travel Companion</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {/* {role !== 'admin' && <li><Link to="/about">About</Link></li>} */}
        <li><Link to="/explore">Explore</Link></li>
        {!isLoggedIn && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
        {isLoggedIn && (
          <>
            {(role === 'user' || role === 'admin') && (
              <li className="user-menu" ref={dropdownRef}>
                <button className="profile-button" onClick={toggleDropdown} aria-haspopup="true" aria-expanded={dropdownOpen}>
                  Profile &#x25BC;
                </button>
                {dropdownOpen && (
                  <ul className="dropdown" role="menu">
                    {role === 'admin' && <li role="menuitem"><Link to="/admin-dashboard" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link></li>}
                    <li role="menuitem"><Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link></li>
                    <li role="menuitem"><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                  </ul>
                )}
              </li>
            )}
            {role === 'user' && <li><Link to="/trips">Booking</Link></li>}
            {(role === 'user' || role === 'admin') && <li><Link to={role === 'admin' ? "/admin-booking-history" : "/booking-history"}>History</Link></li>}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
