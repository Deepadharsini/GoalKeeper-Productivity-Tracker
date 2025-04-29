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
      setHabits(response.data);
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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Track Your Habits</h2>

      <form onSubmit={handleAddHabit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new habit"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading habits...</p>
      ) : habits.length === 0 ? (
        <p className="text-gray-500">No habits yet. Start adding!</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <div>
                <p className="font-semibold">{habit.name}</p>
                <p className="text-sm text-gray-500">
                  Streak: {habit.streak || 0} days
                </p>
              </div>
              <button
                onClick={() => handleDeleteHabit(habit.id)}
                className="text-red-500 hover:underline"
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
