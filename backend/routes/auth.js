// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

// Route to send OTP
// Endpoint: POST /api/auth/send-otp
router.post('/send-otp', authController.sendOTP);

// Route to verify OTP
// Endpoint: POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOTP);

// Route to set up account (after OTP)
router.post('/setup-account', authController.setupAccount);

// Route to login
router.post('/login', authController.login);

// Protected route to test admin access
// Example: You can remove this after testing
router.get('/admin-only', verifyToken, isAdmin, (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

// Protected route to test user access
router.get('/user-only', verifyToken, isUser, (req, res) => {
    res.json({ message: 'Welcome User!' });
});

module.exports = router;
