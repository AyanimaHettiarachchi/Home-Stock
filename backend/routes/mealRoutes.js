const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

// Create Meal
router.post("/", async (req, res) => {
  try {
    const meal = new Meal(req.body);
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all Meals
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Meal
router.put("/:id", async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMeal) return res.status(404).json({ error: "Meal not found" });
    res.status(200).json(updatedMeal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Meal
router.delete("/:id", async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedMeal) return res.status(404).json({ error: "Meal not found" });
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;