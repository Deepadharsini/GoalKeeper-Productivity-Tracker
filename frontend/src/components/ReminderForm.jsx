import { useState } from "react";
import API from "../services/api";

const ReminderForm = ({ onReminderAdded }) => {
  const [title, setTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Create new reminder
      const response = await API.post("/api/reminders", {
        title,
        time: reminderTime,
      });

      // 🔹 Show success message
      setMessage("✅ Reminder set!");

      // 🔹 Clear inputs
      setTitle("");
      setReminderTime("");

      // 🔹 Tell parent to add this reminder to the list (no need to re-fetch all)
      onReminderAdded(response.data); // 👈 THIS is the key!
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to set reminder.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow-md space-y-4">
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Take medicine"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Time</label>
        <input
          type="datetime-local"
          className="w-full p-2 border border-gray-300 rounded"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Set Reminder
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default ReminderForm;
