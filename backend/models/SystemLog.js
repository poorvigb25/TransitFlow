import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  adminEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('SystemLog', systemLogSchema);
