import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OTPVerificationPage from './pages/OTPVerficationPage';
import SetupAccountPage from './pages/SetupAccountPage';
import TripPage from './pages/TripPage';
import Navbar from './components/Navbar'; // Import the Navbar
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import ExplorePage from './pages/ExplorePage';

const App = () => {
    return (
        <Router>
            <Navbar /> {/* Navbar shown on all pages */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-otp" element={<OTPVerificationPage />} />
                <Route path="/setup-account" element={<SetupAccountPage />} />
                <Route path="/trips" element={<TripPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    );
};

export default App;
