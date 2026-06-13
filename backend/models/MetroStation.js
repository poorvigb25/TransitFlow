import mongoose from 'mongoose';

const metroStationSchema = new mongoose.Schema({
  stationName: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  occupancy: { type: Number, default: 0 }, // percentage 0-100
  crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Normal', 'Delayed', 'Suspended'], default: 'Normal' },
  nextTrainArrival: { type: String, default: '5 mins' },
  lineColor: { type: String, required: true }, // e.g. 'Purple', 'Green'
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('MetroStation', metroStationSchema);
