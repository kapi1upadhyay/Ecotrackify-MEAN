const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  joinGroup, 
  sendMessage,
  getGroupMessages
} = require('../controllers/groupController');
const auth = require('../middleware/auth');

router.post('/', auth, createGroup);
router.post('/:groupId/join', auth, joinGroup);
router.post('/:groupId/messages', auth, sendMessage);
router.get('/:groupId/messages', auth, getGroupMessages);

module.exports = router;