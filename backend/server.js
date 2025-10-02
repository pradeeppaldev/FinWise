const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Load configuration
const config = require('./src/config');
const connectDB = require('./src/config/db');

// Import middleware
const notFound = require('./src/middleware/notFound');
const errorHandler = require('./src/middleware/errorHandler');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: config.corsOrigins,
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger middleware (only in development)
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Main route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to FinWise Backend API',
    version: '1.0.0'
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;