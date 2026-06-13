import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true, unique: true },
  routeName: { type: String, required: true },
  type: { type: String, enum: ['bus', 'metro'], required: true },
  stops: [
    {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    }
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Route', routeSchema);
