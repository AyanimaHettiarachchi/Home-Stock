const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['low-stock', 'expiry'],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item', // Reference to an Item model (if implemented by your team)
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'dismissed'],
    default: 'active',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model (if implemented by your team)
    required: true,
  },
  preferences: {
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'instant'],
      default: 'daily',
    },
    timeZone: {
      type: String,
      default: 'UTC',
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    expiryThresholdDays: {
      type: Number,
      default: 7,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Add an index for better query performance on userId and status
notificationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);