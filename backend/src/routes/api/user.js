const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const userController = require('../../controllers/api/UserController');

// Get current user profile
router.get('/me', authMiddleware, userController.getProfile);

// Update current user profile
router.put('/me', authMiddleware, userController.updateProfile);

// Get user by ID (admin only)
router.get('/:id', authMiddleware, userController.getUserById);

// Get user summary
router.get('/:id/summary', authMiddleware, userController.getUserSummary);

module.exports = router;