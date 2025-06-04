const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel-db';

const sampleTrips = [
  {
    destination: 'trip to manali',
    description: 'A beautiful trip to Manali.',
    price: 15000,
    date: new Date(),
    numberOfDays: 5,
    numberOfPeople: 10,
    hotel: 'Hotel Manali',
    restaurants: {
      veg: ['Veg Restaurant 1', 'Veg Restaurant 2'],
      nonVeg: ['NonVeg Restaurant 1']
    },
    reviews: [
      {
        user: 'Alice',
        rating: 5,
        comment: 'Amazing experience! Highly recommend.'
      },
      {
        user: 'Bob',
        rating: 4,
        comment: 'Great trip, well organized.'
      }
    ],
    ratings: 4.5
  },
  {
    destination: 'a trip to japiur',
    description: 'Explore the historic city of Jaipur.',
    price: 15000,
    date: new Date(),
    numberOfDays: 4,
    numberOfPeople: 8,
    hotel: 'Hotel Jaipur',
    restaurants: {
      veg: ['Veg Restaurant A'],
      nonVeg: ['NonVeg Restaurant A', 'NonVeg Restaurant B']
    },
    reviews: [
      {
        user: 'Charlie',
        rating: 3,
        comment: 'It was okay, could be better.'
      }
    ],
    ratings: 3
  }
];

async function addSampleTrips() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    for (const tripData of sampleTrips) {
      // Check if trip already exists by destination
      let trip = await Trip.findOne({ destination: tripData.destination });
      if (trip) {
        // Update existing trip
        Object.assign(trip, tripData);
        await trip.save();
        console.log(`Updated trip: ${trip.destination}`);
      } else {
        // Create new trip
        trip = new Trip(tripData);
        await trip.save();
        console.log(`Added new trip: ${trip.destination}`);
      }
    }

    console.log('Sample trips added/updated successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding sample trips:', error);
  }
}

addSampleTrips();
