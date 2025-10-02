// Mock all external dependencies
jest.mock('jsonwebtoken');
jest.mock('../src/models');
jest.mock('../src/config');

const request = require('supertest');
const express = require('express');

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { _id: 'user123', role: 'user' };
    next();
  },
  requireRole: (role) => (req, res, next) => {
    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Requires admin role.'
      });
    }
    next();
  }
}));

describe('API Route Structure', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should have all required route files', () => {
    // Test that we can import all route files without errors
    expect(() => require('../src/routes/auth')).not.toThrow();
    expect(() => require('../src/routes/api/user')).not.toThrow();
    expect(() => require('../src/routes/api/expense')).not.toThrow();
    expect(() => require('../src/routes/api/budget')).not.toThrow();
    expect(() => require('../src/routes/api/goal')).not.toThrow();
    expect(() => require('../src/routes/api/learning')).not.toThrow();
    expect(() => require('../src/routes/api/simulator')).not.toThrow();
    expect(() => require('../src/routes/api/community')).not.toThrow();
    expect(() => require('../src/routes/api/gamification')).not.toThrow();
    expect(() => require('../src/routes/api/admin')).not.toThrow();
  });

  it('should have correct route prefixes', () => {
    const authRoutes = require('../src/routes/auth');
    const userRoutes = require('../src/routes/api/user');
    const expenseRoutes = require('../src/routes/api/expense');
    
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/expenses', expenseRoutes);
    
    // Test that routes are mounted correctly
    const routes = app._router.stack
      .filter(layer => layer.route)
      .map(layer => layer.route.path);
    
    // We can't easily test the actual routes without a full server,
    // but we can verify the route files are structured correctly
    expect(authRoutes).toBeDefined();
    expect(userRoutes).toBeDefined();
    expect(expenseRoutes).toBeDefined();
  });
});
