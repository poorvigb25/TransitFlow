import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createNotification = async (req, res) => {
  const { type, message, city } = req.body;
  try {
    const notif = new Notification({ type, message, city });
    await notif.save();

    // Broadcast live notifications via socket
    req.io.emit('notification:new', notif);

    res.status(201).json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
