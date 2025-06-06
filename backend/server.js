// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Routes
const notificationRoutes = require('./routes/notifications'); // Assuming this exists
const mealRoutes = require('./routes/mealRoutes'); // Assuming this exists
const mealPlansRouter = require('./routes/mealPlans'); // Add this line
const inventoryRoutes = require('./routes/inventoryRoutes');


const feedbackRoutes = require('./routes/feedback'); // Add feedback routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/meal-plans', mealPlansRouter); // Add this line
app.use('/api/feedback', feedbackRoutes); // New route for feedback
app.use('/api/inventory', inventoryRoutes);

// MongoDB Connection
const connectionString = process.env.CONNECTION_STRING;

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
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});