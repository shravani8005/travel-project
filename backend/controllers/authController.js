// backend/controllers/authController.js

const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ADMIN CONFIG
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com"; // Update this to your desired admin email
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ideally from .env

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('Error with email transporter:', error);
    } else {
        console.log('Email transporter is ready');
    }
});

// Send OTP
exports.sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins expiry as requested

    try {
        // No restriction on email, accept any email
        let user = await User.findOne({ email });

        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        } else {
            user = new User({
                email,
                otp,
                otpExpiry,
                role: email === ADMIN_EMAIL ? 'admin' : 'user',
            });
        }

        await user.save();

        const mailOptions = {
            from: `"Travel Website" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to email" });

    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ message: "Error sending OTP", error: err.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpiry = null;
        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({ message: "Error verifying OTP", error: err.message });
    }
};

// Setup Account
exports.setupAccount = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.name = name;
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Account setup successfully" });
    } catch (err) {
        console.error("Error setting up account:", err);
        res.status(500).json({ message: "Error setting up account", error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Check if admin or user
        const role = email === ADMIN_EMAIL ? 'admin' : 'user';
        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "Login successful", token, role });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Error during login", error: err.message });
    }
};
