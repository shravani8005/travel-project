import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const sendOTP = (email) => api.post('/auth/send-otp', { email });
export const verifyOTP = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const setupAccount = (data) => api.post('/auth/setup-account', data);
export const login = (data) => api.post('/auth/login', data);
