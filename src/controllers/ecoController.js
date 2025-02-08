const EcoTip = require('../models/EcoTip');

exports.createEcoTip = async (req, res) => {
  try {
    const { tip } = req.body;

    // Validate tip
    if (!tip || !tip.content || tip.content.trim().length < 5) {
      return res.status(400).json({ error: 'Invalid tip content' });
    }

    // Create eco tip
    const ecoTip = new EcoTip({
      user: req.user._id,
      content: tip.content,
      category: tip.category || 'general'
    });

    await ecoTip.save();

    res.status(201).json({ 
      message: 'Tip shared successfully',
      tip: {
        id: ecoTip._id,
        content: ecoTip.content,
        category: ecoTip.category
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEcoTips = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = {};
    if (category) filter.category = category;

    const tips = await EcoTip.find(filter).sort({ createdAt: -1 });

    res.json({ 
      tips: tips.map(tip => ({
        id: tip._id,
        content: tip.content,
        category: tip.category
      })),
      totalTips: tips.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};