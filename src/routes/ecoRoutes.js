const express = require('express');
const router = express.Router();
const { 
  createEcoTip, 
  getEcoTips 
} = require('../controllers/ecoController');
const auth = require('../middleware/auth');

router.post('/', auth, createEcoTip);
router.get('/', auth, getEcoTips);

module.exports = router;