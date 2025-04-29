import { useState, useEffect } from "react";
import API from "../services/api"; // Assuming you have this API helper

const ReminderList = () => { // Remove props, fetch data inside
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(response.data);
    } catch (err) {
      console.error("Failed to load reminders", err);
      setError("Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    setLoading(true); // Optional: disable buttons while deleting
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/reminders/${reminderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(reminders.filter((reminder) => reminder.id !== reminderId)); // Use reminder.id
    } catch (err) {
      console.error("Delete reminder failed", err);
      setError("Failed to delete reminder.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Your Reminders</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}
      <ul className="space-y-3">
        {reminders.length === 0 && !loading ? (
          <p className="text-gray-500">No reminders set yet.</p>
        ) : (
          reminders.map((reminder) => (
            <li key={reminder.id} className="flex justify-between items-center p-4 border-b"> {/* Use reminder.id */}
              <div>
                <p className="font-semibold">{reminder.title}</p>
                <p className="text-gray-600">{new Date(reminder.time).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDeleteReminder(reminder.id)} // Use reminder.id
                className="text-red-500 hover:underline"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ReminderList;
