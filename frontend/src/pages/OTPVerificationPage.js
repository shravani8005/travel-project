import React, { useState } from 'react';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/verify-otp', { email, otp });
            alert('OTP verified successfully. Please set up your account.');
            navigate('/setup-account', { state: { email } });
        } catch (error) {
            alert(error?.response?.data?.message || 'Invalid or expired OTP');
        }
    };

    return (
        <div className="container mt-5">
            <h2>OTP Verification</h2>
            <form onSubmit={handleVerify} className="card p-4 shadow">
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
                <div className="mb-3">
                    <label htmlFor="otp" className="form-label">OTP</label>
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
        </div>
    );
};

export default OTPVerificationPage;
