const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Matches the string userId used in NotificationSettings.jsx
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);