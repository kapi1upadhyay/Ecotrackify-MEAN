const express = require('express');
const router = express.Router();
const { 
  createGoal, 
  getGoals, 
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');
const auth = require('../middleware/auth');

router.post('/', auth, createGoal);
router.get('/', auth, getGoals);
router.put('/:goalId', auth, updateGoal);
router.delete('/:goalId', auth, deleteGoal);

module.exports = router;