require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

async function updateDelhiImage() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);

    const imageUrl = 'https://c4.wallpaperflare.com/wallpaper/961/859/615/newdelhi-redfort-landmark-sky-wallpaper-preview.jpg';

    // Find the trip with description containing "delhi" and update its imageUrl
    const updatedTrip = await Trip.findOneAndUpdate(
      { description: /delhi/i },
      { imageUrl: imageUrl },
      { new: true }
    );

    if (updatedTrip) {
      console.log('Trip image updated successfully:', updatedTrip);
    } else {
      console.log('Trip to Delhi not found.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating trip image:', error);
  }
}

updateDelhiImage();
