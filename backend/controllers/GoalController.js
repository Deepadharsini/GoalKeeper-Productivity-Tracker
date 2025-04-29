// controllers/goalController.js
import { createGoal, getGoalsByUserId, getGoalById, updateGoal, deleteGoal } from '../services/firebaseService.js';

export const createGoalController = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.uid; // Firebase auth provides uid

    const goalData = {
      title,
      description,
      deadline,
      userId,
      completed: false
    };

    const savedGoal = await createGoal(goalData);
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.uid;
    const goals = await getGoalsByUserId(userId);
    res.json(goals);
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGoalController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    const goal = await getGoalById(id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    if (goal.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedGoal = await updateGoal(id, req.body);
    res.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGoalController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    const goal = await getGoalById(id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    if (goal.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await deleteGoal(id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
