const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory'); // Adjust path as needed

// Get all inventory items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await Inventory.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// Create a new inventory item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, expiryDate, category, userId } = req.body;
    const item = new Inventory({
      name,
      quantity,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      category,
      userId,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create inventory item' });
  }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
  try {
    const { name, quantity, expiryDate, category } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    item.name = name;
    item.quantity = quantity;
    item.expiryDate = expiryDate ? new Date(expiryDate) : null;
    item.category = category;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update inventory item' });
  }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

module.exports = router;