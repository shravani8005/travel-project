require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

async function updateBengaluruImage() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);

    const imageUrl = 'https://images.unsplash.com/photo-1697130383976-38f28c444292?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // Find the trip with description containing "bengaluru" and update its imageUrl
    const updatedTrip = await Trip.findOneAndUpdate(
      { description: /bengaluru/i },
      { imageUrl: imageUrl },
      { new: true }
    );

    if (updatedTrip) {
      console.log('Trip image updated successfully:', updatedTrip);
    } else {
      console.log('Trip to Bengaluru not found.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating trip image:', error);
  }
}

updateBengaluruImage();
