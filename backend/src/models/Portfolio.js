const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  qty: {
    type: Number,
    required: true,
    min: 0
  },
  entryPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  positions: [positionSchema],
  cash: {
    type: Number,
    default: 0,
    min: 0
  },
  history: [{
    type: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes
portfolioSchema.index({ userId: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;