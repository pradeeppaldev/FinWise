const BaseController = require('../BaseController');
const { Expense } = require('../../models');

class ExpenseController extends BaseController {
  // Create a new expense
  async createExpense(req, res) {
    try {
      const { amount, currency, category, merchant, date, note, importedFrom } = req.body;
      
      // Validate required fields
      if (!amount || !category) {
        return this.sendError(res, null, 'Amount and category are required', 400);
      }

      const expense = new Expense({
        userId: req.user._id,
        amount,
        currency: currency || 'USD',
        category,
        merchant: merchant || '',
        date: date ? new Date(date) : new Date(),
        note: note || '',
        importedFrom: importedFrom || ''
      });

      await expense.save();
      this.sendSuccess(res, expense, 'Expense created successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to create expense');
    }
  }

  // Get all expenses with pagination and filters
  async getExpenses(req, res) {
    try {
      const { page, limit, skip } = this.getPagination(req);
      const { startDate, endDate, category } = req.query;

      // Build filter
      const filter = { userId: req.user._id };
      
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
      
      if (category) {
        filter.category = category;
      }

      // Get expenses
      const expenses = await Expense.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      // Get total count
      const total = await Expense.countDocuments(filter);

      this.sendSuccess(res, {
        expenses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch expenses');
    }
  }

  // Update an expense
  async updateExpense(req, res) {
    try {
      const expense = await Expense.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!expense) {
        return this.sendNotFound(res, 'Expense not found');
      }

      // Update fields
      const { amount, currency, category, merchant, date, note } = req.body;
      
      if (amount !== undefined) expense.amount = amount;
      if (currency) expense.currency = currency;
      if (category) expense.category = category;
      if (merchant !== undefined) expense.merchant = merchant;
      if (date) expense.date = new Date(date);
      if (note !== undefined) expense.note = note;

      await expense.save();
      this.sendSuccess(res, expense, 'Expense updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update expense');
    }
  }

  // Delete an expense
  async deleteExpense(req, res) {
    try {
      const expense = await Expense.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!expense) {
        return this.sendNotFound(res, 'Expense not found');
      }

      this.sendSuccess(res, null, 'Expense deleted successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to delete expense');
    }
  }
}

module.exports = new ExpenseController();