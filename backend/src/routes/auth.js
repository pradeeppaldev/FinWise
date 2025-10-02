const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Verify email route
router.get('/verify', authController.verifyEmail);

// Login route
router.post('/login', authController.login);

// Refresh token route
router.post('/refresh', authController.refresh);

// Logout route
router.post('/logout', authController.logout);

// Forgot password route
router.post('/forgot', authController.forgotPassword);

// Reset password route
router.post('/reset', authController.resetPassword);

module.exports = router;