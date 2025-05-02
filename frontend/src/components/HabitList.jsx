import { useState, useEffect } from "react";
import API from "../services/api"; // Using the configured Axios instance

const HabitList = () => {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingHabitId, setDeletingHabitId] = useState(null); // 👈 New state
  const [error, setError] = useState(null);

  // Fetch habits with authentication
  const fetchHabits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/habits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Log the response to see its structure
      console.log("Fetched habits response:", response.data);
  
      // Ensure the result is an array before setting it
      const fetchedHabits = Array.isArray(response.data)
        ? response.data
        : response.data.habits || [];
  
      setHabits(fetchedHabits);
      setError(null);
    } catch (error) {
      console.error('Failed to load habits', error);
      setError("Failed to load habits.");
    } finally {
      setLoading(false);
    }
  };
  
  // Add habit with authentication
  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.post("/api/habits", { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits([...habits, res.data]);
      setName("");
      setError(null);
    } catch (err) {
      console.error("Add habit failed", err);
      setError("Failed to add habit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete habit with authentication
  const handleDeleteHabit = async (habitId) => {
    setDeletingHabitId(habitId); // 👈 Set which habit is being deleted
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/habits/${habitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits(habits.filter((habit) => habit.id !== habitId));
      setError(null);
    } catch (err) {
      console.error("Delete habit failed", err);
      setError("Failed to delete habit. Please try again later.");
    } finally {
      setDeletingHabitId(null); // 👈 Clear after deleting
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Track Your Habits</h2>

      <form onSubmit={handleAddHabit} className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new habit"
          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 sm:py-3 rounded hover:bg-blue-700 text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>}

      {loading ? (
        <p className="text-sm sm:text-base">Loading habits...</p>
      ) : habits.length === 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">No habits yet. Start adding!</p>
      ) : (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-2 sm:gap-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base">{habit.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Streak: {habit.streak || 0} days
                </p>
              </div>
              <button
                onClick={() => handleDeleteHabit(habit.id)}
                className="text-red-500 hover:underline text-xs sm:text-sm self-end sm:self-auto"
                disabled={deletingHabitId === habit.id}
              >
                {deletingHabitId === habit.id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HabitList;
