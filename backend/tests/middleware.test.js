// Mock all external dependencies
jest.mock('jsonwebtoken');
jest.mock('../src/models');
jest.mock('../src/config');

const jwt = require('jsonwebtoken');
const { User } = require('../src/models');
const config = require('../src/config');
const { authMiddleware, requireRole } = require('../src/middleware/auth');

describe('Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      header: jest.fn(),
      user: null
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock config
    config.jwtSecret = 'test-secret';
  });

  describe('authMiddleware', () => {
    it('should return 401 if no token is provided', async () => {
      req.header.mockReturnValue(null);

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
      req.header.mockReturnValue('InvalidToken');

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.header.mockReturnValue('Bearer invalid-token');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'test-secret');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not found', async () => {
      req.header.mockReturnValue('Bearer valid-token');
      jwt.verify.mockReturnValue({ userId: 'user123' });
      User.findById = jest.fn().mockResolvedValue(null);

      await authMiddleware(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should attach user to request and call next if token is valid', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      };

      req.header.mockReturnValue('Bearer valid-token');
      jwt.verify.mockReturnValue({ userId: 'user123' });
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should return 401 if no user is authenticated', () => {
      const middleware = requireRole('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access denied. No user authenticated.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have required role', () => {
      req.user = {
        role: 'user'
      };

      const middleware = requireRole('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access denied. Requires admin role.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access if user has required role', () => {
      req.user = {
        role: 'admin'
      };

      const middleware = requireRole('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow access if user is admin for any role', () => {
      req.user = {
        role: 'admin'
      };

      const middleware = requireRole('user');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});