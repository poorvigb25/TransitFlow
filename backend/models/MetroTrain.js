import mongoose from 'mongoose';

const metroTrainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  lineName: { type: String, required: true },
  lineColor: { type: String, required: true },
  currentStation: { type: String, required: true },
  direction: { type: String, required: true },
  occupancy: { type: Number, default: 0 },
  crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('MetroTrain', metroTrainSchema);
