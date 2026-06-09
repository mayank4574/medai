const express = require('express');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to ensure settings exist
const getOrCreateSettings = async (userId) => {
  let settings = await Settings.findOne({ userId });
  if (!settings) {
    settings = await Settings.create({ userId });
  }
  return settings;
};

// GET /api/settings
router.get('/', protect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings(req.user._id);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/settings/notifications
router.put('/notifications', protect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings(req.user._id);
    if (req.body.email) settings.notifications.email = { ...settings.notifications.email, ...req.body.email };
    if (req.body.push) settings.notifications.push = { ...settings.notifications.push, ...req.body.push };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/settings/appearance
router.put('/appearance', protect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings(req.user._id);
    settings.appearance = { ...settings.appearance, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/settings/support
router.post('/support', protect, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    
    // Import here to avoid circular dependency issues if any, or at the top
    const SupportTicket = require('../models/SupportTicket');
    const ticket = await SupportTicket.create({
      userId: req.user._id,
      subject,
      message
    });
    
    res.status(201).json({ message: 'Support ticket submitted successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
