const BaseController = require('../BaseController');
const { Lesson, Progress, User, Badge } = require('../../models');

class LearningController extends BaseController {
  // Get all lessons
  async getLessons(req, res) {
    try {
      const lessons = await Lesson.find({}, 'title slug durationMins tags')
        .sort({ createdAt: -1 });

      this.sendSuccess(res, lessons);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch lessons');
    }
  }

  // Get lesson by slug
  async getLessonBySlug(req, res) {
    try {
      const lesson = await Lesson.findOne({ slug: req.params.slug });

      if (!lesson) {
        return this.sendNotFound(res, 'Lesson not found');
      }

      this.sendSuccess(res, lesson);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch lesson');
    }
  }

  // Complete a lesson
  async completeLesson(req, res) {
    try {
      const lesson = await Lesson.findById(req.params.id);
      if (!lesson) {
        return this.sendNotFound(res, 'Lesson not found');
      }

      // Find or create progress record
      let progress = await Progress.findOne({
        userId: req.user._id,
        lessonId: lesson._id
      });

      if (!progress) {
        progress = new Progress({
          userId: req.user._id,
          lessonId: lesson._id,
          status: 'in-progress'
        });
      }

      // Update progress
      progress.status = 'completed';
      progress.completedAt = new Date();
      
      // Calculate score from quiz if available
      if (lesson.quiz && lesson.quiz.length > 0) {
        // For simplicity, we'll set a default score
        progress.score = 100;
      }

      await progress.save();

      // Award points to user
      const user = await User.findById(req.user._id);
      if (user) {
        user.points += 10; // Award 10 points for completing a lesson
        await user.save();
      }

      // Check for badge eligibility
      // This is a simplified example - in a real app, you'd have more complex badge logic
      const badges = await Badge.find({ pointsRequired: { $lte: user.points } });
      
      this.sendSuccess(res, {
        progress,
        pointsAwarded: 10,
        badgesEarned: badges
      }, 'Lesson completed successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to complete lesson');
    }
  }
}

module.exports = new LearningController();