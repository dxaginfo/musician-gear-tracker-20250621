const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'musician-gear-tracker-secret',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      name,
      role: 'musician' // Default role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    // User is already available in req.user from auth middleware
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      });
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Update password if provided
      if (req.body.password) {
        user.passwordHash = req.body.password;
      }

      // Update preferences if provided
      if (req.body.preferences) {
        // Merge with existing preferences
        if (req.body.preferences.notificationSettings) {
          user.preferences.notificationSettings = {
            ...user.preferences.notificationSettings.toObject(),
            ...req.body.preferences.notificationSettings
          };
        }
        
        if (req.body.preferences.defaultCategories) {
          user.preferences.defaultCategories = req.body.preferences.defaultCategories;
        }
        
        if (req.body.preferences.displayOptions) {
          user.preferences.displayOptions = {
            ...user.preferences.displayOptions.toObject(),
            ...req.body.preferences.displayOptions
          };
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        preferences: updatedUser.preferences,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};