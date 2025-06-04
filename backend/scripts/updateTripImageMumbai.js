require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

async function updateMumbaiImage() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);

    const imageUrl = 'https://w0.peakpx.com/wallpaper/94/127/HD-wallpaper-gateway-of-india-mumbai.jpg';

    // Find the trip with description containing "mumbai" and update its imageUrl
    const updatedTrip = await Trip.findOneAndUpdate(
      { description: /mumbai/i },
      { imageUrl: imageUrl },
      { new: true }
    );

    if (updatedTrip) {
      console.log('Trip image updated successfully:', updatedTrip);
    } else {
      console.log('Trip to Mumbai not found.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating trip image:', error);
  }
}

updateMumbaiImage();
