const mongoose = require("mongoose");

const FamilyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  familyCode: { type: String, unique: true, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sharedPassword: { type: String, required: true },
});

// Function to generate a unique 4-digit code
async function generateUniqueCode() {
  let code;
  let existingGroup;
  
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit number
    existingGroup = await mongoose.model("FamilyGroup").findOne({ familyCode: code });
  } while (existingGroup); // Ensure uniqueness

  return code;
}

// Pre-save hook to assign a unique familyCode
FamilyGroupSchema.pre("save", async function (next) {
  if (!this.familyCode) {
    this.familyCode = await generateUniqueCode();
  }
  next();
});

module.exports = mongoose.model("FamilyGroup", FamilyGroupSchema);
