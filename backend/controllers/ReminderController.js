import { createReminder, getRemindersByUserId, updateReminder, deleteReminder } from '../services/firebaseService.js';
import { sendReminderEmail } from '../utils/sendEmail.js';
import admin from '../services/firebaseAdmin.js';

// Controller to create a reminder
export const createReminderController = async (req, res) => {
  const { title, time } = req.body;
  const userId = req.user.uid;

  try {
    const reminderData = {
      title,
      time,
      userId,
      sent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedReminder = await createReminder(reminderData);
    res.status(201).json(savedReminder);

    // Schedule the email at the specified time
    const reminderTime = new Date(time).getTime();
    const currentTime = new Date().getTime();
    const delay = reminderTime - currentTime;

    if (delay > 0) {
      setTimeout(async () => {
        try {
          const userRecord = await admin.auth().getUser(userId);
          const email = userRecord.email;
          const name = userRecord.displayName || email.split('@')[0];
          await sendReminderEmail(
            email,
            '⏰ Reminder from GoalKeeper',
            `Hey ${name}, it's time for: ${savedReminder.title}`
          );

          // Mark reminder as sent
          await updateReminder(savedReminder.id, { sent: true });
        } catch (err) {
          console.error('❌ Error sending reminder email:', err);
        }
      }, delay);
    }
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder' });
  }
};

// Controller to get all reminders for the user
export const getReminders = async (req, res) => {
  try {
    const userId = req.user.uid;
    const reminders = await getRemindersByUserId(userId);
    res.json(reminders);
  } catch (error) {
    console.error('Error getting reminders:', error);
    res.status(500).json({ message: 'Failed to get reminders' });
  }
};

// Controller to delete a reminder
export const deleteReminderController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid; // Ensure user owns the reminder

  try {
    // Optional: Fetch reminder first to verify ownership
    // const reminder = await getReminderById(id);
    // if (!reminder || reminder.userId !== userId) {
    //   return res.status(404).json({ message: 'Reminder not found or not authorized' });
    // }

    await deleteReminder(id);
    res.status(200).json({ message: 'Reminder deleted successfully', id });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Failed to delete reminder' });
  }
};

// Controller to check and send pending reminders (can be enhanced in future)
export const checkAndSendReminders = async (req, res) => {
  const now = new Date();

  try {
    // This would need to be implemented in the Firebase service
    // For now, we'll just return a message
    res.json({ message: "Reminder checking functionality needs to be implemented with Firebase." });
  } catch (error) {
    console.error('Error checking reminders:', error);
    res.status(500).json({ message: 'Failed to send reminders' });
  }
};
