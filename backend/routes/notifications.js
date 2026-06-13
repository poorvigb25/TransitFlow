import express from 'express';
import { getNotifications, createNotification } from '../controllers/notificationController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', verifyToken, authorizeRoles('admin'), createNotification);

export default router;
