import React, { useState, useEffect } from "react";
import axios from '../axiosInstance';
import { useNavigate } from "react-router-dom";
import "./ExplorePage.css";

const ExplorePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={"full" + i} className="star full">&#9733;</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={"empty" + i} className="star empty">&#9734;</span>);
    }
    return stars;
  };

  const fixDestinationName = (desc) => {
    if (!desc) return "";
    let fixed = desc.toLowerCase();
    fixed = fixed.replace('jap tur', 'Japan Tour');
    fixed = fixed.replace('manail', 'Manali');
    fixed = fixed.replace('munibai', 'Mumbai');
    return fixed.charAt(0).toUpperCase() + fixed.slice(1);
  };

  if (loading) {
    return <div className="explore-container">Loading trips...</div>;
  }

  if (error) {
    return <div className="explore-container">{error}</div>;
  }

  return (
    <div className="explore-container hero" style={{
      background: "linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat"
    }}>
      <h1>Explore Popular Tours</h1>
      <div className="card-grid">
        {trips.length === 0 ? (
          <p>No tours available at the moment.</p>
        ) : (
          trips.map(trip => (
            <div key={trip._id} className="trip-card">
              <img
                src={trip.imageUrl || (fixDestinationName(trip.description).toLowerCase() === 'trip to kolkata' ? '/travel.jpg' : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={trip.description}
                className="trip-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <h3>{fixDestinationName(trip.description)}</h3>
              <div className="trip-details">
                <div className="rating">{renderStars(trip.ratings || 0)}</div>
                <p><strong>Price:</strong> ₹{trip.price}</p>
                <p><strong>Duration:</strong> {trip.numberOfDays || 'N/A'} days</p>
                <p><strong>Capacity:</strong> {trip.numberOfPeople || 'N/A'} people</p>
                <p className={trip.available ? 'available' : 'unavailable'}>
                  {trip.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
              <div className="trip-actions">
                <button 
                  className="review-btn"
                  onClick={() => alert('View reviews feature coming soon!')}
                >
                  View Reviews
                </button>
                <button 
                  className="review-btn"
                  onClick={() => alert('Add review feature coming soon!')}
                >
                  Add Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
