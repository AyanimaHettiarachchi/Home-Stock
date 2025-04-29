const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['low-stock', 'expiry'],
    required: true,
  },
  itemId: {
    type: String, // Changed from ObjectId to String
    ref: 'Item', // Still references Item, but as a string
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
    ref: 'User',
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

notificationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);