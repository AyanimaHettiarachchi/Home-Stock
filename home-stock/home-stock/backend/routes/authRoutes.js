const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [body("email", "Enter a valid email").isEmail(), body("password", "Password is required").exists()],
  login
);

module.exports = router;
