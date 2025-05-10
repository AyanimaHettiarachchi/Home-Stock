const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 2,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  feedbackMessage: {
    type: String,
    required: true,
    minlength: 10,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

feedbackSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);