// models/CarbonFootprint.js
const mongoose = require('mongoose');

const CarbonFootprintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  transportation: {
    type: Number,
    required: true,
    min: 0
  },
  energyConsumption: {
    type: Number,
    required: true,
    min: 0
  },
  wasteDisposal: {
    type: Number,
    required: true,
    min: 0
  },
  totalFootprint: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// Calculate total carbon footprint
CarbonFootprintSchema.methods.calculateTotalFootprint = function() {
  return this.transportation + this.energyConsumption + this.wasteDisposal;
};

module.exports = mongoose.model('CarbonFootprint', CarbonFootprintSchema);