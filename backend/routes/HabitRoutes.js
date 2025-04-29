// routes/HabitRoutes.js

import express from 'express';
import { protect } from '../middleware/Auth.js'; // This ensures authentication
import { createHabitController, getHabits, deleteHabitController } from '../controllers/HabitController.js';

const router = express.Router();

// Create habit and get all habits
router.route("/")
  .post(protect, createHabitController)  // Ensure the user is authenticated to create a habit
  .get(protect, getHabits);    // Ensure the user is authenticated to get their habits

// Delete a habit by ID
router.route("/:id")
  .delete(protect, deleteHabitController);  // Ensure the user is authenticated and authorized to delete

export default router;
