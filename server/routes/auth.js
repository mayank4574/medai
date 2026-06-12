const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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

    const token = generateToken(new mongoose.Types.ObjectId()); // placeholder before user creation?
    // Actually, create user first, then add session
    const user = await User.create({ name, email, password, language: language || 'en' });
    const realToken = generateToken(user._id);
    
    user.sessions.push({
      device: req.headers['user-agent'] || 'Unknown Device',
      ip: req.ip || '127.0.0.1',
      lastActive: new Date(),
      token: realToken
    });
    await user.save();

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      language: user.language, plan: user.plan, avatar: user.avatar, token: realToken
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
      const token = generateToken(user._id);
      user.sessions.push({
        device: req.headers['user-agent'] || 'Unknown Device',
        ip: req.ip || '127.0.0.1',
        lastActive: new Date(),
        token: token
      });
      await user.save();

      res.json({
        _id: user._id, name: user.name, email: user.email,
        language: user.language, plan: user.plan, avatar: user.avatar, token: token
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

const multer = require('multer');
const path = require('path');
const { uploadImageToCloudinary } = require('../services/cloudinaryService');

// Configure multer to use memory storage and validate files
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.'), false);
  }
};
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter 
});

// PUT /api/auth/profile
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    console.log('[DEBUG /profile] req.body:', req.body);
    console.log('[DEBUG /profile] req.file:', req.file ? 'Present' : 'None');

    // Check if updating password requires current password
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      if (req.body.newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters' });
      }
      user.password = req.body.newPassword;
      console.log(`[SECURITY] User ${user.email} successfully updated their password.`);
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.language = req.body.language || user.language;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    
    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ message: 'Cloudinary is not configured' });
      }
      try {
        const result = await uploadImageToCloudinary(req.file.buffer);
        user.avatar = result.secure_url;
      } catch (uploadError) {
        console.error('[Cloudinary Upload Error]:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload image to Cloudinary.', 
          details: uploadError.message || 'Unknown Cloudinary Error'
        });
      }
    }

    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      language: updated.language, phone: updated.phone, bio: updated.bio, 
      plan: updated.plan, avatar: updated.avatar,
      isTwoFactorEnabled: updated.isTwoFactorEnabled
    });
  } catch (error) {
    console.error('[CRITICAL] /profile Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/2fa/enable
router.post('/2fa/enable', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorOTP = otp;
    user.twoFactorOTPExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();
    
    console.log(`\n==============================================`);
    console.log(`[DEVELOPMENT] 2FA OTP for ${user.email}: ${otp}`);
    console.log(`==============================================\n`);
    
    res.json({ message: 'OTP generated and logged to server console.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/2fa/verify
router.post('/2fa/verify', protect, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.twoFactorOTP || user.twoFactorOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.twoFactorOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    user.isTwoFactorEnabled = true;
    user.twoFactorOTP = undefined;
    user.twoFactorOTPExpires = undefined;
    await user.save();
    res.json({ message: '2FA enabled successfully', isTwoFactorEnabled: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/2fa/disable
router.post('/2fa/disable', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isTwoFactorEnabled = false;
    await user.save();
    res.json({ message: '2FA disabled successfully', isTwoFactorEnabled: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/sessions
router.get('/sessions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const sessions = user.sessions.map(s => ({
      id: s._id,
      device: s.device,
      ip: s.ip,
      lastActive: s.lastActive,
      isCurrent: s.token === req.token
    }));
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/auth/sessions/:id
router.delete('/sessions/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.sessions = user.sessions.filter(s => s._id.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Session logged out successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/logout-all
router.post('/logout-all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Keep only the current session
    user.sessions = user.sessions.filter(s => s.token === req.token);
    await user.save();
    res.json({ message: 'Logged out from all other devices successfully.' });
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

// DELETE /api/auth/family/:id
router.delete('/family/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.familyMembers = user.familyMembers.filter(m => m._id.toString() !== req.params.id);
    await user.save();
    res.json(user.familyMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
