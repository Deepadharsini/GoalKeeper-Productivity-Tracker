import { getUserById, createUser, updateUser } from '../services/firebaseService.js';
import pkg from 'firebase-admin';
const { auth } = pkg;

export const getMe = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Note: User registration and login are handled by Firebase Authentication
// These functions are kept for backward compatibility but will redirect to the frontend

export const registerUser = async (req, res) => {
  // This is now handled by Firebase Authentication on the frontend
  res.status(200).json({ 
    message: 'User registration is handled by Firebase Authentication on the frontend' 
  });
};

export const loginUser = async (req, res) => {
  // This is now handled by Firebase Authentication on the frontend
  res.status(200).json({ 
    message: 'User login is handled by Firebase Authentication on the frontend' 
  });
};

