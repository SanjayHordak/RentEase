const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      '\n======================================================\n' +
      'ERROR: MONGODB_URI is not set in environment variables.\n' +
      'Please add it to your .env file.\n' +
      '======================================================\n'
    );
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure so a process manager can restart it
  }
};

module.exports = connectDB;
