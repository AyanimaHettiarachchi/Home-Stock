const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealName: { type: String, required: true },
  mealType: { 
    type: String, 
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    required: true
  },
  calories: { type: Number, required: true },
  ingredients: { type: String, required: true },
  day: { 
    type: String, 
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true
  }
});

module.exports = mongoose.model("Meal", mealSchema);