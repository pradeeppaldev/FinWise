const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../../middleware/auth');
const adminController = require('../../controllers/api/AdminController');

// Admin middleware
const adminOnly = requireRole('admin');

// Manage lessons
router.post('/lessons', authMiddleware, adminOnly, adminController.createLesson);
router.put('/lessons/:id', authMiddleware, adminOnly, adminController.updateLesson);
router.delete('/lessons/:id', authMiddleware, adminOnly, adminController.deleteLesson);

// Manage badges
router.post('/badges', authMiddleware, adminOnly, adminController.createBadge);
router.put('/badges/:id', authMiddleware, adminOnly, adminController.updateBadge);
router.delete('/badges/:id', authMiddleware, adminOnly, adminController.deleteBadge);

// Manage users
router.get('/users', authMiddleware, adminOnly, adminController.getUsers);
router.put('/users/:id/role', authMiddleware, adminOnly, adminController.updateUserRole);

module.exports = router;