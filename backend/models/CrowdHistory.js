import mongoose from 'mongoose';

const crowdHistorySchema = new mongoose.Schema({
  entityId: { type: String, required: true }, // stationName, trainNumber, or busNumber
  entityType: { type: String, enum: ['station', 'train', 'bus'], required: true },
  occupancy: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('CrowdHistory', crowdHistorySchema);
