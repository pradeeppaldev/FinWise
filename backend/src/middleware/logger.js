// Generate a simple request ID
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Logging middleware
const requestLogger = (req, res, next) => {
  // Generate request ID
  const requestId = generateRequestId();
  req.requestId = requestId;
  
  // Log incoming request
  console.log(`[${requestId}] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  
  // Capture response finish to log completion
  const originalSend = res.send;
  res.send = function (body) {
    // Log response
    console.log(`[${requestId}] ${req.method} ${req.path} - ${res.statusCode} - ${new Date().toISOString()}`);
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = {
  requestLogger
};