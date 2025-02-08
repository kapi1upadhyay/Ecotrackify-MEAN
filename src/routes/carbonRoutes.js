// routes/carbonRoutes.js
const express = require('express');
const router = express.Router();
const { 
  trackCarbonFootprint, 
  getCarbonFootprint 
} = require('../controllers/carbonController');
const auth = require('../middleware/auth');

// Track carbon footprint
router.post('/', auth, trackCarbonFootprint);

// Get carbon footprint entries
router.get('/', auth, getCarbonFootprint);

module.exports = router;