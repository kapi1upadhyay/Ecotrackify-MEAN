const mongoose = require('mongoose');

const SustainabilityGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['energy', 'transportation', 'waste', 'water', 'general'],
    required: true
  },
  initialData: {
    type: Number,
    default: 0,
    min: 0
  },
  target: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  }
}, { timestamps: true });

// Pre-save middleware for progress calculation
SustainabilityGoalSchema.pre('save', function(next) {
  const now = new Date();
  
  // Check if goal's date is in the future
  if (this.date > now) {
    this.status = 'pending';
    this.progress = 0;
  } else {
    // Calculate progress for active goals
    if (this.target > 0) {
      this.progress = Math.min(
        Math.round((this.initialData / this.target) * 100), 
        100
      );
      
      this.status = this.progress >= 100 ? 'completed' : 'active';
    }
  }
  
  next();
});

module.exports = mongoose.model('SustainabilityGoal', SustainabilityGoalSchema);