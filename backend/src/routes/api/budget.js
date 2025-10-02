const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const budgetController = require('../../controllers/api/BudgetController');

// Create a new budget
router.post('/', authMiddleware, budgetController.createBudget);

// Get all budgets
router.get('/', authMiddleware, budgetController.getBudgets);

// Get a specific budget
router.get('/:id', authMiddleware, budgetController.getBudgetById);

// Update a budget
router.put('/:id', authMiddleware, budgetController.updateBudget);

// Delete a budget
router.delete('/:id', authMiddleware, budgetController.deleteBudget);

module.exports = router;