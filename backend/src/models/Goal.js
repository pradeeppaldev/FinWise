const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  monthlyContribution: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'archived'],
    default: 'not-started'
  }
}, {
  timestamps: true
});

// Indexes
goalSchema.index({ userId: 1 });
goalSchema.index({ status: 1 });
goalSchema.index({ deadline: 1 });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;