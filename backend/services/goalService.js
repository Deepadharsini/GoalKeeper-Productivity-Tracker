import admin from '../services/firebaseAdmin.js';

const db = admin.firestore();

const goalService = {
  // Create a new goal
  async createGoal(userId, goalData) {
    try {
      const goalRef = await db.collection('goals').add({
        ...goalData,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'active',
        progress: 0,
        milestones: []
      });
      
      return { id: goalRef.id, ...goalData };
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  // Get a goal by ID
  async getGoalById(goalId) {
    try {
      const goalDoc = await db.collection('goals').doc(goalId).get();
      if (!goalDoc.exists) {
        throw new Error('Goal not found');
      }
      return { id: goalDoc.id, ...goalDoc.data() };
    } catch (error) {
      console.error('Error getting goal:', error);
      throw error;
    }
  },

  // Get all goals for a user
  async getUserGoals(userId, filters = {}) {
    try {
      let query = db.collection('goals').where('userId', '==', userId);
      
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }
      
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user goals:', error);
      throw error;
    }
  },

  // Update a goal
  async updateGoal(goalId, updates) {
    try {
      const goalRef = db.collection('goals').doc(goalId);
      await goalRef.update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const updatedDoc = await goalRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  // Delete a goal
  async deleteGoal(goalId) {
    try {
      // Delete goal document
      await db.collection('goals').doc(goalId).delete();
      
      // Delete associated progress entries
      const progressSnapshot = await db.collection('progress')
        .where('goalId', '==', goalId)
        .get();
      
      const batch = db.batch();
      progressSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Add progress to a goal
  async addProgress(goalId, userId, progressData) {
    try {
      const batch = db.batch();
      
      // Add progress entry
      const progressRef = db.collection('progress').doc();
      batch.set(progressRef, {
        ...progressData,
        userId,
        goalId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update goal progress
      const goalRef = db.collection('goals').doc(goalId);
      const goalDoc = await goalRef.get();
      const currentProgress = goalDoc.data().progress || 0;
      
      batch.update(goalRef, {
        progress: Math.min(100, currentProgress + progressData.value),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      await batch.commit();
      return { id: progressRef.id, ...progressData };
    } catch (error) {
      console.error('Error adding progress:', error);
      throw error;
    }
  }
};

export default goalService; 