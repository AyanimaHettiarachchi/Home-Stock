const mongoose = require("mongoose");

const FamilyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  familyCode: { type: String, unique: true, required: true },
  sharedPassword: { type: String, required: true },
});

// Function to Generate Unique Family Code
const generateUniqueCode = async function () {
  let code;
  let exists;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit random code
    exists = await mongoose.model("FamilyGroup").findOne({ familyCode: code });
  } while (exists);
  return code;
};

// Ensure familyCode is set before saving
FamilyGroupSchema.pre("validate", async function (next) {
  if (!this.familyCode) {
    this.familyCode = await generateUniqueCode();
  }
  next();
});

module.exports = mongoose.model("FamilyGroup", FamilyGroupSchema);
