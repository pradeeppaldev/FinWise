const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const goalController = require('../../controllers/api/GoalController');

// Create a new goal
router.post('/', authMiddleware, goalController.createGoal);

// Get all goals
router.get('/', authMiddleware, goalController.getGoals);

// Get a specific goal
router.get('/:id', authMiddleware, goalController.getGoalById);

// Update a goal
router.put('/:id', authMiddleware, goalController.updateGoal);

// Delete a goal
router.delete('/:id', authMiddleware, goalController.deleteGoal);

// Calculate auto contribution
router.post('/calculate', authMiddleware, goalController.calculateContribution);

module.exports = router;