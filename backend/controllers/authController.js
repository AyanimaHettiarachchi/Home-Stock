const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // 🔥 Store JWT in a secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents access from JavaScript (security)
      secure: process.env.NODE_ENV === "production", // Uses HTTPS in production
      sameSite: "Strict" // Prevents CSRF attacks
    }).json({ msg: "Logged in successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.json({ msg: "Logged out successfully" });
};
