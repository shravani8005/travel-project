import React, { useState } from 'react';
import axios from '../axiosInstance';

const CreateTrip = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/trips', { name, description, price }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Trip created successfully!');
            setName('');
            setDescription('');
            setPrice('');
        } catch (error) {
            alert(error?.response?.data?.message || 'Error creating trip');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Create New Trip</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Trip Name</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Create Trip</button>
            </form>
        </div>
    );
};

export default CreateTrip;
