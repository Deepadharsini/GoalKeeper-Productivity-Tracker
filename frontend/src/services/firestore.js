// src/services/firestore.js
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Goals Collection
export const goalsCollection = collection(db, 'goals');

// Create a new goal
export const createGoal = async (userId, goalData) => {
  try {
    const goalRef = await addDoc(goalsCollection, {
      ...goalData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active',
      progress: 0,
      milestones: [],
      isPublic: false
    });
    return goalRef.id;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

// Get a single goal
export const getGoal = async (goalId) => {
  try {
    const goalDoc = await getDoc(doc(db, 'goals', goalId));
    if (!goalDoc.exists()) {
      throw new Error('Goal not found');
    }
    return { id: goalDoc.id, ...goalDoc.data() };
  } catch (error) {
    console.error('Error getting goal:', error);
    throw error;
  }
};

// Get all goals for a user
export const getUserGoals = async (userId, filters = {}) => {
  try {
    let q = query(
      goalsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user goals:', error);
    throw error;
  }
};

// Update a goal
export const updateGoal = async (goalId, updates) => {
  try {
    const goalRef = doc(db, 'goals', goalId);
    await updateDoc(goalRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Delete a goal
export const deleteGoal = async (goalId) => {
  try {
    await deleteDoc(doc(db, 'goals', goalId));
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Progress Tracking
export const progressCollection = collection(db, 'progress');

// Add progress entry
export const addProgress = async (userId, goalId, progressData) => {
  try {
    const progressRef = await addDoc(progressCollection, {
      ...progressData,
      userId,
      goalId,
      timestamp: serverTimestamp()
    });

    // Update goal progress
    const goalRef = doc(db, 'goals', goalId);
    const goalDoc = await getDoc(goalRef);
    const currentProgress = goalDoc.data().progress || 0;
    
    await updateDoc(goalRef, {
      progress: Math.min(100, currentProgress + progressData.value),
      updatedAt: serverTimestamp()
    });

    return progressRef.id;
  } catch (error) {
    console.error('Error adding progress:', error);
    throw error;
  }
};

// Get progress history for a goal
export const getGoalProgress = async (goalId) => {
  try {
    const q = query(
      progressCollection,
      where('goalId', '==', goalId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting goal progress:', error);
    throw error;
  }
};

// Milestones
export const addMilestone = async (goalId, milestoneData) => {
  try {
    const goalRef = doc(db, 'goals', goalId);
    const goalDoc = await getDoc(goalRef);
    const currentMilestones = goalDoc.data().milestones || [];
    
    const newMilestone = {
      id: Date.now().toString(),
      ...milestoneData,
      completed: false,
      createdAt: serverTimestamp()
    };

    await updateDoc(goalRef, {
      milestones: [...currentMilestones, newMilestone],
      updatedAt: serverTimestamp()
    });

    return newMilestone.id;
  } catch (error) {
    console.error('Error adding milestone:', error);
    throw error;
  }
};

// Update milestone status
export const updateMilestone = async (goalId, milestoneId, updates) => {
  try {
    const goalRef = doc(db, 'goals', goalId);
    const goalDoc = await getDoc(goalRef);
    const milestones = goalDoc.data().milestones;
    
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, ...updates }
        : milestone
    );

    await updateDoc(goalRef, {
      milestones: updatedMilestones,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
}; 