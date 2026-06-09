const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  language: { type: String, default: 'en' },
  phone: { type: String },
  avatar: { type: String },
  bio: { type: String },
  plan: { type: String, default: 'free', enum: ['free', 'premium'] },
  reportsThisMonth: { type: Number, default: 0 },
  familyMembers: [{
    name: String,
    relation: String,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] }
  }],
  isTwoFactorEnabled: { type: Boolean, default: false },
  twoFactorOTP: { type: String },
  twoFactorOTPExpires: { type: Date },
  sessions: [{
    device: String,
    ip: String,
    lastActive: Date,
    token: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
