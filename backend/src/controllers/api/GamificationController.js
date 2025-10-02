const BaseController = require('../BaseController');
const { Badge, User } = require('../../models');

class GamificationController extends BaseController {
  // Get all badges
  async getBadges(req, res) {
    try {
      const badges = await Badge.find().sort({ pointsRequired: 1 });
      this.sendSuccess(res, badges);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch badges');
    }
  }

  // Get leaderboard
  async getLeaderboard(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      // Get top users by points
      const users = await User.find({ role: 'user' })
        .select('name avatarUrl points')
        .sort({ points: -1 })
        .limit(limit);

      this.sendSuccess(res, users);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch leaderboard');
    }
  }

  // Get user badges
  async getUserBadges(req, res) {
    try {
      const userId = req.params.userId || req.user._id;
      
      const user = await User.findById(userId).populate('badges');
      
      if (!user) {
        return this.sendNotFound(res, 'User not found');
      }

      this.sendSuccess(res, user.badges);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch user badges');
    }
  }
}

module.exports = new GamificationController();