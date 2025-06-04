import React, { useState } from 'react';
import axios from '../axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';

const SetupAccountPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSetup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/setup-account', { email, name, password });
            alert('Account setup successful. Please login.');
            navigate('/login');
        } catch (error) {
            alert(error?.response?.data?.message || 'Error setting up account');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Setup Account</h2>
            <form onSubmit={handleSetup} className="card p-4 shadow">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
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
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Setup Account</button>
            </form>
        </div>
    );
};

export default SetupAccountPage;
