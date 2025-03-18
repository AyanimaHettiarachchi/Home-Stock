const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust to match your frontend port (e.g., Vite default)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies/auth credentials if needed
}));

// Routes
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// MongoDB Connection
const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Server Port
const port = 7001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});