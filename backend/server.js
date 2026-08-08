require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());                  // Allow Cross-Origin requests
app.use(express.json());          // Parse incoming JSON bodies
app.use(morgan('dev'));           // Log HTTP requests

// Base Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'RentEase Backend API is running' });
});

const { db, admin } = require('./firebaseAdmin');

// API Route for creating a user in Firestore
app.post('/api/users', async (req, res) => {
  const { uid, email, name } = req.body;
  
  if (!uid || !email) {
    return res.status(400).json({ success: false, message: 'UID and Email are required' });
  }

  if (!db) {
    return res.status(500).json({ success: false, message: 'Database not initialized (missing serviceAccountKey.json)' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      await userRef.set({
        uid,
        email,
        name: name || 'User',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('User saved to Firestore from Backend');
    }
    
    res.status(201).json({
      success: true,
      message: 'User processed successfully'
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: 'Error saving user', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
