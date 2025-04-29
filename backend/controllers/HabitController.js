import { createHabit, getHabitsByUserId, getHabitById, deleteHabit } from '../services/firebaseService.js';

// Create a new habit
export const createHabitController = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Habit name is required" });
  }

  try {
    const userId = req.user.uid;
    const habitData = {
      name,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedHabit = await createHabit(habitData);
    console.log("Created Habit:", savedHabit);
    res.status(201).json(savedHabit);
  } catch (err) {
    console.error("Error saving habit:", err);
    res.status(400).json({ message: "Error saving habit", error: err.message });
  }
};

// Get all habits for a user
export const getHabits = async (req, res) => {
  try {
    const userId = req.user.uid;
    const habits = await getHabitsByUserId(userId);
    console.log("Fetched Habits for User:", habits);
    res.json(habits);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ message: "Error fetching habits", error: err.message });
  }
};

// Delete a habit
export const deleteHabitController = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.uid;
    
    const habit = await getHabitById(habitId);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await deleteHabit(habitId);
    console.log("Deleted Habit ID:", habitId);
    res.json({ message: "Habit deleted" });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).json({ message: "Error deleting habit", error: err.message });
  }
};
