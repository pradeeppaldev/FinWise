const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

// Load configuration
const config = require('./src/config');
const connectDB = require('./src/config/db');

// Import middleware
const { requestLogger } = require('./src/middleware/logger');
const notFound = require('./src/middleware/notFound');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/api/user');
const expenseRoutes = require('./src/routes/api/expense');
const budgetRoutes = require('./src/routes/api/budget');
const goalRoutes = require('./src/routes/api/goal');
const learningRoutes = require('./src/routes/api/learning');
const simulatorRoutes = require('./src/routes/api/simulator');
const communityRoutes = require('./src/routes/api/community');
const gamificationRoutes = require('./src/routes/api/gamification');
const adminRoutes = require('./src/routes/api/admin');

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

// Cookie parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize()); // Sanitize data to prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logger middleware
app.use(requestLogger);

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
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/learning', learningRoutes);
app.use('/api/v1/sim', simulatorRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/admin', adminRoutes);

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
  // Don't exit the process in development when DB is not available
  if (config.nodeEnv !== 'development') {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  // Don't exit the process in development when DB is not available
  if (config.nodeEnv !== 'development') {
    process.exit(1);
  }
});

module.exports = app;