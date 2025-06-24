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
        const response = await axios.get('/trips');
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

  return (
    <div className="explore-container hero" style={{
      background: "linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat"
    }}>
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
            <div className="rating">{renderStars(trip.ratings || 0)}</div>
            <p><strong>Price:</strong> ₹{trip.price}</p>
            <label>
              Days:
              <input
                type="number"
                min="1"
                value={trip.customDays || trip.numberOfDays || ''}
                onChange={(e) => {
                  const newDays = parseInt(e.target.value, 10);
                  setTrips((prevTrips) =>
                    prevTrips.map((t) =>
                      t._id === trip._id ? { ...t, customDays: newDays } : t
                    )
                  );
                }}
                style={{ width: '50px', marginLeft: '5px' }}
              />
            </label>
            <label>
              People:
              <input
                type="number"
                min="1"
                value={trip.customPeople || trip.numberOfPeople || ''}
                onChange={(e) => {
                  const newPeople = parseInt(e.target.value, 10);
                  setTrips((prevTrips) =>
                    prevTrips.map((t) =>
                      t._id === trip._id ? { ...t, customPeople: newPeople } : t
                    )
                  );
                }}
                style={{ width: '50px', marginLeft: '5px' }}
              />
            </label>
            <p><strong>Availability:</strong> {trip.available ? 'Available' : 'Unavailable'}</p>
            {/* Book Trip button removed */}
            <button onClick={() => alert('View reviews feature coming soon!')} style={{ marginRight: '10px' }}>View Reviews</button>
            <button onClick={() => alert('Add review feature coming soon!')}>Add Review</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
