const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const communityController = require('../../controllers/api/CommunityController');

// Create a new post
router.post('/posts', authMiddleware, communityController.createPost);

// Get all posts with pagination
router.get('/posts', communityController.getPosts);

// Get a specific post
router.get('/posts/:id', communityController.getPostById);

// Update a post
router.put('/posts/:id', authMiddleware, communityController.updatePost);

// Delete a post
router.delete('/posts/:id', authMiddleware, communityController.deletePost);

// Add a comment to a post
router.post('/posts/:id/comments', authMiddleware, communityController.addComment);

// Like a post
router.post('/posts/:id/like', authMiddleware, communityController.likePost);

module.exports = router;