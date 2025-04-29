import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

cron.schedule('*/1 * * * *', async () => {
  try {
    await axios.get(`${process.env.BACKEND_URL}/api/reminders/send`, {
      headers: {
        Authorization: `Bearer ${process.env.CRON_JWT}`
      }
    });
    console.log("🕒 Cron: Triggered reminder check.");
  } catch (err) {
    console.error("Cron job failed:", err.message);
  }cron.schedule('*/1 * * * *', async () => {
    await axios.get(`${process.env.BACKEND_URL}/api/reminders/send`, {
      headers: {
        Authorization: `Bearer ${process.env.CRON_JWT}`
      }
    });
  });
  
});
