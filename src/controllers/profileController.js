// controllers/profileController.js
const User = require('../models/User');
const CarbonFootprint = require('../models/CarbonFootprint');
const SustainabilityGoal = require('../models/SustainabilityGoal');

exports.getProfile = async (req, res) => {
  try {
    // Fetch additional profile data
    const carbonFootprints = await CarbonFootprint.find({ user: req.user._id });
    const goals = await SustainabilityGoal.find({ user: req.user._id });

    const profile = {
      email: req.user.email,
      userType: req.user.userType,
      profile: req.user.profile,
      carbonFootprint: {
        total: carbonFootprints.reduce((sum, entry) => sum + entry.totalFootprint, 0),
        entries: carbonFootprints.length
      },
      sustainabilityGoals: goals.map(goal => ({
        category: goal.category,
        title: goal.title,
        progress: goal.progress
      }))
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, profile } = req.body;

    // Email validation
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check email uniqueness
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      req.user.email = email;
    }

    // Update profile
    if (profile) {
      req.user.profile = { ...req.user.profile, ...profile };
    }

    await req.user.save();

    res.json({ 
      message: 'Profile updated successfully',
      profile: req.user.profile 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};