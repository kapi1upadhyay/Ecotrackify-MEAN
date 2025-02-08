// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;