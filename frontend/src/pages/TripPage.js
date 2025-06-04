import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import './TripPage.css';

const TripPage = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTripReviews, setSelectedTripReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get('/trips');
                setTrips(response.data);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };
        fetchTrips();
    }, []);

    const bookTrip = async (id) => {
        try {
            await axios.post(`/trips/book/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Trip booked successfully!');
        } catch (error) {
            alert(error?.response?.data?.message || 'Error booking trip');
        }
    };

    const viewReviews = (reviews) => {
        if (!reviews || !Array.isArray(reviews)) {
            setSelectedTripReviews([]);
        } else {
            setSelectedTripReviews(reviews);
        }
        setShowReviews(true);
    };

    const closeReviews = () => {
        setShowReviews(false);
        setSelectedTripReviews([]);
    };

    return (
        <div className="trippage-container">
            <h2>Popular Tours</h2>
            {trips.length === 0 && <p>No tours available.</p>}
            <div className="carousel-container">
                <div className="carousel">
                    {trips.map(trip => (
                        <div key={trip._id} className="trip-card">
                            <h3>{trip.destination}</h3>
                            <p>{trip.description}</p>
                            <p><strong>Days:</strong> {trip.numberOfDays}</p>
                            <p><strong>People:</strong> {trip.numberOfPeople}</p>
                            <p><strong>Price:</strong> ₹{trip.price}</p>
                                <p><strong>Rating:</strong> {(trip.ratings !== undefined && trip.ratings !== null) ? trip.ratings.toFixed(1) : 'N/A'} / 5</p>
                            <button onClick={() => bookTrip(trip._id)}>Book Trip</button>
                            <button onClick={() => viewReviews(trip.reviews)}>View Reviews</button>
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
        </div>
    );
};

export default TripPage;
