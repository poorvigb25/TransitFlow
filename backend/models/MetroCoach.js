import mongoose from 'mongoose';

const metroCoachSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true },
  coachNumber: { type: Number, required: true }, // 1 to 6
  occupancy: { type: Number, default: 0 },
  crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  updatedAt: { type: Date, default: Date.now },
});

// Compound unique key
metroCoachSchema.index({ trainNumber: 1, coachNumber: 1 }, { unique: true });

export default mongoose.model('MetroCoach', metroCoachSchema);
