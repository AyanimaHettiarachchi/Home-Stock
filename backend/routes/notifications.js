const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Create a new notification (unchanged)
router.post('/', async (req, res) => {
  try {
    const { type, itemId, message, userId, preferences } = req.body;
    if (!type || !message || !userId) {
      return res.status(400).json({ error: 'Type, message, and userId are required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format. Must be a valid ObjectId.' });
    }
    const validUserId = new mongoose.Types.ObjectId(userId);
    const notification = new Notification({
      type,
      itemId: itemId || undefined,
      message,
      userId: validUserId,
      preferences: preferences || {},
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get active notifications for a user (unchanged)
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format. Must be a valid ObjectId.' });
    }
    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'active',
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a notification
router.put('/:id', async (req, res) => {
  try {
    const { message, status } = req.body;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid notification ID format. Must be a valid ObjectId.' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (status && !['active', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "active" or "dismissed".' });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { message, status: status || 'active' },
      { new: true, runValidators: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update notification preferences for a user (unchanged)
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { email, push, frequency, timeZone, lowStockThreshold, expiryThresholdDays } = req.body;
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format. Must be a valid ObjectId.' });
    }
    const notification = await Notification.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          'preferences.email': email,
          'preferences.push': push,
          'preferences.frequency': frequency,
          'preferences.timeZone': timeZone,
          'preferences.lowStockThreshold': lowStockThreshold,
          'preferences.expiryThresholdDays': expiryThresholdDays,
        },
      },
      { new: true, upsert: true }
    );
    res.json(notification.preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get notification preferences for a user (unchanged)
router.get('/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format. Must be a valid ObjectId.' });
    }
    const notification = await Notification.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    const preferences = notification
      ? notification.preferences
      : {
          email: true,
          push: true,
          frequency: 'daily',
          timeZone: 'UTC',
          lowStockThreshold: 10,
          expiryThresholdDays: 7,
        };
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dismiss a notification (unchanged)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid notification ID format. Must be a valid ObjectId.' });
    }
    const result = await Notification.findByIdAndUpdate(id, { status: 'dismissed' }, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error dismissing notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get notification history for a user (unchanged)
router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format. Must be a valid ObjectId.' });
    }
    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;