const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { type, itemId, message, userId, preferences } = req.body;
    if (!type || !itemId || !message || !userId) {
      return res.status(400).json({ error: 'Type, itemId, message, and userId are required.' });
    }
    const notification = new Notification({
      type,
      itemId,
      message,
      userId,
      preferences: preferences || {},
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all active notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
      status: 'active',
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update notification preferences for a user
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { email, push, frequency, timeZone, lowStockThreshold, expiryThresholdDays } = req.body;
    const notification = await Notification.findOneAndUpdate(
      { userId: req.params.userId },
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
    res.status(400).json({ error: error.message });
  }
});

// Get notification preferences for a user
router.get('/preferences/:userId', async (req, res) => {
  try {
    const notification = await Notification.findOne({ userId: req.params.userId });
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
    res.status(500).json({ error: error.message });
  }
});

// Delete/dismiss a notification
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { status: 'dismissed' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get full notification history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;