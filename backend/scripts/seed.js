import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import MetroStation from '../models/MetroStation.js';
import MetroTrain from '../models/MetroTrain.js';
import MetroCoach from '../models/MetroCoach.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Notification from '../models/Notification.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/metroconnect');
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await MetroStation.deleteMany();
    await MetroTrain.deleteMany();
    await MetroCoach.deleteMany();
    await Bus.deleteMany();
    await Route.deleteMany();
    await Notification.deleteMany();

    console.log('🧹 Cleaned existing database collections.');

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    await User.insertMany([
      { name: 'Siddharth (Admin)', email: 'admin@metroconnect.com', password: adminPassword, role: 'admin' },
      { name: 'Rohit (Passenger)', email: 'user@metroconnect.com', password: userPassword, role: 'passenger' },
    ]);
    console.log('👥 Users seeded successfully.');

    // Seed Bangalore Stations (Bengaluru Namma Metro Style)
    const stations = [
      { stationName: 'Majestic (Kempegowda)', city: 'Bangalore', latitude: 12.9756, longitude: 77.5728, occupancy: 85, crowdLevel: 'High', lineColor: '#7c3aed' },
      { stationName: 'Indiranagar', city: 'Bangalore', latitude: 12.9783, longitude: 77.6408, occupancy: 60, crowdLevel: 'Medium', lineColor: '#7c3aed' },
      { stationName: 'MG Road', city: 'Bangalore', latitude: 12.9755, longitude: 77.6068, occupancy: 40, crowdLevel: 'Medium', lineColor: '#7c3aed' },
      { stationName: 'Trinity', city: 'Bangalore', latitude: 12.9733, longitude: 77.6172, occupancy: 25, crowdLevel: 'Low', lineColor: '#7c3aed' },
      { stationName: 'Halasuru', city: 'Bangalore', latitude: 12.9768, longitude: 77.6264, occupancy: 30, crowdLevel: 'Low', lineColor: '#7c3aed' },
      { stationName: 'Whitefield', city: 'Bangalore', latitude: 12.9698, longitude: 77.7499, occupancy: 90, crowdLevel: 'High', lineColor: '#7c3aed' },
      { stationName: 'Jayanagar', city: 'Bangalore', latitude: 12.9279, longitude: 77.5802, occupancy: 35, crowdLevel: 'Medium', lineColor: '#16a34a' },
      { stationName: 'Yashwanthpur', city: 'Bangalore', latitude: 13.0234, longitude: 77.5501, occupancy: 75, crowdLevel: 'High', lineColor: '#16a34a' },
      { stationName: 'Banashankari', city: 'Bangalore', latitude: 12.9156, longitude: 77.5736, occupancy: 45, crowdLevel: 'Medium', lineColor: '#16a34a' },
      { stationName: 'Nagasandra', city: 'Bangalore', latitude: 13.0483, longitude: 77.5002, occupancy: 20, crowdLevel: 'Low', lineColor: '#16a34a' },
      
      // Delhi Metro Style
      { stationName: 'Connaught Place', city: 'Delhi', latitude: 28.6304, longitude: 77.2177, occupancy: 95, crowdLevel: 'High', lineColor: '#eab308' },
      { stationName: 'Rajiv Chowk', city: 'Delhi', latitude: 28.6328, longitude: 77.2197, occupancy: 98, crowdLevel: 'High', lineColor: '#2563eb' },
      { stationName: 'Hauz Khas', city: 'Delhi', latitude: 28.5432, longitude: 77.2065, occupancy: 70, crowdLevel: 'Medium', lineColor: '#eab308' },
      { stationName: 'Noida City Center', city: 'Delhi', latitude: 28.5747, longitude: 77.3560, occupancy: 50, crowdLevel: 'Medium', lineColor: '#2563eb' },
      { stationName: 'Chandni Chowk', city: 'Delhi', latitude: 28.6578, longitude: 77.2301, occupancy: 88, crowdLevel: 'High', lineColor: '#eab308' },

      // Mumbai Metro Style
      { stationName: 'Ghatkopar', city: 'Mumbai', latitude: 19.0862, longitude: 72.9090, occupancy: 99, crowdLevel: 'High', lineColor: '#e11d48' },
      { stationName: 'Andheri West', city: 'Mumbai', latitude: 19.1197, longitude: 72.8465, occupancy: 82, crowdLevel: 'High', lineColor: '#7c3aed' },
      { stationName: 'Versova', city: 'Mumbai', latitude: 19.1351, longitude: 72.8146, occupancy: 40, crowdLevel: 'Medium', lineColor: '#e11d48' },
      { stationName: 'D.N. Nagar', city: 'Mumbai', latitude: 19.1248, longitude: 72.8362, occupancy: 65, crowdLevel: 'Medium', lineColor: '#e11d48' },
      { stationName: 'Saki Naka', city: 'Mumbai', latitude: 19.0962, longitude: 72.8877, occupancy: 78, crowdLevel: 'High', lineColor: '#e11d48' }
    ];

    await MetroStation.insertMany(stations);
    console.log('🚉 Metro Stations seeded.');

    // Seed Metro Trains
    const trains = [
      { trainNumber: 'MTR-BLR-P01', lineName: 'Purple Line', lineColor: '#7c3aed', currentStation: 'Trinity', direction: 'Towards Whitefield', occupancy: 55, crowdLevel: 'Medium' },
      { trainNumber: 'MTR-BLR-G01', lineName: 'Green Line', lineColor: '#16a34a', currentStation: 'Yashwanthpur', direction: 'Towards Silk Institute', occupancy: 70, crowdLevel: 'Medium' },
      { trainNumber: 'MTR-DEL-Y01', lineName: 'Yellow Line', lineColor: '#eab308', currentStation: 'Hauz Khas', direction: 'Towards Samaypur Badli', occupancy: 80, crowdLevel: 'High' },
      { trainNumber: 'MTR-MUM-L01', lineName: 'Line 1', lineColor: '#e11d48', currentStation: 'Saki Naka', direction: 'Towards Ghatkopar', occupancy: 92, crowdLevel: 'High' }
    ];

    await MetroTrain.insertMany(trains);
    console.log('🚇 Metro Trains seeded.');

    // Seed Metro Coaches (6 coaches for each train)
    const coaches = [];
    trains.forEach(t => {
      for (let i = 1; i <= 6; i++) {
        let coachOcc = Math.max(10, Math.min(100, t.occupancy + (i * 8 - 25)));
        coaches.push({
          trainNumber: t.trainNumber,
          coachNumber: i,
          occupancy: coachOcc,
          crowdLevel: coachOcc <= 30 ? 'Low' : coachOcc <= 70 ? 'Medium' : 'High'
        });
      }
    });

    await MetroCoach.insertMany(coaches);
    console.log('🚋 Metro Coaches seeded.');

    // Seed Buses
    const buses = [];
    const busRoutes = ['500C', 'V-335E', '365', '500-D', 'G-3'];
    const cities = ['Bangalore', 'Delhi', 'Mumbai'];

    for (let i = 1; i <= 50; i++) {
      const city = cities[i % cities.length];
      const route = busRoutes[i % busRoutes.length];
      
      const latOffset = (Math.random() - 0.5) * 0.15;
      const lngOffset = (Math.random() - 0.5) * 0.15;
      const baseCoords = {
        'Bangalore': { lat: 12.9716, lng: 77.5946 },
        'Delhi': { lat: 28.6139, lng: 77.2090 },
        'Mumbai': { lat: 19.0760, lng: 72.8777 }
      }[city];

      const occupancy = Math.floor(Math.random() * 100);
      buses.push({
        routeNumber: route,
        busNumber: `${city.substring(0,3).toUpperCase()}-BUS-${100 + i}`,
        city,
        latitude: baseCoords.lat + latOffset,
        longitude: baseCoords.lng + lngOffset,
        occupancy,
        crowdLevel: occupancy <= 30 ? 'Low' : occupancy <= 70 ? 'Medium' : 'High',
        speed: Math.floor(Math.random() * 30) + 15,
        eta: `${Math.floor(Math.random() * 15) + 3} mins`,
        currentStop: 'Main Road Stop',
        nextStop: 'Terminal Crossing',
        status: occupancy > 80 ? 'Heavy Traffic' : 'On Time'
      });
    }

    await Bus.insertMany(buses);
    console.log('🚌 Buses seeded.');

    // Seed Route lines
    await Route.insertMany([
      {
        routeNumber: '500C',
        routeName: 'Majestic to Whitefield Express',
        type: 'bus',
        stops: [
          { name: 'Majestic Terminal', latitude: 12.9756, longitude: 77.5728 },
          { name: 'MG Road Metro', latitude: 12.9755, longitude: 77.6068 },
          { name: 'Indiranagar Crossing', latitude: 12.9783, longitude: 77.6408 },
          { name: 'Halasuru Depot', latitude: 12.9768, longitude: 77.6264 },
          { name: 'Whitefield Tech Park', latitude: 12.9698, longitude: 77.7499 }
        ]
      }
    ]);
    console.log('🗺️ Transit Routes seeded.');

    // Seed Alerts
    await Notification.insertMany([
      { type: 'Delay', message: 'Namma Metro Purple Line experiencing 5-minute signalling delay.', city: 'Bangalore' },
      { type: 'Overcrowding', message: 'High commuter density reported at Majestic Station Platform 2.', city: 'Bangalore' },
      { type: 'Service Alert', message: 'BMTC Bus Route 500C running with diverted stops due to flyover construction.', city: 'Bangalore' },
    ]);
    console.log('🔔 Notifications seeded.');

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
