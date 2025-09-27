import Subscriber from '../models/Subscriber.js';
import { sendWeeklyJobs } from "../jobs/sendWeeklyJobs.js";

export const subscribeUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // ✅ Send immediate email with this week's top 5 jobs
    try {
      await sendWeeklyJobs(email); // pass single email
      console.log(`📧 Welcome email sent to ${email}`);
    } catch (err) {
      console.error("⚠️ Failed to send welcome email:", err);
    }
    
    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save the email' });
  }
};
