const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import middleware
const notFound = require('../src/middleware/notFound');
const errorHandler = require('../src/middleware/errorHandler');

// Import routes
const authRoutes = require('../src/routes/auth');

// Initialize app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Cookie parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger middleware (only in development)
if (process.env.NODE_ENV === 'development') {
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

// API Routes (to be implemented)
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    message: 'API is working'
  });
});

// Auth routes
app.use('/api/v1/auth', authRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;