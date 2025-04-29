import express from 'express';
import {
  createReminderController,
  getReminders,
  deleteReminderController
} from '../controllers/ReminderController.js';
import { protect } from '../middleware/Auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createReminderController)
  .get(protect, getReminders);

router.route('/:id')
  .delete(protect, deleteReminderController);

export default router;
