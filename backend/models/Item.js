const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: { type: String, unique: true, required: true }, // Unique ID based on category
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model("Item", itemSchema);
