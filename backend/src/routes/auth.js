const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validation');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

// Base route for auth API
router.get('/', (req, res) => {
  res.json({
    message: 'Auth API',
    endpoints: {
      register: 'POST /api/v1/auth/register',
      verify: 'GET /api/v1/auth/verify',
      login: 'POST /api/v1/auth/login',
      refresh: 'POST /api/v1/auth/refresh',
      logout: 'POST /api/v1/auth/logout',
      forgot: 'POST /api/v1/auth/forgot',
      reset: 'POST /api/v1/auth/reset'
    }
  });
});

// Register route with validation and rate limiting
router.post('/register', authLimiter, validate(schemas.register), authController.register);

// Verify email route with validation
router.get('/verify', validate(schemas.verifyEmail), authController.verifyEmail);

// Login route with validation and rate limiting
router.post('/login', authLimiter, validate(schemas.login), authController.login);

// Refresh token route
router.post('/refresh', authController.refresh);

// Logout route
router.post('/logout', authController.logout);

// Forgot password route with validation and rate limiting
router.post('/forgot', passwordResetLimiter, validate(schemas.forgotPassword), authController.forgotPassword);

// Reset password route with validation
router.post('/reset', validate(schemas.resetPassword), authController.resetPassword);

module.exports = router;