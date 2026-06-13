import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/auth.js';
import transitRoutes from './routes/transit.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import analyticsRoutes from './routes/analytics.js';

// Import Models for simulation
import Bus from './models/Bus.js';
import MetroTrain from './models/MetroTrain.js';
import MetroCoach from './models/MetroCoach.js';
import MetroStation from './models/MetroStation.js';
import { calculateCrowdLevel } from './utils/crowdCalculator.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Bind Socket IO instance to request for route access
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to Database
connectDB();

// Mounting Router Middleware
app.use('/api/auth', authRoutes);
app.use('/api/transit', transitRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check API
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'MetroConnect-Backend-API', timestamp: Date.now() });
});

// ─── Socket.IO Handler ───
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ─── ACTIVE SIMULATION TIMER (Runs every 10 seconds) ───
// Shifts vehicles slightly, fluctuates passenger occupancies, calculates crowd levels, and broadcasts updates.
setInterval(async () => {
  try {
    // 1. Simulate Buses Coordinates shifting & Passenger Count changes
    const buses = await Bus.find();
    for (let bus of buses) {
      // Small randomized movement
      const latChange = (Math.random() - 0.5) * 0.002;
      const lngChange = (Math.random() - 0.5) * 0.002;
      
      // Occupancy fluctuation (+- 5%)
      let newOcc = Math.max(10, Math.min(100, bus.occupancy + Math.floor(Math.random() * 11) - 5));
      let crowdLevel = calculateCrowdLevel(newOcc);

      bus.latitude += latChange;
      bus.longitude += lngChange;
      bus.occupancy = newOcc;
      bus.crowdLevel = crowdLevel;
      bus.updatedAt = Date.now();
      await bus.save();
      
      // Broadcast bus update
      io.emit('bus:update', bus);
    }
    
    // 2. Simulate Metro Trains & Coach Fluctuation
    const trains = await MetroTrain.find();
    for (let train of trains) {
      const coaches = await MetroCoach.find({ trainNumber: train.trainNumber });
      let totalCoachOcc = 0;
      for (let coach of coaches) {
        let newCoachOcc = Math.max(10, Math.min(100, coach.occupancy + Math.floor(Math.random() * 15) - 7));
        coach.occupancy = newCoachOcc;
        coach.crowdLevel = calculateCrowdLevel(newCoachOcc);
        coach.updatedAt = Date.now();
        await coach.save();
        totalCoachOcc += newCoachOcc;

        // Broadcast each coach update
        io.emit('coach:update', coach);
      }
      
      // Calculate overall train average
      const avgTrainOcc = Math.round(totalCoachOcc / coaches.length);
      train.occupancy = avgTrainOcc;
      train.crowdLevel = calculateCrowdLevel(avgTrainOcc);
      train.updatedAt = Date.now();
      await train.save();

      // Broadcast train update
      io.emit('train:update', train);
    }

    // 3. Fluctuates Station Congestion occupancy
    const stations = await MetroStation.find();
    for (let station of stations) {
      let newOcc = Math.max(5, Math.min(100, station.occupancy + Math.floor(Math.random() * 9) - 4));
      station.occupancy = newOcc;
      station.crowdLevel = calculateCrowdLevel(newOcc);
      station.updatedAt = Date.now();
      await station.save();

      // Broadcast station update
      io.emit('station:update', station);
    }

  } catch (error) {
    console.error(`Simulation Tick Error: ${error.message}`);
  }
}, 10000);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 MetroConnect Full Stack API listening on http://localhost:${PORT}`);
});
