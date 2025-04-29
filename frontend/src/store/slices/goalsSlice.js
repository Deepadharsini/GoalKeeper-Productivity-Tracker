import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  goals: [],
  isLoading: false,
  error: null,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    fetchGoalsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGoalsSuccess: (state, action) => {
      state.isLoading = false;
      state.goals = action.payload;
      state.error = null;
    },
    fetchGoalsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addGoal: (state, action) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state, action) => {
      const index = state.goals.findIndex((goal) => goal._id === action.payload._id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    deleteGoal: (state, action) => {
      state.goals = state.goals.filter((goal) => goal._id !== action.payload);
    },
    toggleGoalCompletion: (state, action) => {
      const goal = state.goals.find((g) => g._id === action.payload);
      if (goal) {
        goal.completed = !goal.completed;
      }
    },
  },
});

export const {
  fetchGoalsStart,
  fetchGoalsSuccess,
  fetchGoalsFailure,
  addGoal,
  updateGoal,
  deleteGoal,
  toggleGoalCompletion,
} = goalsSlice.actions;

export default goalsSlice.reducer; 