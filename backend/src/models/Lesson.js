const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  q: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  answerIndex: {
    type: Number,
    required: true,
    min: 0
  }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contentMarkdown: {
    type: String,
    required: true
  },
  durationMins: {
    type: Number,
    required: true,
    min: 1
  },
  quiz: [quizQuestionSchema],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
lessonSchema.index({ slug: 1 });
lessonSchema.index({ tags: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;