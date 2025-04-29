// routes/goalRoutes.js
import express from "express";
import {
  createGoalController,
  getGoals,
  updateGoalController,
  deleteGoalController,
} from "../controllers/GoalController.js";
import { protect } from "../middleware/Auth.js";

const router = express.Router();

router.route("/")
  .post(protect, createGoalController)
  .get(protect, getGoals);

router.route("/:id")
  .put(protect, updateGoalController)
  .delete(protect, deleteGoalController);

export default router;
