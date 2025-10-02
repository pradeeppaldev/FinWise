// Mock all external dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
jest.mock('../src/models');
jest.mock('../src/utils/email');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../src/models');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../src/utils/email');
const { 
  register, 
  login, 
  logout, 
  forgotPassword 
} = require('../src/controllers/authController');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {},
      query: {},
      cookies: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return error if required fields are missing', async () => {
      req.body = { name: 'Test User' };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and password are required'
      });
    });

    it('should return error if user already exists', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return a user
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User with this email already exists'
      });
    });

    it('should register user successfully', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      
      // Mock bcrypt.hash
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      // Mock User.save
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        save: jest.fn().mockResolvedValue()
      };
      User.mockImplementation(() => mockUser);
      
      // Mock sendVerificationEmail
      sendVerificationEmail.mockResolvedValue();

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); // Updated to match actual implementation
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.'
      });
    });
  });

  describe('login', () => {
    it('should return error if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email and password are required'
      });
    });

    it('should return error if user does not exist', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return null
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should return error if password is invalid', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock User.findOne to return a user
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        verified: true
      };
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should login user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return a user
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        role: 'user',
        verified: true,
        save: jest.fn().mockResolvedValue()
      };
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock jwt.sign
      jwt.sign.mockReturnValueOnce('accessToken');
      jwt.sign.mockReturnValueOnce('refreshToken');
      
      // Mock RefreshToken.findOneAndUpdate
      RefreshToken.findOneAndUpdate.mockResolvedValue();

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refreshToken',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict'
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        accessToken: 'accessToken',
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      req.cookies.refreshToken = 'refreshToken';
      
      // Mock RefreshToken.findOneAndDelete
      RefreshToken.findOneAndDelete.mockResolvedValue();

      await logout(req, res);

      expect(RefreshToken.findOneAndDelete).toHaveBeenCalledWith({
        token: expect.any(String)
      });
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });

  describe('forgotPassword', () => {
    it('should return error if email is missing', async () => {
      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email is required'
      });
    });

    it('should handle forgot password request', async () => {
      req.body = { email: 'test@example.com' };
      
      // Mock User.findOne to return a user
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue()
      };
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock sendPasswordResetEmail
      sendPasswordResetEmail.mockResolvedValue();

      await forgotPassword(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    });
  });
});