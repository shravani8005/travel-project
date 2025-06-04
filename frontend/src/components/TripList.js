<ul>
  {trips.map((trip) => (
    <li key={trip._id}>
      <h3>{trip.destination}</h3>
      <p>{trip.description}</p>
      <p>Price: ${trip.price}</p>
      <p>Number of People: {trip.numberOfPeople}</p>
      <p>Hotel: {trip.hotel}</p>
      <p>Veg Restaurants: {trip.restaurants?.veg?.join(', ')}</p>
      <p>Non-Veg Restaurants: {trip.restaurants?.nonVeg?.join(', ')}</p>

    </li>
  ))}
</ul>
