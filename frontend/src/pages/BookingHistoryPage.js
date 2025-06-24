import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import './BookingHistoryPage.css';

const capitalizeTitle = (title) => {
  if (!title) return '';
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/trips/bookings/user');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="loading">Loading booking history...</div>;
  if (bookings.length === 0) return <div className="no-bookings">No bookings found.</div>;

  return (
    <div className="booking-history-container hero" style={{ background: "linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat" }}>
      <h2>Your Booking History</h2>
      <div className="booking-cards" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {bookings.map((trip) => (
          <div key={trip._id} className="booking-card">
            <img src={trip.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'} alt={trip.description || 'Trip Image'} className="booking-image" />
            <div className="booking-info">
              <h3>{capitalizeTitle(trip.description)}</h3>
              <p><strong>Price:</strong> ₹{trip.price || 'N/A'}</p>
              <p><strong>Number of People:</strong> {trip.numberOfPeople || 'N/A'}</p>
              <p><strong>Number of Days:</strong> {trip.numberOfDays || 'N/A'}</p>
              <p><strong>Status:</strong> {trip.available ? 'Active' : 'Cancelled'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
