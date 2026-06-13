import express from 'express';
import {
  updateStationOccupancy,
  updateCoachOccupancy,
  updateBusOccupancy,
  getSystemLogs
} from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Enforce admin permission for all endpoints
router.use(verifyToken, authorizeRoles('admin'));

router.post('/station/occupancy', updateStationOccupancy);
router.post('/coach/occupancy', updateCoachOccupancy);
router.post('/bus/occupancy', updateBusOccupancy);
router.get('/logs', getSystemLogs);

export default router;
