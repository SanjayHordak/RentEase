const express = require('express');
const router = express.Router();
const { getUserProfile, createUserProfile } = require('../controllers/userController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// GET /api/users/me — Retrieve authenticated user's MongoDB profile
router.get('/me', verifyFirebaseToken, getUserProfile);

// POST /api/users — Create a new profile (role required) or return existing one
router.post('/', verifyFirebaseToken, createUserProfile);

module.exports = router;
