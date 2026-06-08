const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, language } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, language: language || 'en' });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      language: user.language, plan: user.plan, token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        language: user.language, plan: user.plan, token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name || user.name;
    user.language = req.body.language || user.language;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      language: updated.language, plan: updated.plan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/family
router.post('/family', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.familyMembers.push(req.body);
    await user.save();
    res.status(201).json(user.familyMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/family
router.get('/family', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.familyMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
