import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateTrip from '../components/CreateTrip';
// Removed unused import of useNavigate
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const token = localStorage.getItem('token');
  // Removed unused navigate variable

  const fetchTrips = () => {
    axios.get('/api/trips', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTrips(res.data));
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/trips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setTrips(trips.filter(trip => trip._id !== id));
  };

  // Removed unused handleLogout function as logout is handled in Navbar

  const handleUpdate = () => {
    fetchTrips();
    setEditingTrip(null);
  };

  return (
    <div className="admin-dashboard-container mt-4" style={{ backgroundImage: `url('/travel.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Admin Dashboard</h2>
        {/* Removed Logout button here as it is present in Navbar */}
      </div>
      <CreateTrip trip={editingTrip} onUpdate={handleUpdate} />
      <div className="container mt-4" style={{ color: 'white' }}>
        {trips.length === 0 && <p>No trips available.</p>}
        {trips.map(trip => (
          <div key={trip._id} className="card mb-3 p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
            <h3>{trip.name}</h3>
            <p>{trip.description}</p>
            <p><strong>Price:</strong> ₹{trip.price}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <strong>Available:</strong>
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
            <button className="btn btn-primary me-2" onClick={() => setEditingTrip(trip)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(trip._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
