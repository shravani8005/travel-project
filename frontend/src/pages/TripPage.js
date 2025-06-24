import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import './TripPage.css';

const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTripReviews, setSelectedTripReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('/api/trips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, [token]);

  const bookTrip = async (id) => {
    const trip = trips.find(t => t._id === id);
    if (trip && trip.available === false) {
      alert('Trip is currently unavailable.');
      return;
    }
    try {
      await axios.post(`/api/trips/book/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Trip booked successfully!');
    } catch (error) {
      alert(error?.response?.data?.message || 'Error booking trip');
    }
  };

  const viewReviews = (reviews) => {
    setSelectedTripReviews(Array.isArray(reviews) ? reviews : []);
    setShowReviews(true);
  };

  const closeReviews = () => {
    setShowReviews(false);
    setSelectedTripReviews([]);
  };

  return (
    <div className="trippage-container hero" style={{ background: "linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat" }}>
      <section className="explore-section">
        <h2 className="subheading">Explore Popular Tours</h2>
        <hr className="divider" />
        {trips.length === 0 && <p>No tours available.</p>}
        <div className="carousel-container">
          <div className="carousel">
            {trips.map(trip => (
              <div key={trip._id} className="trip-card">
                <h3>{trip.destination?.charAt(0).toUpperCase() + trip.destination?.slice(1)}</h3>
                <img
                  src={trip.description?.toLowerCase().includes('kolkata') ?
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Victoria_Memorial_Hall%2C_Kolkata.jpg/1200px-Victoria_Memorial_Hall%2C_Kolkata.jpg?20210609103154'
                    : (trip.imageUrl || '/default-trip.jpg')}
                  alt={trip.description}
                  className="trip-image"
                />
                <ul className="trip-details">
                  <li><strong>Price:</strong> ₹{trip.price}</li>
                  <li><strong>Days:</strong> {trip.numberOfDays}</li>
                  <li><strong>People:</strong> {trip.numberOfPeople}</li>
                  <li><strong>Availability:</strong> {trip.available ? 'Available' : 'Unavailable'}</li>
                </ul>
                <button onClick={() => bookTrip(trip._id)}>Book Trip</button>
                <button onClick={() => viewReviews(trip.reviews)}>View Reviews</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showReviews && (
        <div className="reviews-modal">
          <div className="reviews-content">
            <h3>Reviews</h3>
            <button className="close-btn" onClick={closeReviews}>Close</button>
            {selectedTripReviews.length === 0 ? (
              <p>No reviews available.</p>
            ) : (
              selectedTripReviews.map((review, index) => (
                <div key={index} className="review">
                  <p><strong>{review.user}</strong> rated {review.rating} / 5</p>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPage;
