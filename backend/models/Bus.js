import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  occupancy: { type: Number, default: 0 },
  crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  speed: { type: Number, default: 40 }, // km/h
  eta: { type: String, default: '8 mins' },
  currentStop: { type: String, required: true },
  nextStop: { type: String, required: true },
  status: { type: String, enum: ['On Time', 'Delayed', 'Heavy Traffic'], default: 'On Time' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bus', busSchema);
