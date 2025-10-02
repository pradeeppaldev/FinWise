const BaseController = require('../BaseController');
const { User, Expense, Budget, Goal } = require('../../models');

class UserController extends BaseController {
  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-passwordHash');
      if (!user) {
        return this.sendNotFound(res, 'User not found');
      }
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch user profile');
    }
  }

  // Get user by ID (admin only)
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-passwordHash');
      if (!user) {
        return this.sendNotFound(res, 'User not found');
      }
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch user');
    }
  }

  // Update current user profile
  async updateProfile(req, res) {
    try {
      const { name, avatarUrl } = req.body;
      
      const user = await User.findById(req.user._id);
      if (!user) {
        return this.sendNotFound(res, 'User not found');
      }

      // Update allowed fields
      if (name) user.name = name;
      if (avatarUrl) user.avatarUrl = avatarUrl;

      await user.save();

      this.sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update profile');
    }
  }

  // Get user summary (budget + expenses + goals snapshot)
  async getUserSummary(req, res) {
    try {
      const userId = req.params.id || req.user._id;

      // Get recent expenses
      const recentExpenses = await Expense.find({ userId })
        .sort({ date: -1 })
        .limit(5);

      // Get current budget
      const currentBudget = await Budget.findOne({ 
        userId,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      });

      // Get active goals
      const activeGoals = await Goal.find({ 
        userId,
        status: { $in: ['not-started', 'in-progress'] }
      });

      const summary = {
        expenses: recentExpenses,
        budget: currentBudget,
        goals: activeGoals
      };

      this.sendSuccess(res, summary);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch user summary');
    }
  }
}

module.exports = new UserController();