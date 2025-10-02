const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Badge name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Badge description cannot be more than 200 characters']
  },
  pointsRequired: {
    type: Number,
    required: true,
    min: 0
  },
  icon: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
badgeSchema.index({ key: 1 });
badgeSchema.index({ pointsRequired: 1 });

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;