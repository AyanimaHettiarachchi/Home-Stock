// familyRoutes.js
const express = require("express");
const { body } = require("express-validator");
const { createFamilyGroup, joinFamilyGroup, logoutFamilyGroup } = require("../controllers/familyController");

const router = express.Router();

// Create Family Group
router.post(
  "/create-family-group",
  [
    body("name", "Name is required").notEmpty(),
    body("sharedPassword", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  createFamilyGroup
);

// Join Family Group
router.post(
  "/join-family",
  [
    body("familyCode", "Family code is required").notEmpty(),
    body("sharedPassword", "Password is required").exists(),
  ],
  joinFamilyGroup
);

// Family Logout (optional)
router.post("/logout", logoutFamilyGroup);

module.exports = router;
