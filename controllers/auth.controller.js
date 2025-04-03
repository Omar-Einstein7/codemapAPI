const User = require('../models/user.model');
const { generateToken } = require('../config/jwt');
const { validateRegistration } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/response');
const { AppError } = require('../utils/errorHandler');

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    validateRegistration(username, email, password);

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    successResponse(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    successResponse(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}; 