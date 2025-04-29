import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import GoalList from "./components/GoalList";
import HabitList from "./components/HabitList";
import ProductivityChart from "./components/ProductivityChart";
import ReminderPage from "./pages/ReminderPage";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Redirect to /login as the home page */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes - Requires Authentication */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes under /dashboard (relative paths) */}
            <Route path="goals" element={<GoalList />} />
            <Route path="habits" element={<HabitList />} />
            <Route path="chart" element={<ProductivityChart />} />
            <Route path="reminders" element={<ReminderPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
