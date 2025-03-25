const bcrypt = require("bcryptjs");
const FamilyGroup = require("../models/FamilyGroup");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware"); // Import middleware

exports.createFamilyGroup = async (req, res) => {
  const { name, sharedPassword } = req.body;

  try {
    // Generate a unique 4-digit family code
    let familyCode;
    let codeExists = true;
    while (codeExists) {
      familyCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
      codeExists = await FamilyGroup.findOne({ familyCode }); // Ensure it's unique
    }

    const hashedPassword = await bcrypt.hash(sharedPassword, 10);
    const familyGroup = new FamilyGroup({
      name,
      sharedPassword: hashedPassword,
      familyCode, // Save the generated code
      members: [],
    });

    await familyGroup.save();
    res.status(201).json({ msg: "Family group created", familyCode }); // ✅ Return 4-digit code
  } catch (err) {
    console.error("Error creating family group:", err); // ✅ Log error
    res.status(500).json({ msg: "Server Error" });
  }
};



exports.joinFamilyGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { familyCode, sharedPassword } = req.body; // Accept 4-digit code

    const familyGroup = await FamilyGroup.findOne({ familyCode }); // Find by code
    if (!familyGroup) return res.status(404).json({ msg: "Family group not found" });

    const isMatch = await bcrypt.compare(sharedPassword, familyGroup.sharedPassword);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect shared password" });

    familyGroup.members.push(userId);
    await familyGroup.save();
    await User.findByIdAndUpdate(userId, { familyGroup: familyGroup._id });

    res.json({ msg: "Joined family group successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

