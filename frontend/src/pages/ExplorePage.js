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
        setError(error.response?.data?.message || 'Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">½</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  const fixDestinationName = (desc) => {
    if (!desc) return "";
    const corrections = {
      'jap tur': 'Japan Tour',
      'manail': 'Manali',
      'munibai': 'Mumbai',
      'kolkta': 'Kolkata',
      'delhi': 'Delhi'
    };
    
    let fixed = desc.toLowerCase();
    Object.entries(corrections).forEach(([wrong, correct]) => {
      fixed = fixed.replace(wrong, correct);
    });
    
    return fixed.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <div className="explore-container loading">Loading trips...</div>;
  }

  if (error) {
    return <div className="explore-container error-message">{error}</div>;
  }

  return (
    <div className="explore-container hero">
      <h1>Explore Popular Tours</h1>
      <div className="card-grid">
        {trips.length === 0 ? (
          <div className="no-trips">No tours available at the moment.</div>
        ) : (
          trips.map(trip => (
            <div key={trip._id} className="trip-card">
              <img
                src={trip.imageUrl || getDefaultImage(trip.description)}
                alt={trip.description}
                className="trip-image"
                onError={(e) => {
                  e.target.src = getDefaultImage(trip.description);
                }}
              />
              <div className="trip-content">
                <h3>{fixDestinationName(trip.description)}</h3>
                <div className="trip-meta">
                  <div className="rating">{renderStars(trip.ratings || 0)}</div>
                  <div className="price">₹{trip.price.toLocaleString()}</div>
                </div>
                <div className="trip-details">
                  <p><span>Duration:</span> {trip.numberOfDays || 'N/A'} days</p>
                  <p><span>Group Size:</span> {trip.numberOfPeople || 'N/A'} people</p>
                  <p className={`availability ${trip.available ? 'available' : 'unavailable'}`}>
                    {trip.available ? 'Available' : 'Sold Out'}
                  </p>
                </div>
                <div className="trip-actions">
                  <button className="btn btn-primary">View Details</button>
                  <button className="btn btn-secondary">View Reviews</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper function for default images
const getDefaultImage = (description) => {
  const desc = description.toLowerCase();
  if (desc.includes('kolkata')) return '/images/kolkata.jpg';
  if (desc.includes('manali')) return '/images/manali.jpg';
  if (desc.includes('mumbai')) return '/images/mumbai.jpg';
  if (desc.includes('japan')) return '/images/japan.jpg';
  return '/images/default-trip.jpg';
};

export default ExplorePage;
