import { configureStore } from '@reduxjs/toolkit';
import goalsReducer from './slices/goalsSlice';
import habitsReducer from './slices/habitsSlice';
import remindersReducer from './slices/remindersSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    goals: goalsReducer,
    habits: habitsReducer,
    reminders: remindersReducer,
    auth: authReducer,
  },
});

export default store; 