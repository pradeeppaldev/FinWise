const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const expenseController = require('../../controllers/api/ExpenseController');

// Create a new expense
router.post('/', authMiddleware, expenseController.createExpense);

// Get all expenses with pagination and filters
router.get('/', authMiddleware, expenseController.getExpenses);

// Update an expense
router.put('/:id', authMiddleware, expenseController.updateExpense);

// Delete an expense
router.delete('/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;