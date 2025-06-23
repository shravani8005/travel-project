import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminBookingHistoryPage.css';

const AdminBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/trips/bookings/admin', {
          headers: { Authorization: 'Bearer ' + token },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch admin bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return <div className="loading">Loading admin booking history...</div>;
  }

  if (bookings.length === 0) {
    return <div className="no-bookings">No bookings found.</div>;
  }

  return (
    <div className="admin-booking-history-container">
      <h2>All User Bookings</h2>
      <div className="booking-cards">
        {bookings.flatMap((trip) =>
          trip.bookings.map((booking, index) => (
            <div key={trip._id + '-' + index} className="booking-card">
              <p><strong>User:</strong> {booking.userInfo.email}</p>
              <p><strong>Trip:</strong> {booking.tripDetails?.destination || ''} {booking.tripDetails?.description ? `- ${booking.tripDetails.description}` : ''}</p>
              {/* Removed Status field as per request */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBookingHistoryPage;
