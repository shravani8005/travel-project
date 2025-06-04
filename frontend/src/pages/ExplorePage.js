import React, { useState, useEffect } from "react";
import axios from '../axiosInstance';
import { useNavigate } from "react-router-dom";
import "./ExplorePage.css";

const ExplorePage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTripReviews, setSelectedTripReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editableDetails, setEditableDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchTrips = async () => {
      try {
        const response = await axios.get('trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, [navigate]);

  const viewReviews = (reviews, tripId) => {
    setSelectedTripReviews(Array.isArray(reviews) ? reviews : []);
    setCurrentTripId(tripId);
    setShowReviews(true);
  };

  const openAddReview = (tripId) => {
    setCurrentTripId(tripId);
    setShowAddReview(true);
    setNewRating(0);
    setNewComment("");
  };

  const closeReviews = () => {
    setShowReviews(false);
    setSelectedTripReviews([]);
    setNewRating(0);
    setNewComment("");
    setCurrentTripId(null);
  };

  const closeAddReview = () => {
    setShowAddReview(false);
    setNewRating(0);
    setNewComment("");
    setCurrentTripId(null);
  };

  const handleAddReview = async () => {
    if (newRating <= 0 || newRating > 5 || newComment.trim() === "") {
      alert("Please provide a valid rating (1-5) and comment.");
      return;
    }
    try {
      await axios.post(`trips/review/${currentTripId}`, {
        rating: newRating,
        comment: newComment
      });
      const response = await axios.get('trips');
      const updatedTrip = response.data.find(trip => trip._id === currentTripId);
      setSelectedTripReviews(updatedTrip?.reviews || []);
      setNewRating(0);
      setNewComment("");
      setShowAddReview(false);
    } catch (error) {
      console.error("Failed to add review:", error);
      alert("Failed to add review. Please try again.");
    }
  };

  const handleSaveDetails = async (tripId) => {
    const details = editableDetails[tripId];
    if (!details || !details.numberOfDays || !details.numberOfPeople) {
      alert("Please enter valid Days and People values.");
      return;
    }
    try {
      await axios.put(`trips/update-details/${tripId}`, {
        numberOfDays: details.numberOfDays,
        numberOfPeople: details.numberOfPeople
      });
      alert("Trip details updated successfully.");
      setTrips(prevTrips => prevTrips.map(trip =>
        trip._id === tripId ? { ...trip, numberOfDays: details.numberOfDays, numberOfPeople: details.numberOfPeople } : trip
      ));
    } catch (error) {
      console.error("Failed to update trip details:", error);
      alert("Failed to update trip details. Please try again.");
    }
  };

  return (
    <div className="explore-container">
      <h1>Explore Popular Tours</h1>
      {trips.length === 0 && <p>No tours available.</p>}
      <div className="carousel-container">
        <div className="carousel">
          {trips.map(trip => (
            <div key={trip._id} className="trip-card">
              <h3>{trip.description}</h3>
              <img
                src={trip.imageUrl || '/default-trip.jpg'}
                alt={trip.description}
                className="trip-image"
              />
              <p>{trip.description}</p>
              <div className="trip-details-row">
                <label>
                  <strong>Days:</strong>
                  <input
                    type="number"
                    min="1"
                    value={editableDetails[trip._id]?.numberOfDays ?? trip.numberOfDays}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setEditableDetails(prev => ({
                        ...prev,
                        [trip._id]: {
                          ...prev[trip._id],
                          numberOfDays: isNaN(value) ? '' : value
                        }
                      }));
                    }}
                    style={{ width: '100px' }}
                  />
                </label>
                <label>
                  <strong>People:</strong>
                  <input
                    type="number"
                    min="1"
                    value={editableDetails[trip._id]?.numberOfPeople ?? trip.numberOfPeople}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setEditableDetails(prev => ({
                        ...prev,
                        [trip._id]: {
                          ...prev[trip._id],
                          numberOfPeople: isNaN(value) ? '' : value
                        }
                      }));
                    }}
                    style={{ width: '100px' }}
                  />
                </label>
              </div>
              <p><strong>Price:</strong> ₹{trip.price}</p>
              <p><strong>Rating:</strong> {(trip.ratings !== undefined && trip.ratings !== null) ? trip.ratings.toFixed(1) : 'N/A'} / 5</p>
              <p><strong>Availability:</strong> {trip.available ? 'Available' : 'Not Available'}</p>
              <button onClick={() => viewReviews(trip.reviews, trip._id)}>View Reviews</button>
              <button onClick={() => openAddReview(trip._id)}>Add Review</button>
              <button onClick={() => handleSaveDetails(trip._id)}>Save</button>
            </div>
          ))}
        </div>
      </div>

      {showReviews && (
        <div className="reviews-modal">
          <div className="reviews-content">
            <h3>Reviews</h3>
            <button className="close-btn" onClick={closeReviews}>Close</button>
            {selectedTripReviews.length === 0 ? (
              <p>No reviews available.</p>
            ) : (
              selectedTripReviews.map((review, index) => (
                <div key={index} className="review">
                  <p><strong>{review.user}</strong> rated {review.rating} / 5</p>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAddReview && (
        <div className="reviews-modal">
          <div className="reviews-content">
            <h3>Add a Review</h3>
            <button className="close-btn" onClick={closeAddReview}>Close</button>
            <div className="add-review-form">
              <label>
                Rating (1-5):
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                />
              </label>
              <label>
                Comment:
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </label>
              <button onClick={handleAddReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
