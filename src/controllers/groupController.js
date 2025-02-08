const Group = require('../models/Group');
const Message = require('../models/Message');

exports.createGroup = async (req, res) => {
  try {
    const { name, description, category, privacy } = req.body;

    const group = new Group({
      name,
      description,
      category,
      admin: req.user._id,
      members: [req.user._id],
      privacy: privacy || 'public'
    });

    await group.save();

    res.status(201).json({
      message: 'Group created successfully',
      group: {
        id: group._id,
        name: group.name,
        category: group.category,
        privacy: group.privacy
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Prevent duplicate membership
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already a group member' });
    }

    // Check group privacy
    if (group.privacy === 'private') {
      return res.status(403).json({ error: 'Cannot join private group' });
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({
      message: 'Joined group successfully',
      group: {
        id: group._id,
        name: group.name,
        members: group.members.length
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    // Verify group membership
    const group = await Group.findById(groupId);
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not a group member' });
    }

    const message = new Message({
      sender: req.user._id,
      group: groupId,
      content
    });

    await message.save();

    res.status(201).json({
      message: 'Message sent successfully',
      messageDetails: {
        id: message._id,
        content: message.content
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Verify group membership
    const group = await Group.findById(groupId);
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not a group member' });
    }

    const messages = await Message.find({ group: groupId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'email');

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: msg.sender.email,
        createdAt: msg.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};