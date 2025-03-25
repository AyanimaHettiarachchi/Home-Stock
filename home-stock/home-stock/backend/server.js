const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend to send cookies

connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/family", require("./routes/familyRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));


app.get("/", (req, res) => {
  res.send("Social Media Authentication API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
