require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

async function updateJaipurImage() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);

    const imageUrl = 'https://www.rajasthanbhumitours.com/blog/wp-content/uploads/2025/01/Pink-City-images.jpg';

    // Find the trip with description containing "jaipur" and update its imageUrl
    const updatedTrip = await Trip.findOneAndUpdate(
      { description: /japiur/i },
      { imageUrl: imageUrl },
      { new: true }
    );

    if (updatedTrip) {
      console.log('Trip image updated successfully:', updatedTrip);
    } else {
      console.log('Trip to Jaipur not found.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating trip image:', error);
  }
}

updateJaipurImage();
