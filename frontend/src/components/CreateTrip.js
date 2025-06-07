import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';

const CreateTrip = ({ trip, onUpdate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (trip) {
            setName(trip.name || '');
            setDescription(trip.description || '');
            setPrice(trip.price || '');
        }
    }, [trip]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (trip) {
                // Update existing trip
                await axios.put(`/trips/${trip._id}`, { name, description, price }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Trip updated successfully!');
                if (onUpdate) onUpdate();
            } else {
                // Create new trip
                await axios.post('/trips', { name, description, price }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Trip created successfully!');
                setName('');
                setDescription('');
                setPrice('');
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            alert(error?.response?.data?.message || (trip ? 'Error updating trip' : 'Error creating trip'));
        }
    };

    return (
        <div className="container mt-4" style={{ color: 'white', backgroundColor: 'black', padding: '20px', borderRadius: '5px' }}>
            <h3>{trip ? 'Edit Trip' : 'Create New Trip'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label" style={{ color: 'white' }}>Trip Name</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid white' }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label" style={{ color: 'white' }}>Description</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid white' }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label" style={{ color: 'white' }}>Price</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid white' }}
                    />
                </div>
                <button type="submit" className={`btn ${trip ? 'btn-primary' : 'btn-success'}`}>
                    {trip ? 'Update Trip' : 'Create Trip'}
                </button>
            </form>
        </div>
    );
};

export default CreateTrip;
