class BaseController {
  // Send success response
  sendSuccess(res, data = null, message = null, statusCode = 200) {
    const response = {
      success: true,
      data
    };

    if (message) {
      response.message = message;
    }

    return res.status(statusCode).json(response);
  }

  // Send error response
  sendError(res, error = null, message = null, statusCode = 400) {
    const response = {
      success: false,
      error: message || 'An error occurred'
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.debug = error.message || error;
    }

    return res.status(statusCode).json(response);
  }

  // Send not found response
  sendNotFound(res, message = 'Resource not found') {
    return this.sendError(res, null, message, 404);
  }

  // Send unauthorized response
  sendUnauthorized(res, message = 'Unauthorized access') {
    return this.sendError(res, null, message, 401);
  }

  // Send forbidden response
  sendForbidden(res, message = 'Access forbidden') {
    return this.sendError(res, null, message, 403);
  }

  // Validate required fields
  validateRequiredFields(req, res, fields) {
    for (const field of fields) {
      if (!req.body[field] && req.body[field] !== 0) {
        this.sendError(res, null, `${field} is required`, 400);
        return false;
      }
    }
    return true;
  }

  // Parse pagination parameters
  getPagination(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    return { page, limit, skip };
  }
}

module.exports = BaseController;