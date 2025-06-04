require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

async function listTripDestinations() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);

    const trips = await Trip.find({}).lean();

    console.log('Trip destinations:');
    trips.forEach((trip, index) => {
      console.log(`${index + 1}. ${JSON.stringify(trip)}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error listing trip destinations:', error);
  }
}

listTripDestinations();
