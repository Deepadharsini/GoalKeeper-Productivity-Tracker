import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
    }),
  });
}

// Test Firebase Initialization
const db = admin.firestore();
db.collection('users').get()
  .then(snapshot => {
    console.log('Firebase connected successfully!', snapshot.docs.length, 'users found');
  })
  .catch(error => {
    console.error('Error connecting to Firebase:', error);
  });

export default admin;
