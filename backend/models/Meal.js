const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealId: { type: String, required: true, unique: true }, // Add mealId field
  userName: { type: String }, // Add userName field (optional)
  email: { type: String }, // Add email field (optional)
  mealName: { type: String, required: true },
  mealType: { 
    type: String, 
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    required: true
  },
  calories: { type: Number, required: true },
  ingredients: { type: String, required: true },
  day: { type: String, required: true }, // Changed to a string to accept "YYYY-MM-DD"
});

module.exports = mongoose.model("Meal", mealSchema);