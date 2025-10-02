const BaseController = require('../BaseController');
const { Goal } = require('../../models');

class GoalController extends BaseController {
  // Create a new goal
  async createGoal(req, res) {
    try {
      const { title, targetAmount, currentAmount, monthlyContribution, deadline, category } = req.body;
      
      // Validate required fields
      if (!title || !targetAmount || !deadline || !category) {
        return this.sendError(res, null, 'Title, targetAmount, deadline, and category are required', 400);
      }

      const goal = new Goal({
        userId: req.user._id,
        title,
        targetAmount,
        currentAmount: currentAmount || 0,
        monthlyContribution: monthlyContribution || 0,
        deadline: new Date(deadline),
        category,
        status: 'not-started'
      });

      await goal.save();
      this.sendSuccess(res, goal, 'Goal created successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to create goal');
    }
  }

  // Get all goals
  async getGoals(req, res) {
    try {
      const goals = await Goal.find({ userId: req.user._id })
        .sort({ deadline: 1 });

      this.sendSuccess(res, goals);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch goals');
    }
  }

  // Get a specific goal
  async getGoalById(req, res) {
    try {
      const goal = await Goal.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!goal) {
        return this.sendNotFound(res, 'Goal not found');
      }

      this.sendSuccess(res, goal);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch goal');
    }
  }

  // Update a goal
  async updateGoal(req, res) {
    try {
      const goal = await Goal.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!goal) {
        return this.sendNotFound(res, 'Goal not found');
      }

      // Update fields
      const { title, targetAmount, currentAmount, monthlyContribution, deadline, category, status } = req.body;
      
      if (title) goal.title = title;
      if (targetAmount !== undefined) goal.targetAmount = targetAmount;
      if (currentAmount !== undefined) goal.currentAmount = currentAmount;
      if (monthlyContribution !== undefined) goal.monthlyContribution = monthlyContribution;
      if (deadline) goal.deadline = new Date(deadline);
      if (category) goal.category = category;
      if (status) goal.status = status;

      await goal.save();
      this.sendSuccess(res, goal, 'Goal updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update goal');
    }
  }

  // Delete a goal
  async deleteGoal(req, res) {
    try {
      const goal = await Goal.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!goal) {
        return this.sendNotFound(res, 'Goal not found');
      }

      this.sendSuccess(res, null, 'Goal deleted successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to delete goal');
    }
  }

  // Calculate auto contribution
  async calculateContribution(req, res) {
    try {
      const { targetAmount, currentAmount, months } = req.body;
      
      if (!targetAmount || !months) {
        return this.sendError(res, null, 'targetAmount and months are required', 400);
      }

      const amountNeeded = targetAmount - (currentAmount || 0);
      const monthlyContribution = amountNeeded / months;

      this.sendSuccess(res, {
        monthlyContribution: Math.max(0, monthlyContribution),
        totalNeeded: amountNeeded,
        months
      }, 'Contribution calculated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to calculate contribution');
    }
  }
}

module.exports = new GoalController();