// GoalList.jsx
import { useState } from "react";
import { useGoals } from "../hooks/useGoals";
import { createGoal, updateGoal, deleteGoal } from "../services/database";
import { useAuth } from "../hooks/useAuth";

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

const GoalList = () => {
  const { user } = useAuth();
  const { goals, loading, error } = useGoals();
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGoal(user.uid, newGoal);
      setNewGoal({ title: "", description: "", deadline: "" });
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  const handleDailyCheck = async (goal) => {
    const today = getToday();
    const completedDates = goal.completedDates || [];
    if (!completedDates.includes(today)) {
      const updatedCompletedDates = [...completedDates, today];
      // Calculate progress as percentage of days completed from createdAt to deadline
      const createdAt = new Date(goal.createdAt);
      const deadline = new Date(goal.deadline);
      const totalDays = Math.max(1, Math.floor((deadline - createdAt) / (1000 * 60 * 60 * 24)) + 1);
      const progress = Math.round((updatedCompletedDates.length / totalDays) * 100);
      await updateGoal(user.uid, goal.id, {
        completedDates: updatedCompletedDates,
        progress,
      });
    }
  };

  const handleDelete = async (goalId) => {
    try {
      await deleteGoal(user.uid, goalId);
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Goals</h3>

      <form onSubmit={handleSubmit} className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Goal Title"
            value={newGoal.title}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-20 sm:h-24 text-sm sm:text-base"
          />
        </div>
        <div>
          <input
            type="date"
            name="deadline"
            value={newGoal.deadline}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 sm:py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm sm:text-base"
        >
          Add Goal
        </button>
      </form>

      <div className="space-y-3 sm:space-y-4">
        {goals.map((goal) => {
          const today = getToday();
          const completedDates = goal.completedDates || [];
          const isTodayCompleted = completedDates.includes(today);
          return (
            <div
              key={goal.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow flex flex-col gap-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-base sm:text-lg font-semibold">{goal.title}</h4>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-red-500 hover:text-red-700 text-xs sm:text-sm border border-red-200 rounded px-2 py-1 self-end sm:self-auto"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isTodayCompleted}
                    onChange={() => handleDailyCheck(goal)}
                    disabled={isTodayCompleted}
                    className="w-4 h-4"
                  />
                  Daily
                </label>
                <span className={`text-sm ${goal.status === 'completed' ? "text-green-600" : "text-yellow-600"}`}>
                  {goal.status === 'completed' ? "Completed" : "In Progress"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 sm:mt-2">{goal.description}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
              <div className="mt-1 sm:mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-indigo-600 h-2 sm:h-2.5 rounded-full"
                    style={{ width: `${goal.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Progress: {goal.progress || 0}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalList;
