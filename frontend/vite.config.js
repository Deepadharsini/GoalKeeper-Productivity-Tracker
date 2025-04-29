import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_API_BASE_URL||"/GoalKeeper-Productivity-Tracker",
});
