import React, { useState, useEffect } from "react";
import axios from '../axiosInstance';
import { useNavigate } from "react-router-dom";
import "./ExplorePage.css";

const ExplorePage = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const response = await axios.get('/api/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, [navigate]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < fullStars; i++) stars.push(<span key={"full" + i} className="star full">&#9733;</span>);
    for (let i = 0; i < emptyStars; i++) stars.push(<span key={"empty" + i} className="star empty">&#9734;</span>);
    return stars;
  };

  const fixDestinationName = (desc) => {
    if (!desc) return "";
    let fixed = desc.toLowerCase();
    fixed = fixed.replace('jap tur', 'Japan Tour').replace('manail', 'Manali').replace('munibai', 'Mumbai');
    return fixed.charAt(0).toUpperCase() + fixed.slice(1);
  };

  return (
    <div className="explore-container hero" style={{ background: "linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat" }}>
      <h1>Explore Popular Tours</h1>
      {trips.length === 0 && <p>No tours available.</p>}
      <div className="card-grid">
        {trips.map(trip => (
          <div key={trip._id} className="trip-card">
            <img
              src={trip.imageUrl || (fixDestinationName(trip.description).toLowerCase() === 'trip to kolkata' ? '/travel.jpg' : 'https://via.placeholder.com/300x200?text=No+Image')}
              alt={trip.description}
              className="trip-image"
            />
            <h3>{fixDestinationName(trip.description)}</h3>
            <p>{trip.description}</p>
            <div className
