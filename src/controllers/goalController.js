const SustainabilityGoal = require('../models/SustainabilityGoal');

exports.createGoal = async (req, res) => {
  try {
    const { goal, category, initialData, target, date } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      return res.status(400).json({ error: 'Date is required and must be in YYYY-MM-DD format' });
    }

    const newGoal = new SustainabilityGoal({
      user: req.user._id,
      goal,
      category,
      initialData: initialData || 0,
      target,
      date: new Date(date)
    });

    await newGoal.save();

    res.status(201).json({ 
      message: 'Goal created successfully',
      goal: {
        id: newGoal._id,
        goal: newGoal.goal,
        category: newGoal.category,
        initialData: newGoal.initialData,
        target: newGoal.target,
        date: newGoal.date.toISOString().split('T')[0],
        progress: newGoal.progress,
        status: newGoal.status
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const { category, status } = req.query;
    const now = new Date();
    
    const filter = { 
      user: req.user._id,
      // Ensure the goal's date is not in the future
      date: { $lte: now }
    };
    
    if (category) filter.category = category;
    if (status) filter.status = status;

    const goals = await SustainabilityGoal.find(filter);

    // Check if any queried goals are in the future
    const futureGoals = await SustainabilityGoal.find({
      user: req.user._id,
      date: { $gt: now }
    });

    if (futureGoals.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot view progress for future goals',
        futureGoalsCount: futureGoals.length
      });
    }

    res.json({ 
      goals: goals.map(goal => ({
        id: goal._id,
        goal: goal.goal,
        category: goal.category,
        initialData: goal.initialData,
        target: goal.target,
        date: goal.date.toISOString().split('T')[0],
        progress: goal.progress,
        status: goal.status
      })),
      totalGoals: goals.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { goal, category, initialData, target, date } = req.body;

    // Validate date format if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (date && !dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const updateData = { 
      ...(goal && { goal }),
      ...(category && { category }),
      ...(initialData !== undefined && { initialData }),
      ...(target !== undefined && { target }),
      ...(date && { date: new Date(date) })
    };

    const updatedGoal = await SustainabilityGoal.findOneAndUpdate(
      { _id: goalId, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ 
      message: 'Goal updated successfully',
      goal: {
        id: updatedGoal._id,
        goal: updatedGoal.goal,
        category: updatedGoal.category,
        initialData: updatedGoal.initialData,
        target: updatedGoal.target,
        date: updatedGoal.date.toISOString().split('T')[0],
        progress: updatedGoal.progress,
        status: updatedGoal.status
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const deletedGoal = await SustainabilityGoal.findOneAndDelete({ 
      _id: goalId, 
      user: req.user._id 
    });

    if (!deletedGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ 
      message: 'Goal deleted successfully',
      goal: {
        id: deletedGoal._id,
        goal: deletedGoal.goal
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};