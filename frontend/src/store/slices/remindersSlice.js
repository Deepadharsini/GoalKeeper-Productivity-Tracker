import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reminders: [],
  isLoading: false,
  error: null,
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    fetchRemindersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRemindersSuccess: (state, action) => {
      state.isLoading = false;
      state.reminders = action.payload;
      state.error = null;
    },
    fetchRemindersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addReminder: (state, action) => {
      state.reminders.push(action.payload);
    },
    updateReminder: (state, action) => {
      const index = state.reminders.findIndex((reminder) => reminder._id === action.payload._id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    deleteReminder: (state, action) => {
      state.reminders = state.reminders.filter((reminder) => reminder._id !== action.payload);
    },
    toggleReminderStatus: (state, action) => {
      const reminder = state.reminders.find((r) => r._id === action.payload);
      if (reminder) {
        reminder.isActive = !reminder.isActive;
      }
    },
  },
});

export const {
  fetchRemindersStart,
  fetchRemindersSuccess,
  fetchRemindersFailure,
  addReminder,
  updateReminder,
  deleteReminder,
  toggleReminderStatus,
} = remindersSlice.actions;

export default remindersSlice.reducer; 