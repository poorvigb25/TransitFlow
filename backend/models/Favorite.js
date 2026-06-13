import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['station', 'route'], required: true },
  name: { type: String, required: true }, // Station name or Route number
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Favorite', favoriteSchema);
