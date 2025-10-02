const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const simulatorController = require('../../controllers/api/SimulatorController');

// Get mock market prices
router.get('/market', simulatorController.getMarketData);

// Simulate buy/sell portfolio transactions
router.post('/portfolio', authMiddleware, simulatorController.updatePortfolio);

// Get user portfolio
router.get('/portfolio/:userId', authMiddleware, simulatorController.getPortfolio);

// Get current user portfolio
router.get('/portfolio', authMiddleware, simulatorController.getPortfolio);

module.exports = router;