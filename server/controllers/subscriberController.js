import Subscriber from '../models/Subscriber.js';

export const subscribeUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save the email' });
  }
};
