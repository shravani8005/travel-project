// backend/routes/trips.js

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { verifyToken, isAdmin, isUser, isUserOrAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Only ADMIN can create a new trip
router.post('/', verifyToken, isAdmin, tripController.createTrip);

// Both admin and users can view trips
router.get('/', tripController.getAllTrips);

// Only ADMIN can delete a trip
router.delete('/:id', verifyToken, isAdmin, tripController.deleteTrip);

// Only ADMIN can update a trip
router.put('/:id', verifyToken, isAdmin, tripController.updateTrip);

// New route: Only ADMIN can update trip availability
router.put('/:id/availability', verifyToken, isAdmin, tripController.updateAvailability);

// Only USER can book a trip
router.post('/book/:id', verifyToken, isUser, tripController.bookTrip);

// New route: Get bookings for logged-in user
router.get('/bookings/user', verifyToken, isUser, tripController.getUserBookings);

// New route: Get all bookings for admin
router.get('/bookings/admin', verifyToken, isAdmin, tripController.getAllBookings);

// Add review to a trip
router.post('/review/:id', verifyToken, isUser, tripController.addReview);

// Upload trip image
router.post('/upload-image/:id', verifyToken, isAdmin, upload.single('image'), tripController.uploadTripImage);

// Update days and people for a trip by USER
router.put('/update-details/:id', verifyToken, isUserOrAdmin, tripController.updateTripDetails);

// Add this line to export the router at the end if missing
module.exports = router;
