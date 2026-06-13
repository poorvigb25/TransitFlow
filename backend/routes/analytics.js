import express from 'express';
import { getCrowdAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getCrowdAnalytics);

export default router;
