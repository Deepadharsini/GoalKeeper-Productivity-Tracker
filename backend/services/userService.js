import admin from '../services/firebaseAdmin.js';

const db = admin.firestore();
const auth = admin.auth();

const userService = {
  // Get user by ID
  async getUserById(uid) {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  async createOrUpdateUser(uid, userData) {
    try {
      const userRef = db.collection('users').doc(uid);
      await userRef.set({
        ...userData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      return { id: uid, ...userData };
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },
  async deleteUser(uid) {
    try {
      
      await db.collection('users').doc(uid).delete();
      const goalsSnapshot = await db.collection('goals')
        .where('userId', '==', uid)
        .get();
      
      const batch = db.batch();
      goalsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      const progressSnapshot = await db.collection('progress')
        .where('userId', '==', uid)
        .get();
      
      const progressBatch = db.batch();
      progressSnapshot.docs.forEach(doc => {
        progressBatch.delete(doc.ref);
      });
      await progressBatch.commit();
      
      // Delete Firebase Auth user
      await auth.deleteUser(uid);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Verify Firebase ID token
  async verifyToken(idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};

export default userService; 