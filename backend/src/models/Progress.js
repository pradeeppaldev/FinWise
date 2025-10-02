const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
progressSchema.index({ userId: 1 });
progressSchema.index({ lessonId: 1 });
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;