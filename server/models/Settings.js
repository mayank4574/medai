const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  appearance: {
    theme: { type: String, default: 'light', enum: ['light', 'dark', 'system', 'auto'] },
    accentColor: { type: String, default: 'blue', enum: ['blue', 'green', 'orange', 'purple', 'red', 'gray'] },
    fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
    layout: { type: String, default: 'comfortable', enum: ['comfortable', 'compact'] }
  },
  notifications: {
    email: {
      accountUpdates: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
      newsUpdates: { type: Boolean, default: false }
    },
    push: {
      generalAlerts: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
