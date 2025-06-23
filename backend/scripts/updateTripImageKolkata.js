const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-db';

const updateKolkataImage = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const kolkataImageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

    const result = await Trip.findOneAndUpdate(
      { description: /kolkata/i },
      { imageUrl: kolkataImageUrl },
      { new: true }
    );

    if (result) {
      console.log('Kolkata trip image updated successfully:', result);
    } else {
      console.log('Kolkata trip not found.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating Kolkata trip image:', error);
    process.exit(1);
  }
};

updateKolkataImage();
