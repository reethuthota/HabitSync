const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // username must be unique!
    trim: true,
    lowercase: true, // usernames are easier lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Password length requirement
  },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash password before saving to the database
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT token method
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = mongoose.model('User', userSchema);
