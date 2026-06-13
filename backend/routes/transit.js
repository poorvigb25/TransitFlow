import express from 'express';
import {
  getMetroStations,
  getMetroTrains,
  getMetroCoaches,
  getBuses,
  getRoutes,
  toggleFavorite,
  getFavorites
} from '../controllers/transitController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/stations', getMetroStations);
router.get('/trains', getMetroTrains);
router.get('/coaches', getMetroCoaches);
router.get('/buses', getBuses);
router.get('/routes', getRoutes);

router.post('/favorite', verifyToken, toggleFavorite);
router.get('/favorites', verifyToken, getFavorites);

export default router;
