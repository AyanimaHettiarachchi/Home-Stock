const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
<<<<<<< Updated upstream
app.use(cors({
  origin: 'http://localhost:5173', // Adjust to match your frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
=======
app.use(cookieParser()); // Enable cookie parsing
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend to send cookies

connectDB();
>>>>>>> Stashed changes

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/family", require("./routes/familyRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));


<<<<<<< Updated upstream
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Server Port
const port = 7001;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
=======
app.get("/", (req, res) => {
  res.send("Social Media Authentication API Running");
>>>>>>> Stashed changes
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
