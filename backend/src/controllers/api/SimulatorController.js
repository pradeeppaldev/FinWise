const BaseController = require('../BaseController');
const { Portfolio } = require('../../models');

class SimulatorController extends BaseController {
  // Get mock market prices
  async getMarketData(req, res) {
    try {
      // Mock market data
      const marketData = {
        timestamp: new Date(),
        stocks: [
          { symbol: 'AAPL', price: 150.25, change: 1.25 },
          { symbol: 'GOOGL', price: 2750.50, change: -5.30 },
          { symbol: 'MSFT', price: 305.75, change: 2.10 },
          { symbol: 'AMZN', price: 3200.00, change: 15.50 },
          { symbol: 'TSLA', price: 750.80, change: -8.20 }
        ],
        commodities: [
          { symbol: 'GOLD', price: 1850.30, change: 5.15 },
          { symbol: 'SILVER', price: 24.65, change: -0.35 }
        ]
      };

      this.sendSuccess(res, marketData);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch market data');
    }
  }

  // Simulate buy/sell portfolio transactions
  async updatePortfolio(req, res) {
    try {
      const { action, symbol, qty, price } = req.body;
      
      // Validate required fields
      if (!action || !symbol || !qty || !price) {
        return this.sendError(res, null, 'action, symbol, qty, and price are required', 400);
      }

      if (!['buy', 'sell'].includes(action)) {
        return this.sendError(res, null, 'action must be either "buy" or "sell"', 400);
      }

      // Find or create portfolio
      let portfolio = await Portfolio.findOne({ userId: req.user._id });
      
      if (!portfolio) {
        portfolio = new Portfolio({
          userId: req.user._id,
          positions: [],
          cash: 10000 // Starting cash
        });
      }

      // Process transaction
      if (action === 'buy') {
        const cost = qty * price;
        if (portfolio.cash < cost) {
          return this.sendError(res, null, 'Insufficient funds', 400);
        }
        
        // Add to positions
        const existingPosition = portfolio.positions.find(p => p.symbol === symbol);
        if (existingPosition) {
          existingPosition.qty += qty;
          existingPosition.entryPrice = ((existingPosition.entryPrice * (existingPosition.qty - qty)) + (price * qty)) / existingPosition.qty;
        } else {
          portfolio.positions.push({ symbol, qty, entryPrice: price });
        }
        
        portfolio.cash -= cost;
      } else if (action === 'sell') {
        const position = portfolio.positions.find(p => p.symbol === symbol);
        if (!position || position.qty < qty) {
          return this.sendError(res, null, 'Insufficient shares', 400);
        }
        
        const proceeds = qty * price;
        position.qty -= qty;
        
        // Remove position if qty is 0
        if (position.qty === 0) {
          portfolio.positions = portfolio.positions.filter(p => p.symbol !== symbol);
        }
        
        portfolio.cash += proceeds;
      }

      // Add to history
      if (!portfolio.history) portfolio.history = [];
      portfolio.history.push({
        action,
        symbol,
        qty,
        price,
        timestamp: new Date()
      });

      await portfolio.save();
      this.sendSuccess(res, portfolio, 'Portfolio updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update portfolio');
    }
  }

  // Get user portfolio
  async getPortfolio(req, res) {
    try {
      const userId = req.params.userId || req.user._id;
      
      const portfolio = await Portfolio.findOne({ userId });
      
      if (!portfolio) {
        return this.sendNotFound(res, 'Portfolio not found');
      }

      this.sendSuccess(res, portfolio);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch portfolio');
    }
  }
}

module.exports = new SimulatorController();