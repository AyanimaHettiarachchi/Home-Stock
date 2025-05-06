const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  category: {
    type: String,
    enum: ['Food', 'Beverage', 'Household', 'Personal Care', 'Other'],
    default: 'Other',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` on save
inventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
inventorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Inventory', inventorySchema);