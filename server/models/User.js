const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  language: { type: String, default: 'en', enum: ['en', 'hi', 'ja', 'ta', 'te', 'bn', 'mr'] },
  phone: { type: String },
  avatar: { type: String },
  plan: { type: String, default: 'free', enum: ['free', 'premium'] },
  reportsThisMonth: { type: Number, default: 0 },
  familyMembers: [{
    name: String,
    relation: String,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] }
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
