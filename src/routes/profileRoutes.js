// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile 
} = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Get user profile
router.get('/', auth, getProfile);

// Update user profile
router.put('/', auth, updateProfile);

module.exports = router;