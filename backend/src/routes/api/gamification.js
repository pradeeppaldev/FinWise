const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const gamificationController = require('../../controllers/api/GamificationController');

// Get all badges
router.get('/badges', gamificationController.getBadges);

// Get leaderboard
router.get('/leaderboard', gamificationController.getLeaderboard);

// Get user badges
router.get('/users/:userId/badges', authMiddleware, gamificationController.getUserBadges);

// Get current user badges
router.get('/badges/me', authMiddleware, gamificationController.getUserBadges);

module.exports = router;