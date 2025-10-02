const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const learningController = require('../../controllers/api/LearningController');

// Get all lessons
router.get('/lessons', learningController.getLessons);

// Get lesson by slug
router.get('/lessons/:slug', learningController.getLessonBySlug);

// Complete a lesson
router.post('/lessons/:id/complete', authMiddleware, learningController.completeLesson);

module.exports = router;