const mongoose = require('mongoose');

const EcoTipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['energy', 'transportation', 'waste', 'recycling', 'water', 'general'],
    default: 'general'
  }
}, { timestamps: true });

module.exports = mongoose.model('EcoTip', EcoTipSchema);