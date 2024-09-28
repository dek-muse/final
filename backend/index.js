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
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
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
// const authRoutes = require('../routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
// const userRouter = require('./routes/userRouter');

// Use Routes
// app.use('/api/auth', authRoutes);
// app.use('/', userRouter);
app.use('/', teacherRoutes);

// Error Handling Middleware
app.use(errorHandler);
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory





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