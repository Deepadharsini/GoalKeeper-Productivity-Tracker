import { useState, useEffect } from "react";
import ReminderForm from "../components/ReminderForm";
import ReminderList from "../components/ReminderList";
import API from "../services/api";

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    try {
      const response = await API.get("/api/reminders");
      setReminders(response.data);
    } catch (err) {
      console.error("Failed to fetch reminders", err);
    }
  };

  // When a new reminder is added, update the list
  const handleReminderAdded = (newReminder) => {
    setReminders((prevReminders) => [...prevReminders, newReminder]);
  };

  useEffect(() => {
    fetchReminders(); // Load reminders initially
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <ReminderForm onReminderAdded={handleReminderAdded} />
      <ReminderList reminders={reminders} /> {/* Pass reminders directly to ReminderList */}
    </div>
  );
};

export default ReminderPage;
