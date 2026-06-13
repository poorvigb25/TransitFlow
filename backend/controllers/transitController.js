import MetroStation from '../models/MetroStation.js';
import MetroTrain from '../models/MetroTrain.js';
import MetroCoach from '../models/MetroCoach.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Favorite from '../models/Favorite.js';

export const getMetroStations = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city: new RegExp(city, 'i') } : {};
    const stations = await MetroStation.find(filter).sort({ stationName: 1 });
    res.json({ success: true, stations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMetroTrains = async (req, res) => {
  try {
    const trains = await MetroTrain.find().sort({ trainNumber: 1 });
    res.json({ success: true, trains });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMetroCoaches = async (req, res) => {
  try {
    const { trainNumber } = req.query;
    const filter = trainNumber ? { trainNumber } : {};
    const coaches = await MetroCoach.find(filter).sort({ coachNumber: 1 });
    res.json({ success: true, coaches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBuses = async (req, res) => {
  try {
    const { city, routeNumber } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (routeNumber) filter.routeNumber = routeNumber;

    const buses = await Bus.find(filter).sort({ busNumber: 1 });
    res.json({ success: true, buses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const toggleFavorite = async (req, res) => {
  const { type, name } = req.body;
  const userId = req.user.id;
  try {
    const existing = await Favorite.findOne({ userId, type, name });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    }
    const fav = new Favorite({ userId, type, name });
    await fav.save();
    res.json({ success: true, favorited: true, message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json({ success: true, favorites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
