const express = require('express');
const router = express.Router();
const Preferences = require('../models/Preferences');
const Notification = require('../models/Notification');
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

    // Validate required fields
    if (!userId || !name) {
      return res.status(400).json({ error: 'User ID and name are required.' });
    }
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (lowStockThreshold < 1 || expiryThresholdDays < 1) {
      return res.status(400).json({ error: 'Threshold values must be at least 1.' });
    }

    // Check if preferences already exist
    let preferences = await Preferences.findOne({ userId });
    if (preferences) {
      return res.status(400).json({ error: 'Preferences already exist for this user. Use PUT to update.' });
    }

    // Create new preferences
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
      // If no preferences exist, return default values
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

    // Validate required fields
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
      // If no preferences exist, create new ones
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
      // Update existing preferences
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

// Create a new notification (POST /api/notifications/)
router.post('/', async (req, res) => {
  try {
    const { name, message, category, userId } = req.body;

    if (!name || !message || !category || !userId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const preferences = await Preferences.findOne({ userId });
    if (!preferences) {
      return res.status(404).json({ error: 'User preferences not found.' });
    }

    const notification = new Notification({
      name,
      message,
      category,
      userId,
    });

    await notification.save();

    // Since emailAddress is removed, we'll assume notifications are sent via push or other means
    if (preferences.push) {
      console.log(`Push notification sent to user ${userId}: ${message}`);
      // In a real app, you'd integrate with a push notification service here
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;