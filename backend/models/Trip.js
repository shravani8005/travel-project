const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  destination: String,
  description: String,
  price: Number,
  date: Date,
  numberOfDays: Number,
  numberOfPeople: Number,
  hotel: String,
  restaurants: {
    veg: [String],
    nonVeg: [String]
  },
  available: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String
    }
  ],
  imageUrl: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Trip', tripSchema);
