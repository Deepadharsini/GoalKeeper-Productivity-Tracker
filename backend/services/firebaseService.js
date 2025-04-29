import dotenv from 'dotenv';
import pkg from 'firebase-admin';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from './firebaseAdmin.js';
const { getFirestore } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin if not already initialized
if (!pkg.apps.length) {
  try {
    // Check if necessary environment variables are set
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('One or more Firebase environment variables are not set');
    }

    // Construct service account from environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newlines
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`,
    };

    // Initialize Firebase Admin SDK
    pkg.initializeApp({
      credential: pkg.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized using environment variables');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

// Initialize Firestore
const db = admin.firestore();

// Collection references
const usersCollection = db.collection('users');
const goalsCollection = db.collection('goals');
const habitsCollection = db.collection('habits');
const remindersCollection = db.collection('reminders');

// User operations
export const createUser = async (userData) => {
  const userRef = await usersCollection.add({
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { id: userRef.id, ...userData };
};

export const getUserById = async (userId) => {
  const userDoc = await usersCollection.doc(userId).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
};

export const updateUser = async (userId, userData) => {
  await usersCollection.doc(userId).update({
    ...userData,
    updatedAt: new Date().toISOString()
  });
  return { id: userId, ...userData };
};

// Goal operations
export const createGoal = async (goalData) => {
  const goalRef = await goalsCollection.add({
    ...goalData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { id: goalRef.id, ...goalData };
};

export const getGoalsByUserId = async (userId) => {
  const goalsSnapshot = await goalsCollection.where('userId', '==', userId).get();
  const goals = [];
  goalsSnapshot.forEach(doc => {
    goals.push({ id: doc.id, ...doc.data() });
  });
  return goals;
};

export const getGoalById = async (goalId) => {
  const goalDoc = await goalsCollection.doc(goalId).get();
  if (!goalDoc.exists) {
    return null;
  }
  return { id: goalDoc.id, ...goalDoc.data() };
};

export const updateGoal = async (goalId, goalData) => {
  await goalsCollection.doc(goalId).update({
    ...goalData,
    updatedAt: new Date().toISOString()
  });
  return { id: goalId, ...goalData };
};

export const deleteGoal = async (goalId) => {
  await goalsCollection.doc(goalId).delete();
  return { id: goalId };
};

// Habit operations
export const createHabit = async (habitData) => {
  const habitRef = await habitsCollection.add({
    ...habitData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { id: habitRef.id, ...habitData };
};

export const getHabitsByUserId = async (userId) => {
  const habitsSnapshot = await habitsCollection.where('userId', '==', userId).get();
  const habits = [];
  habitsSnapshot.forEach(doc => {
    habits.push({ id: doc.id, ...doc.data() });
  });
  return habits;
};

export const getHabitById = async (habitId) => {
  const habitDoc = await habitsCollection.doc(habitId).get();
  if (!habitDoc.exists) {
    return null;
  }
  return { id: habitDoc.id, ...habitDoc.data() };
};

export const updateHabit = async (habitId, habitData) => {
  await habitsCollection.doc(habitId).update({
    ...habitData,
    updatedAt: new Date().toISOString()
  });
  return { id: habitId, ...habitData };
};

export const deleteHabit = async (habitId) => {
  await habitsCollection.doc(habitId).delete();
  return { id: habitId };
};

// Reminder operations
export const createReminder = async (reminderData) => {
  const reminderRef = await remindersCollection.add({
    ...reminderData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { id: reminderRef.id, ...reminderData };
};

export const getRemindersByUserId = async (userId) => {
  const remindersSnapshot = await remindersCollection.where('userId', '==', userId).get();
  const reminders = [];
  remindersSnapshot.forEach(doc => {
    reminders.push({ id: doc.id, ...doc.data() });
  });
  return reminders;
};

export const getReminderById = async (reminderId) => {
  const reminderDoc = await remindersCollection.doc(reminderId).get();
  if (!reminderDoc.exists) {
    return null;
  }
  return { id: reminderDoc.id, ...reminderDoc.data() };
};

export const updateReminder = async (reminderId, reminderData) => {
  await remindersCollection.doc(reminderId).update({
    ...reminderData,
    updatedAt: new Date().toISOString()
  });
  return { id: reminderId, ...reminderData };
};

export const deleteReminder = async (reminderId) => {
  await remindersCollection.doc(reminderId).delete();
  return { id: reminderId };
};
