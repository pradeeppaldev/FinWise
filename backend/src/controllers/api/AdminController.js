const BaseController = require('../BaseController');
const { Lesson, Badge, User } = require('../../models');

class AdminController extends BaseController {
  // Manage lessons
  async createLesson(req, res) {
    try {
      const { title, slug, contentMarkdown, durationMins, quiz, tags } = req.body;
      
      // Validate required fields
      if (!title || !slug || !contentMarkdown || !durationMins) {
        return this.sendError(res, null, 'Title, slug, contentMarkdown, and durationMins are required', 400);
      }

      const lesson = new Lesson({
        title,
        slug,
        contentMarkdown,
        durationMins,
        quiz: quiz || [],
        tags: tags || []
      });

      await lesson.save();
      this.sendSuccess(res, lesson, 'Lesson created successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to create lesson');
    }
  }

  async updateLesson(req, res) {
    try {
      const lesson = await Lesson.findById(req.params.id);
      
      if (!lesson) {
        return this.sendNotFound(res, 'Lesson not found');
      }

      const { title, slug, contentMarkdown, durationMins, quiz, tags } = req.body;
      
      if (title) lesson.title = title;
      if (slug) lesson.slug = slug;
      if (contentMarkdown) lesson.contentMarkdown = contentMarkdown;
      if (durationMins) lesson.durationMins = durationMins;
      if (quiz) lesson.quiz = quiz;
      if (tags) lesson.tags = tags;

      await lesson.save();
      this.sendSuccess(res, lesson, 'Lesson updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update lesson');
    }
  }

  async deleteLesson(req, res) {
    try {
      const lesson = await Lesson.findByIdAndDelete(req.params.id);
      
      if (!lesson) {
        return this.sendNotFound(res, 'Lesson not found');
      }

      this.sendSuccess(res, null, 'Lesson deleted successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to delete lesson');
    }
  }

  // Manage badges
  async createBadge(req, res) {
    try {
      const { key, name, description, pointsRequired, icon } = req.body;
      
      // Validate required fields
      if (!key || !name || !description || !pointsRequired) {
        return this.sendError(res, null, 'key, name, description, and pointsRequired are required', 400);
      }

      const badge = new Badge({
        key,
        name,
        description,
        pointsRequired,
        icon: icon || ''
      });

      await badge.save();
      this.sendSuccess(res, badge, 'Badge created successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to create badge');
    }
  }

  async updateBadge(req, res) {
    try {
      const badge = await Badge.findById(req.params.id);
      
      if (!badge) {
        return this.sendNotFound(res, 'Badge not found');
      }

      const { key, name, description, pointsRequired, icon } = req.body;
      
      if (key) badge.key = key;
      if (name) badge.name = name;
      if (description) badge.description = description;
      if (pointsRequired) badge.pointsRequired = pointsRequired;
      if (icon !== undefined) badge.icon = icon;

      await badge.save();
      this.sendSuccess(res, badge, 'Badge updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update badge');
    }
  }

  async deleteBadge(req, res) {
    try {
      const badge = await Badge.findByIdAndDelete(req.params.id);
      
      if (!badge) {
        return this.sendNotFound(res, 'Badge not found');
      }

      this.sendSuccess(res, null, 'Badge deleted successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to delete badge');
    }
  }

  // Manage users
  async getUsers(req, res) {
    try {
      const { page, limit, skip } = this.getPagination(req);
      const { role } = req.query;

      // Build filter
      const filter = {};
      if (role) {
        filter.role = role;
      }

      const users = await User.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(filter);

      this.sendSuccess(res, {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch users');
    }
  }

  async updateUserRole(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return this.sendNotFound(res, 'User not found');
      }

      const { role } = req.body;
      
      if (!role) {
        return this.sendError(res, null, 'Role is required', 400);
      }

      user.role = role;
      await user.save();
      
      this.sendSuccess(res, user, 'User role updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update user role');
    }
  }
}

module.exports = new AdminController();