const BaseController = require('../BaseController');
const { Post } = require('../../models');

class CommunityController extends BaseController {
  // Create a new post
  async createPost(req, res) {
    try {
      const { title, body, tags } = req.body;
      
      // Validate required fields
      if (!title || !body) {
        return this.sendError(res, null, 'Title and body are required', 400);
      }

      const post = new Post({
        authorId: req.user._id,
        title,
        body,
        tags: tags || []
      });

      await post.save();
      this.sendSuccess(res, post, 'Post created successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to create post');
    }
  }

  // Get all posts with pagination
  async getPosts(req, res) {
    try {
      const { page, limit, skip } = this.getPagination(req);
      
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('authorId', 'name avatarUrl');

      const total = await Post.countDocuments();

      this.sendSuccess(res, {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch posts');
    }
  }

  // Get a specific post
  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params.id)
        .populate('authorId', 'name avatarUrl')
        .populate('comments.authorId', 'name avatarUrl');

      if (!post) {
        return this.sendNotFound(res, 'Post not found');
      }

      this.sendSuccess(res, post);
    } catch (error) {
      this.sendError(res, error, 'Failed to fetch post');
    }
  }

  // Update a post
  async updatePost(req, res) {
    try {
      const post = await Post.findOne({
        _id: req.params.id,
        authorId: req.user._id
      });

      if (!post) {
        return this.sendNotFound(res, 'Post not found or unauthorized');
      }

      const { title, body, tags } = req.body;
      
      if (title) post.title = title;
      if (body) post.body = body;
      if (tags) post.tags = tags;

      await post.save();
      this.sendSuccess(res, post, 'Post updated successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to update post');
    }
  }

  // Delete a post
  async deletePost(req, res) {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        authorId: req.user._id
      });

      if (!post) {
        return this.sendNotFound(res, 'Post not found or unauthorized');
      }

      this.sendSuccess(res, null, 'Post deleted successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to delete post');
    }
  }

  // Add a comment to a post
  async addComment(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return this.sendNotFound(res, 'Post not found');
      }

      const { body } = req.body;
      
      if (!body) {
        return this.sendError(res, null, 'Comment body is required', 400);
      }

      post.comments.push({
        authorId: req.user._id,
        body
      });

      await post.save();
      
      // Populate the new comment author
      const populatedPost = await Post.findById(post._id)
        .populate('comments.authorId', 'name avatarUrl');
      
      const newComment = populatedPost.comments[populatedPost.comments.length - 1];
      
      this.sendSuccess(res, newComment, 'Comment added successfully', 201);
    } catch (error) {
      this.sendError(res, error, 'Failed to add comment');
    }
  }

  // Like a post
  async likePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return this.sendNotFound(res, 'Post not found');
      }

      // Check if user already liked the post
      const alreadyLiked = post.likes.includes(req.user._id);
      
      if (alreadyLiked) {
        // Unlike the post
        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      } else {
        // Like the post
        post.likes.push(req.user._id);
      }

      await post.save();
      
      this.sendSuccess(res, {
        likes: post.likes.length,
        liked: !alreadyLiked
      }, alreadyLiked ? 'Post unliked successfully' : 'Post liked successfully');
    } catch (error) {
      this.sendError(res, error, 'Failed to like post');
    }
  }
}

module.exports = new CommunityController();