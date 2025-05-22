const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // You can create the User model later
  },
  name: {
    type: String,
    required: true
  },
  frequency: {
    type: [String], // Array of weekdays
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  frequencyLabel: {
    type: String,
    enum: ['daily', 'weekly', 'weekdays', 'weekends', 'custom'],
    default: 'custom'
  },
  streak: {
    type: Number,
    default: 0
  },
  logs: {
    type: [Date], // Array of Date objects to store logs for each day the habit is logged
    default: [],
  },
  lastLogged: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  accountabilityPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: false,
  }
  
});

module.exports = mongoose.model('Habit', habitSchema);
