import React, { useState } from "react";
import axios from '../axiosInstance';
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();

    const handleLogin = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('login', handleLogin);
    return () => {
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Travel Companion</h1>
      <p className="homepage-subtitle"> Explore the world!</p>
    </div>
  );
};

export default HomePage;
