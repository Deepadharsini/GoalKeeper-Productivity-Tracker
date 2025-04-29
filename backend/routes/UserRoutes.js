import express from 'express';
import { registerUser, loginUser } from '../controllers/AuthController.js';
const router = express.Router();
import { getMe } from '../controllers/AuthController.js';
import { protect } from '../middleware/Auth.js';

router.get('/me', protect, getMe);

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
