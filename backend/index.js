const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Connect to Database
mongoose.connect(process.env.MONGO, {
  // Removed deprecated options
  serverSelectionTimeoutMS: 5000, // Adjust as needed
  socketTimeoutMS: 45000, // Adjust as needed
})
  .then(() => {
    console.log('Database connection successful 🤞');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with failure
  });

// Import Routes
const teacherRoutes = require('./routes/teacherRoutes');

// Use Routes
app.use('/', teacherRoutes);


// Error Handling Middleware
app.use(errorHandler);

// Custom error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Define the port
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
