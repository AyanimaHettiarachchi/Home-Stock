const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FamilyGroup = require("../models/FamilyGroup");
const { validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET;

// Create Family Group
exports.createFamilyGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, sharedPassword } = req.body;

  try {
    let familyGroup = await FamilyGroup.findOne({ name });
    if (familyGroup) return res.status(400).json({ msg: "Family group already exists" });

    const hashedPassword = await bcrypt.hash(sharedPassword, 10);

    // Create the new family group with a unique familyCode
    familyGroup = new FamilyGroup({ name, sharedPassword: hashedPassword });

    await familyGroup.save();

    res.json({ msg: "Family group created successfully", familyCode: familyGroup.familyCode });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


// Join Family Group
exports.joinFamilyGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { familyCode, sharedPassword } = req.body;

  try {
    const familyGroup = await FamilyGroup.findOne({ familyCode });
    if (!familyGroup) return res.status(400).json({ msg: "Family group not found" });

    const isMatch = await bcrypt.compare(sharedPassword, familyGroup.sharedPassword);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // Generate JWT for the family group (this could be for the person joining)
    const token = jwt.sign({ id: familyGroup.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ msg: "Joined the family group successfully", familyGroup, token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Family Logout (optional, for consistency in case you want to implement blacklisting)
exports.logoutFamilyGroup = (req, res) => {
  // Since JWT is stateless, the logout action is performed on the client-side by clearing the token
  // Here, we just send a success response for consistency
  res.json({ msg: "Logged out successfully from family group" });
};
