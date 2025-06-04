import React, { useState } from 'react';
import axios from '../axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/verify-otp', { email, otp });
            navigate('/setup-account', { state: { email } });
        } catch (err) {
            console.log(err.response.data);
        }
    };

    return (
        <div>
            <h2>Enter OTP</h2>
            <form onSubmit={handleVerify}>
                <input 
                    type="text" 
                    placeholder="OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                />
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
};

export default OTPVerificationPage;
