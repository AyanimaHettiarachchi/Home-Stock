const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Create a new feedback entry
router.post('/', async (req, res) => {
  try {
    const { userName, phoneNumber, feedbackMessage, rating, userId } = req.body;

    // Validate required fields
    if (!userName || !phoneNumber || !feedbackMessage || !rating || !userId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (userName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    if (feedbackMessage.length < 10) {
      return res.status(400).json({ error: 'Feedback message must be at least 10 characters long.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    // Create and save the feedback
    const feedback = new Feedback({
      userName,
      phoneNumber,
      feedbackMessage,
      rating,
      userId,
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get feedback entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const feedbackEntries = await Feedback.find({ userId }).sort({ createdAt: -1 });
    res.json(feedbackEntries);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a feedback entry
router.put('/:id', async (req, res) => {
  try {
    const { userName, phoneNumber, feedbackMessage, rating } = req.body;
    const feedbackId = req.params.id;

    // Validate required fields
    if (!userName || !phoneNumber || !feedbackMessage || !rating) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (userName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    if (feedbackMessage.length < 10) {
      return res.status(400).json({ error: 'Feedback message must be at least 10 characters long.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID format.' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { userName, phoneNumber, feedbackMessage, rating },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    res.json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a feedback entry
router.delete('/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID format.' });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;