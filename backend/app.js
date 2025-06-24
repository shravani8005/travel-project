// backend/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);

const app = express();

// Middleware
app.use(cors({
  origin: 'https://my-mern-site.netlify.app', // your frontend domain
  credentials: true
}));
app.use(express.json());

// Serve uploads folder statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const tripRoutes = require('./routes/trips');
app.use('/api/trips', tripRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Backend is live!');
});
