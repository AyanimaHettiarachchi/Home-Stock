const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust to match your frontend port (e.g., 3000 if using CRA)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Routes
const notificationRoutes = require('./routes/notifications'); // Assuming this exists
const mealRoutes = require('./routes/mealRoutes');

app.use('/api/notifications', notificationRoutes);
app.use('/api/meals', mealRoutes);

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