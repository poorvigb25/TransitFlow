import MetroStation from '../models/MetroStation.js';
import MetroTrain from '../models/MetroTrain.js';
import MetroCoach from '../models/MetroCoach.js';
import Bus from '../models/Bus.js';
import SystemLog from '../models/SystemLog.js';
import CrowdHistory from '../models/CrowdHistory.js';
import { calculateCrowdLevel } from '../utils/crowdCalculator.js';

export const updateStationOccupancy = async (req, res) => {
  const { stationId, occupancy, status } = req.body;
  try {
    const crowdLevel = calculateCrowdLevel(occupancy);
    const station = await MetroStation.findByIdAndUpdate(
      stationId,
      { occupancy, status, crowdLevel, updatedAt: Date.now() },
      { new: true }
    );

    if (!station) return res.status(404).json({ success: false, error: 'Station not found' });

    // Save history logs
    await new CrowdHistory({ entityId: station.stationName, entityType: 'station', occupancy }).save();

    // Log admin actions
    await new SystemLog({ action: `Updated station "${station.stationName}" occupancy to ${occupancy}%`, adminEmail: req.user.email }).save();

    // Broadcast live socket updates
    req.io.emit('station:update', station);

    res.json({ success: true, station });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCoachOccupancy = async (req, res) => {
  const { coachId, occupancy } = req.body;
  try {
    const crowdLevel = calculateCrowdLevel(occupancy);
    const coach = await MetroCoach.findByIdAndUpdate(
      coachId,
      { occupancy, crowdLevel, updatedAt: Date.now() },
      { new: true }
    );

    if (!coach) return res.status(404).json({ success: false, error: 'Coach not found' });

    // Aggregate coach occupancies to update the overall train occupancy
    const allCoaches = await MetroCoach.find({ trainNumber: coach.trainNumber });
    const avgOccupancy = Math.round(allCoaches.reduce((s, c) => s + c.occupancy, 0) / allCoaches.length);
    const trainCrowdLevel = calculateCrowdLevel(avgOccupancy);

    const train = await MetroTrain.findOneAndUpdate(
      { trainNumber: coach.trainNumber },
      { occupancy: avgOccupancy, crowdLevel: trainCrowdLevel, updatedAt: Date.now() },
      { new: true }
    );

    // Save history logs
    await new CrowdHistory({ entityId: coach.trainNumber, entityType: 'train', occupancy: avgOccupancy }).save();

    // Log admin actions
    await new SystemLog({ action: `Updated Train ${coach.trainNumber} Coach ${coach.coachNumber} occupancy to ${occupancy}%`, adminEmail: req.user.email }).save();

    // Broadcast updates
    req.io.emit('coach:update', coach);
    if (train) req.io.emit('train:update', train);

    res.json({ success: true, coach, train });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateBusOccupancy = async (req, res) => {
  const { busId, occupancy, status, latitude, longitude } = req.body;
  try {
    const crowdLevel = calculateCrowdLevel(occupancy);
    const updateFields = { occupancy, status, crowdLevel, updatedAt: Date.now() };
    if (latitude) updateFields.latitude = latitude;
    if (longitude) updateFields.longitude = longitude;

    const bus = await Bus.findByIdAndUpdate(busId, updateFields, { new: true });
    if (!bus) return res.status(404).json({ success: false, error: 'Bus not found' });

    // Save history logs
    await new CrowdHistory({ entityId: bus.busNumber, entityType: 'bus', occupancy }).save();

    // Log admin actions
    await new SystemLog({ action: `Updated Bus "${bus.busNumber}" occupancy to ${occupancy}%`, adminEmail: req.user.email }).save();

    // Broadcast updates
    req.io.emit('bus:update', bus);

    res.json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
