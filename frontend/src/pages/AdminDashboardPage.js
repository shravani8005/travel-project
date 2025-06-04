import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateTrip from '../components/CreateTrip';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/trips', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTrips(res.data));
  }, [token]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/trips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setTrips(trips.filter(trip => trip._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      <CreateTrip />
      <div className="mt-4">
        {trips.length === 0 && <p>No trips available.</p>}
        {trips.map(trip => (
          <div key={trip._id} className="card mb-3 p-3">
            <h3>{trip.name}</h3>
            <p>{trip.description}</p>
            <p><strong>Price:</strong> ${trip.price}</p>
            <p>
              <strong>Available:</strong>{' '}
              <input
                type="checkbox"
                checked={trip.available}
                onChange={async (e) => {
                  const newAvailable = e.target.checked;
                  try {
                    await axios.put(`/api/trips/${trip._id}/availability`, { available: newAvailable }, { headers: { Authorization: `Bearer ${token}` } });
                    setTrips(trips.map(t => t._id === trip._id ? { ...t, available: newAvailable } : t));
                  } catch (error) {
                    alert('Failed to update availability');
                  }
                }}
              />
            </p>
            <button className="btn btn-danger" onClick={() => handleDelete(trip._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
