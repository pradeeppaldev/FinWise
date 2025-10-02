// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log error for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Determine status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set response
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;