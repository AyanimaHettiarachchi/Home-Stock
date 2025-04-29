// backend/models/MealPlan.js
const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  weekStartDate: {
    type: Date,
    required: true,
  },
  meals: {
    monday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    tuesday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    wednesday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    thursday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    friday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    saturday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    sunday: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);