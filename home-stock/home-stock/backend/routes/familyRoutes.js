const express = require("express");
const { createFamilyGroup, joinFamilyGroup } = require("../controllers/familyController");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware

const router = express.Router();

router.post("/create-family-group", createFamilyGroup);
router.post("/join-family", authMiddleware, joinFamilyGroup); // 🛡️ Protected route

module.exports = router;
