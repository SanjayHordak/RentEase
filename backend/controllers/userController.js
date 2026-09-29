const User = require('../models/User');

// Retrieve authenticated user's MongoDB profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// Create a new profile (role required) or return existing one
const createUserProfile = async (req, res) => {
  const { name, role, profileImage } = req.body;
  const { uid, email } = req.user;

  try {
    let user = await User.findOne({ uid });

    // Existing user — return their profile without requiring role
    if (user) {
      return res.status(200).json({ success: true, user });
    }

    // New user — role is mandatory for creation
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required for new users' });
    }

    user = await User.create({
      uid,
      email,
      name: name || 'User',
      role,
      profileImage: profileImage || '',
    });
    console.log('User saved to MongoDB');

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: 'Error saving user' });
  }
};

module.exports = {
  getUserProfile,
  createUserProfile
};
