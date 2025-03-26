const Item = require("../models/Item");

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single item
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to generate a unique ID based on category
const generateItemId = (category) => {
  const prefixes = {
    Dairy: "D",
    Vegetables: "V",
    Fruits: "F",
    "Frozen items": "FI",
    Snack: "S",
  };

  const prefix = prefixes[category] || "X"; // Default to 'X' if category not found
  const uniquePart = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `${prefix}-${uniquePart}`;
};

// Create item
const createItem = async (req, res) => {
  try {
    const { name, quantity, category, expiryDate } = req.body;
    
    // Generate unique itemId
    const itemId = generateItemId(category);

    const newItem = new Item({ itemId, name, quantity, category, expiryDate });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update item
const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
