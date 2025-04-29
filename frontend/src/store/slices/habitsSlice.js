import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  habits: [],
  isLoading: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    fetchHabitsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchHabitsSuccess: (state, action) => {
      state.isLoading = false;
      state.habits = action.payload;
      state.error = null;
    },
    fetchHabitsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addHabit: (state, action) => {
      state.habits.push(action.payload);
    },
    updateHabit: (state, action) => {
      const index = state.habits.findIndex((habit) => habit._id === action.payload._id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter((habit) => habit._id !== action.payload);
    },
    toggleHabitCompletion: (state, action) => {
      const { habitId, date } = action.payload;
      const habit = state.habits.find((h) => h._id === habitId);
      if (habit) {
        if (!habit.completedDates) {
          habit.completedDates = [];
        }
        const dateIndex = habit.completedDates.indexOf(date);
        if (dateIndex === -1) {
          habit.completedDates.push(date);
        } else {
          habit.completedDates.splice(dateIndex, 1);
        }
      }
    },
  },
});

export const {
  fetchHabitsStart,
  fetchHabitsSuccess,
  fetchHabitsFailure,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} = habitsSlice.actions;

export default habitsSlice.reducer; 