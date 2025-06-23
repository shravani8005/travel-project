import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.role === 'admin');
      } catch (error) {
        console.error('Failed to parse token', error);
      }
    }
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Your Adventure Starts Here</h1>
          <p>Explore the world with Travel Companion</p>
          {!isAdmin && (
            <button className="btn-cta" onClick={() => navigate('/explore')}>Start Your Journey</button>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HomePage;
