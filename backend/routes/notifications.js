const express = require('express');
const router = express.Router();
const Preferences = require('../models/Preferences');
const Notification = require('../models/Notification');
const Inventory = require('../models/Inventory'); // Import Inventory model
require('dotenv').config();

// Default values for preferences fields
const defaultPreferences = {
  name: 'User',
  emailNotifications: true,
  push: true,
  frequency: 'daily',
  timeZone: 'UTC',
  lowStockThreshold: 10,
  expiryThresholdDays: 7,
};

// Check inventory for alerts and create notifications
const checkInventoryAlerts = async (userId) => {
  const inventories = await Inventory.find({ userId });
  const preferences = await Preferences.findOne({ userId }) || { ...defaultPreferences, userId };

  for (const item of inventories) {
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    const daysDiff = (expiryDate - today) / (1000 * 60 * 60 * 24);

    // Low stock alert
    if (item.quantity <= preferences.lowStockThreshold) {
      const message = `Low stock alert: ${item.name} (Quantity: ${item.quantity})`;
      await Notification.findOneAndUpdate(
        { userId, itemId: item._id, message, status: 'active' },
        { type: 'low-stock', itemId: item._id, message, status: 'active', userId },
        { upsert: true, new: true }
      );
    }

    // Expiry alert
    if (item.expiryDate && daysDiff <= preferences.expiryThresholdDays && daysDiff > 0) {
      const message = `${item.name} expires on ${expiryDate.toLocaleDateString()}`;
      await Notification.findOneAndUpdate(
        { userId, itemId: item._id, message, status: 'active' },
        { type: 'expiry', itemId: item._id, message, status: 'active', userId },
        { upsert: true, new: true }
      );
    }
  }
};

// Create new notification preferences (POST /api/notifications/preferences)
router.post('/preferences', async (req, res) => {
  try {
    const {
      userId,
      name,
      emailNotifications,
      push,
      frequency,
      timeZone,
      lowStockThreshold,
      expiryThresholdDays,
    } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: 'User ID and name are required.' });
    }
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (lowStockThreshold < 1 || expiryThresholdDays < 1) {
      return res.status(400).json({ error: 'Threshold values must be at least 1.' });
    }

    let preferences = await Preferences.findOne({ userId });
    if (preferences) {
      return res.status(400).json({ error: 'Preferences already exist for this user. Use PUT to update.' });
    }

    preferences = new Preferences({
      userId,
      name,
      emailNotifications: emailNotifications ?? true,
      push: push ?? true,
      frequency: frequency || 'daily',
      timeZone: timeZone || 'UTC',
      lowStockThreshold: lowStockThreshold || 10,
      expiryThresholdDays: expiryThresholdDays || 7,
    });

    await preferences.save();
    res.status(201).json(preferences);
  } catch (error) {
    console.error('Error creating preferences:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get notification preferences (GET /api/notifications/preferences/:userId)
router.get('/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    let preferences = await Preferences.findOne({ userId });

    if (!preferences) {
      preferences = {
        userId,
        ...defaultPreferences,
      };
    }

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update notification preferences (PUT /api/notifications/preferences/:userId)
router.put('/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      name,
      emailNotifications,
      push,
      frequency,
      timeZone,
      lowStockThreshold,
      expiryThresholdDays,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (lowStockThreshold < 1 || expiryThresholdDays < 1) {
      return res.status(400).json({ error: 'Threshold values must be at least 1.' });
    }

    let preferences = await Preferences.findOne({ userId });

    if (!preferences) {
      preferences = new Preferences({
        userId,
        name,
        emailNotifications: emailNotifications ?? true,
        push: push ?? true,
        frequency: frequency || 'daily',
        timeZone: timeZone || 'UTC',
        lowStockThreshold: lowStockThreshold || 10,
        expiryThresholdDays: expiryThresholdDays || 7,
      });
    } else {
      preferences.name = name;
      preferences.emailNotifications = emailNotifications ?? preferences.emailNotifications;
      preferences.push = push ?? preferences.push;
      preferences.frequency = frequency || preferences.frequency;
      preferences.timeZone = timeZone || preferences.timeZone;
      preferences.lowStockThreshold = lowStockThreshold || preferences.lowStockThreshold;
      preferences.expiryThresholdDays = expiryThresholdDays || preferences.expiryThresholdDays;
    }

    await preferences.save();
    res.json(preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete notification preferences (DELETE /api/notifications/preferences/:userId)
router.delete('/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Preferences.findOneAndDelete({ userId });

    if (!result) {
      return res.status(404).json({ error: 'Preferences not found for this user.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get active notifications for a user (GET /api/notifications/:userId)
router.get('/:userId', async (req, res) => {
  try {
    await checkInventoryAlerts(req.params.userId); // Generate alerts based on inventory
    const notifications = await Notification.find({ userId: req.params.userId, status: 'active' }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get notification history for a user (GET /api/notifications/history/:userId)
router.get('/history/:userId', async (req, res) => {
  try {
    await checkInventoryAlerts(req.params.userId); // Generate alerts based on inventory
    const history = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
});

// Create a new notification (POST /api/notifications/)
router.post('/', async (req, res) => {
  try {
    const { type, itemId, message, userId } = req.body;

    if (!type || !message || !userId) {
      return res.status(400).json({ error: 'Type, message, and userId are required.' });
    }

    const notification = new Notification({
      type,
      itemId,
      message,
      userId,
    });

    await notification.save();

    const preferences = await Preferences.findOne({ userId });
    if (preferences && preferences.push) {
      console.log(`Push notification sent to user ${userId}: ${message}`);
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a notification (PUT /api/notifications/:id)
router.put('/:id', async (req, res) => {
  try {
    const { message, status } = req.body;
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    notification.message = message || notification.message;
    notification.status = status || notification.status;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a notification (DELETE /api/notifications/:id)
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    await notification.deleteOne();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;