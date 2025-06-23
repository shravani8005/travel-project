const Trip = require('../models/Trip');
const User = require('../models/User');

// GET user ID by email
exports.getUserIdByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user ID', error: err.message });
  }
};

// GET all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();

    // Populate usernames for reviews
    const userIds = trips.flatMap(trip => (trip.reviews || []).map(r => r.user));
    const users = await User.find({ _id: { $in: userIds } }).select('username').lean();
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u.username;
    });

    // Calculate average rating and populate reviews with usernames
    const tripsWithRatings = trips.map(trip => {
      let avgRating = 0;
      if (trip.reviews && trip.reviews.length > 0) {
        const total = trip.reviews.reduce((acc, review) => acc + review.rating, 0);
        avgRating = total / trip.reviews.length;
      }
      const populatedReviews = (trip.reviews || []).map(review => ({
        ...review._doc,
        user: userMap[review.user.toString()] || 'Unknown User'
      }));
      return Object.assign({}, trip._doc, {
        ratings: avgRating,
        reviews: populatedReviews,
        available: trip.available !== undefined ? trip.available : true
      });
    });
    res.status(200).json(tripsWithRatings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

// GET bookings for logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find trips where bookings array contains userId
    const trips = await Trip.find({ bookings: userId });

    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
  }
};

const mongoose = require('mongoose');

// GET all bookings for admin with user info
exports.getAllBookings = async (req, res) => {
  try {
    console.log('Request user object:', req.user);
    const userIdQuery = req.query.userId;
    console.log('User ID query param:', userIdQuery);

    let filter = {};
    if (userIdQuery) {
      const userObjectId = mongoose.Types.ObjectId(userIdQuery);
      filter = { bookings: userObjectId };
    }

    // Find trips where bookings array contains userObjectId if provided, else all trips
    const trips = await Trip.find(filter);
    console.log('Trips fetched in getAllBookings:', trips);

    // Collect all userIds from bookings
    const userIds = trips.flatMap(trip => trip.bookings);
    const users = await User.find({ _id: { $in: userIds } }).select('username email').lean();
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = { username: u.username, email: u.email };
    });

    // Map trips bookings to include user info and trip details, filter bookings by userIdQuery if provided
    const tripsWithBookingDetails = trips.map(trip => {
      const bookingsWithUserInfo = (trip.bookings || [])
        .filter(userId => !userIdQuery || userId.toString() === userIdQuery.toString())
        .map(userId => ({
          userId,
          userInfo: userMap[userId.toString()] || { username: 'Unknown User', email: '' },
          tripDetails: {
            destination: trip.destination,
            description: trip.description,
            price: trip.price,
            date: trip.date,
            numberOfDays: trip.numberOfDays,
            numberOfPeople: trip.numberOfPeople,
            hotel: trip.hotel,
            imageUrl: trip.imageUrl
          }
        }));
      return {
        _id: trip._id,
        bookings: bookingsWithUserInfo
      };
    });

    res.status(200).json(tripsWithBookingDetails);
  } catch (err) {
    console.error('Error in getAllBookings:', err);
    res.status(500).json({ message: 'Failed to fetch all bookings', error: err.message });
  }
};

// POST create a new trip
exports.createTrip = async (req, res) => {
  try {
    // Parse date string to Date object if needed
    if (req.body.date && typeof req.body.date === 'string') {
      req.body.date = new Date(req.body.date);
    }
    // Initialize ratings and reviews if not provided
    if (!req.body.ratings) {
      req.body.ratings = 0;
    }
    if (!req.body.reviews) {
      req.body.reviews = [];
    }
    const newTrip = new Trip(req.body);
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(400).json({ message: 'Failed to create trip', error: err.message || err });
  }
};

// DELETE a trip by ID
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete trip', error: err.message });
  }
};

// PUT update a trip by ID
exports.updateTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    // If reviews are updated, recalculate average rating
    if (req.body.reviews) {
      const reviews = req.body.reviews;
      let avgRating = 0;
      if (reviews.length > 0) {
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        avgRating = total / reviews.length;
      }
      req.body.ratings = avgRating;
    }
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, req.body, { new: true });
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update trip', error: err.message });
  }
};

// New function to update trip availability
exports.updateAvailability = async (req, res) => {
  try {
    const tripId = req.params.id;
    const { available } = req.body;

    if (available === undefined) {
      return res.status(400).json({ message: 'Availability status is required' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { available },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error('Failed to update trip availability:', err);
    res.status(500).json({ message: 'Failed to update trip availability', error: err.message });
  }
};

// Only USER can book a trip
exports.bookTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.available === false) {
      return res.status(400).json({ message: 'Trip is currently unavailable for booking' });
    }

    // Assuming Trip model has a bookings array to store user bookings
    if (!trip.bookings) {
      trip.bookings = [];
    }
    trip.bookings.push(userId);
    await trip.save();

    res.status(200).json({ message: 'Trip booked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to book trip', error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user && req.user.id;
    console.log('addReview called with userId:', userId);
    console.log('Request user:', req.user);
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Add new review
    trip.reviews.push({
      user: userId,
      rating,
      comment
    });

    // Recalculate average rating
    const totalRating = trip.reviews.reduce((acc, review) => acc + review.rating, 0);
    trip.ratings = totalRating / trip.reviews.length;

    await trip.save();

    // Populate user details in reviews efficiently
    const userIds = trip.reviews.map(r => r.user);
    const users = await User.find({ _id: { $in: userIds } }).select('username').lean();
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u.username;
    });

    const populatedTrip = trip.toObject();
    populatedTrip.reviews = populatedTrip.reviews.map(review => ({
      ...review,
      user: userMap[review.user.toString()] || 'Unknown User'
    }));

    res.status(200).json(populatedTrip);
  } catch (err) {
    console.error('Error in addReview:', err);
    console.error(err.stack);
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

// Update days and people for a trip by USER
exports.updateTripDetails = async (req, res) => {
  try {
    const tripId = req.params.id;
    const { numberOfDays, numberOfPeople } = req.body;

    if (numberOfDays === undefined || numberOfPeople === undefined) {
      return res.status(400).json({ message: 'numberOfDays and numberOfPeople are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.numberOfDays = numberOfDays;
    trip.numberOfPeople = numberOfPeople;

    await trip.save();

    res.status(200).json({ message: 'Trip details updated successfully', trip });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update trip details', error: err.message });
  }
};

// New controller method to handle image upload
exports.uploadTripImage = async (req, res) => {
  try {
    const tripId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;

    // Update trip with imageUrl
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { imageUrl: imageUrl },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Image uploaded successfully', trip: updatedTrip });
  } catch (error) {
    console.error('Error uploading trip image:', error);
    res.status(500).json({ message: 'Server error uploading image' });
  }
};
