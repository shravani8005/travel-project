import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token, role } = response.data;

            // Save token and role to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Dispatch custom event to notify login
            window.dispatchEvent(new Event('login'));

            alert('Login successful!');

            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin-dashboard'); // Customize this route if needed
            } else {
                navigate('/'); // Redirect to Home page instead of trips
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error?.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleLogin} className="card p-4 shadow">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
