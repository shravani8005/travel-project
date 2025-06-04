require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

async function updateManaliImage() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);

    const imageUrl = 'https://i.pinimg.com/736x/08/2d/7c/082d7ce0418240b6d92434c70eb4bc5a.jpg';

    // Find the trip with description "trip to manali" and update its imageUrl
    const updatedTrip = await Trip.findOneAndUpdate(
      { description: /manali/i },
      { imageUrl: imageUrl },
      { new: true }
    );

    if (updatedTrip) {
      console.log('Trip image updated successfully:', updatedTrip);
    } else {
      console.log('Trip to Manali not found.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating trip image:', error);
  }
}

updateManaliImage();
