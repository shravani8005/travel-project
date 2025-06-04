import React, { useState } from 'react';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const sendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/send-otp', { email });
            setOtpSent(true);
            alert('OTP sent to your email');
        } catch (error) {
            alert(error?.response?.data?.message || 'Error sending OTP');
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/verify-otp', { email, otp });
            setIsVerified(true);
            alert('OTP verified successfully');
        } catch (error) {
            alert(error?.response?.data?.message || 'Invalid or expired OTP');
        }
    };

    const setupAccount = async (e) => {
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
            <h2 className="text-center mb-4">Signup</h2>
            {!otpSent && (
                <form onSubmit={sendOtp} className="card p-4 shadow">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Send OTP</button>
                </form>
            )}
            {otpSent && !isVerified && (
                <form onSubmit={verifyOtp} className="card p-4 shadow">
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label">Enter OTP</label>
                        <input
                            type="text"
                            id="otp"
                            className="form-control"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Verify OTP</button>
                </form>
            )}
            {isVerified && (
                <form onSubmit={setupAccount} className="card p-4 shadow">
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
            )}
        </div>
    );
};

export default SignupPage;
