const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model("Item", itemSchema);
