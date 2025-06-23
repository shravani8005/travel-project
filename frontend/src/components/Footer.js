import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Travel Companion. All rights reserved.</p>
        <div className="footer-links">
          {/* <a href="/about">About</a> */}
          {/* <a href="/explore">Explore</a> */}
          {/* <a href="/contact">Contact</a> */}
          {/* <a href="/privacy">Privacy Policy</a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
