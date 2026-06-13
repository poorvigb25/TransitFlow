import CrowdHistory from '../models/CrowdHistory.js';
import MetroStation from '../models/MetroStation.js';
import MetroTrain from '../models/MetroTrain.js';
import Bus from '../models/Bus.js';

export const getCrowdAnalytics = async (req, res) => {
  try {
    // Generate simulated data points for Recharts based on historical aggregates
    const dailyTrend = [
      { name: '06:00', occupancy: 20 },
      { name: '09:00', occupancy: 85 }, // peak hour
      { name: '12:00', occupancy: 45 },
      { name: '15:00', occupancy: 50 },
      { name: '18:00', occupancy: 90 }, // peak hour
      { name: '21:00', occupancy: 60 },
      { name: '23:00', occupancy: 15 },
    ];

    const weeklyTrend = [
      { name: 'Mon', metro: 72, bus: 65 },
      { name: 'Tue', metro: 78, bus: 68 },
      { name: 'Wed', metro: 80, bus: 70 },
      { name: 'Thu', metro: 75, bus: 64 },
      { name: 'Fri', metro: 85, bus: 75 },
      { name: 'Sat', metro: 45, bus: 40 },
      { name: 'Sun', metro: 30, bus: 25 },
    ];

    // Find the most crowded stations
    const stations = await MetroStation.find().sort({ occupancy: -1 }).limit(5);
    const stationOccupancy = stations.map(s => ({
      name: s.stationName,
      value: s.occupancy
    }));

    // Find the most crowded buses
    const buses = await Bus.find().sort({ occupancy: -1 }).limit(5);
    const busOccupancy = buses.map(b => ({
      name: b.busNumber,
      value: b.occupancy
    }));

    res.json({
      success: true,
      dailyTrend,
      weeklyTrend,
      stationOccupancy,
      busOccupancy
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
