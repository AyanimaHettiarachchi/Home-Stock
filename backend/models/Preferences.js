const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true, default: 'User' },
  emailNotifications: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  frequency: { type: String, default: 'daily' },
  timeZone: { type: String, default: 'UTC' },
  lowStockThreshold: { type: Number, default: 10 },
  expiryThresholdDays: { type: Number, default: 7 },
});

module.exports = mongoose.model('Preferences', preferencesSchema);