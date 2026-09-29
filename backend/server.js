require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./db/connection');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());                  // Allow Cross-Origin requests
app.use(express.json());          // Parse incoming JSON bodies
app.use(morgan('dev'));          // Log HTTP requests

// Base Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'RentEase Backend API is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/v1/properties',propertyRoutes);

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
