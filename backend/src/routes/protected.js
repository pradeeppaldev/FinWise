const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const { getProtectedData, getAdminData } = require('../controllers/protectedController');

// Protected route - requires authentication
router.get('/data', authMiddleware, getProtectedData);

// Admin only route - requires admin role
router.get('/admin', authMiddleware, requireRole('admin'), getAdminData);

module.exports = router;