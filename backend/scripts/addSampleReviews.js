const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel-db';

const sampleReviews = [
  {
    user: 'Alice',
    rating: 5,
    comment: 'Amazing experience! Highly recommend.'
  },
  {
    user: 'Bob',
    rating: 4,
    comment: 'Great trip, well organized.'
  },
  {
    user: 'Charlie',
    rating: 3,
    comment: 'It was okay, could be better.'
  }
];

async function addReviewsToTrips() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const trips = await Trip.find();
    for (const trip of trips) {
      trip.reviews = sampleReviews;
      // Calculate average rating
      const totalRating = sampleReviews.reduce((acc, review) => acc + review.rating, 0);
      trip.ratings = totalRating / sampleReviews.length;
      await trip.save();
      console.log(`Added reviews to trip: ${trip._id}`);
    }

    console.log('Sample reviews added to all trips.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding reviews:', error);
  }
}

addReviewsToTrips();
