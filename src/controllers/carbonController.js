// controllers/carbonController.js
const CarbonFootprint = require('../models/CarbonFootprint');
const User = require('../models/User');

exports.trackCarbonFootprint = async (req, res) => {
  try {
    const { 
      transportation, 
      energyConsumption, 
      wasteDisposal
    } = req.body;

    // Validate input
    if ([transportation, energyConsumption, wasteDisposal].some(val => typeof val !== 'number')) {
      return res.status(400).json({ error: 'Invalid input values' });
    }

    // Calculate total footprint
    const totalFootprint = transportation + energyConsumption + wasteDisposal;

    // Create carbon footprint entry
    const carbonEntry = new CarbonFootprint({
      user: req.user._id,
      transportation,
      energyConsumption,
      wasteDisposal,
      totalFootprint
    });

    await carbonEntry.save();

    res.status(201).json({ 
      message: 'Carbon footprint tracked successfully',
      entry: carbonEntry 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCarbonFootprint = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    // Apply date filtering if dates are provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Fetch carbon footprint entries
    const carbonEntries = await CarbonFootprint.find(filter)
      .sort({ date: -1 });

    // Calculate total footprint
    const totalFootprint = carbonEntries.reduce((sum, entry) => sum + entry.totalFootprint, 0);

    res.json({
      carbonEntries,
      totalFootprint,
      totalEntries: carbonEntries.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};