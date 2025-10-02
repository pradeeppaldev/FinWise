const BaseController = require('../BaseController');
const { Budget } = require('../../models');

class BudgetController extends BaseController {
  // Create a new budget
  async createBudget(req, res) {
    try {
      const { period, allocations, startDate, endDate } = req.body;
      
      // Validate required fields
      if (!period || !allocations || !startDate || !endDate) {
        return this.sendError(res, null, 'Period, allocations, startDate, and endDate are required', 400);
      }

      const budget = new Budget({
        userId: req.user._id,
        period,
        allocations,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });

      await budget.save();
      this.sendSuccess(res, budget, 'Budget created successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to create budget');
    }
  }

  // Get all budgets
  async getBudgets(req, res) {
    try {
      const budgets = await Budget.find({ userId: req.user._id })
        .sort({ startDate: -1 });

      this.sendSuccess(res, budgets);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch budgets');
    }
  }

  // Get a specific budget
  async getBudgetById(req, res) {
    try {
      const budget = await Budget.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!budget) {
        return this.sendNotFound(res, 'Budget not found');
      }

      this.sendSuccess(res, budget);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch budget');
    }
  }

  // Update a budget
  async updateBudget(req, res) {
    try {
      const budget = await Budget.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!budget) {
        return this.sendNotFound(res, 'Budget not found');
      }

      // Update fields
      const { period, allocations, startDate, endDate } = req.body;
      
      if (period) budget.period = period;
      if (allocations) budget.allocations = allocations;
      if (startDate) budget.startDate = new Date(startDate);
      if (endDate) budget.endDate = new Date(endDate);

      await budget.save();
      this.sendSuccess(res, budget, 'Budget updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update budget');
    }
  }

  // Delete a budget
  async deleteBudget(req, res) {
    try {
      const budget = await Budget.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!budget) {
        return this.sendNotFound(res, 'Budget not found');
      }

      this.sendSuccess(res, null, 'Budget deleted successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to delete budget');
    }
  }
}

module.exports = new BudgetController();