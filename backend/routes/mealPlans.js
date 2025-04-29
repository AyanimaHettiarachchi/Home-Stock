// backend/routes/mealPlans.js
const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');

// GET all meal plans
router.get('/', async (req, res) => {
  try {
    const mealPlans = await MealPlan.find();
    res.json(mealPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single meal plan by ID
router.get('/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
    res.json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new meal plan
router.post('/', async (req, res) => {
  const mealPlan = new MealPlan({
    weekStartDate: req.body.weekStartDate,
    meals: req.body.meals,
  });

  try {
    const newMealPlan = await mealPlan.save();
    res.status(201).json(newMealPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a meal plan
router.put('/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });

    mealPlan.weekStartDate = req.body.weekStartDate || mealPlan.weekStartDate;
    mealPlan.meals = req.body.meals || mealPlan.meals;

    const updatedMealPlan = await mealPlan.save();
    res.json(updatedMealPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a meal plan
router.delete('/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });

    await mealPlan.deleteOne();
    res.json({ message: 'Meal plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;