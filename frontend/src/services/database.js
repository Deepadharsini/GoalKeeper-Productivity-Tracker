import { ref, set, get, push, update, remove, query, orderByChild } from 'firebase/database';
import { db } from '../config/firebase';

// Goals
export const createGoal = async (userId, goalData) => {
  try {
    const newGoalRef = push(ref(db, `goals/${userId}`));
    await set(newGoalRef, {
      ...goalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      milestones: []
    });
    return { id: newGoalRef.key, ...goalData };
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const getGoal = async (userId, goalId) => {
  try {
    const snapshot = await get(ref(db, `goals/${userId}/${goalId}`));
    if (!snapshot.exists()) {
      throw new Error('Goal not found');
    }
    return { id: snapshot.key, ...snapshot.val() };
  } catch (error) {
    console.error('Error getting goal:', error);
    throw error;
  }
};

export const getUserGoals = async (userId) => {
  try {
    const snapshot = await get(ref(db, `goals/${userId}`));
    if (!snapshot.exists()) {
      return [];
    }
    return Object.entries(snapshot.val()).map(([key, value]) => ({
      id: key,
      ...value
    }));
  } catch (error) {
    console.error('Error getting user goals:', error);
    throw error;
  }
};

export const updateGoal = async (userId, goalId, updates) => {
  try {
    const goalRef = ref(db, `goals/${userId}/${goalId}`);
    await update(goalRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    const snapshot = await get(goalRef);
    return { id: snapshot.key, ...snapshot.val() };
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (userId, goalId) => {
  try {
    await remove(ref(db, `goals/${userId}/${goalId}`));
    // Also delete associated progress
    await remove(ref(db, `progress/${userId}/${goalId}`));
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Progress
export const addProgress = async (userId, goalId, progressData) => {
  try {
    // Add progress entry
    const newProgressRef = push(ref(db, `progress/${userId}/${goalId}`));
    await set(newProgressRef, {
      ...progressData,
      timestamp: new Date().toISOString()
    });

    // Update goal progress
    const goalRef = ref(db, `goals/${userId}/${goalId}`);
    const goalSnapshot = await get(goalRef);
    const currentProgress = goalSnapshot.val().progress || 0;

    await update(goalRef, {
      progress: Math.min(100, currentProgress + progressData.value),
      updatedAt: new Date().toISOString()
    });

    return { id: newProgressRef.key, ...progressData };
  } catch (error) {
    console.error('Error adding progress:', error);
    throw error;
  }
};

// Milestones
export const addMilestone = async (userId, goalId, milestoneData) => {
  try {
    const goalRef = ref(db, `goals/${userId}/${goalId}`);
    const goalSnapshot = await get(goalRef);
    const currentMilestones = goalSnapshot.val().milestones || [];
    
    const newMilestone = {
      id: Date.now().toString(),
      ...milestoneData,
      completed: false,
      createdAt: new Date().toISOString()
    };

    await update(goalRef, {
      milestones: [...currentMilestones, newMilestone],
      updatedAt: new Date().toISOString()
    });

    return newMilestone;
  } catch (error) {
    console.error('Error adding milestone:', error);
    throw error;
  }
};

export const updateMilestone = async (userId, goalId, milestoneId, updates) => {
  try {
    const goalRef = ref(db, `goals/${userId}/${goalId}`);
    const goalSnapshot = await get(goalRef);
    const milestones = goalSnapshot.val().milestones;
    
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, ...updates }
        : milestone
    );

    await update(goalRef, {
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
}; 