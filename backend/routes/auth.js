import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middleware/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', verifyToken, getProfile);

export default router;
