// Load environment variables from .env file
require('dotenv').config();

// Configuration with sensible defaults
const config = {
  // Server configuration
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Database configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/finwise',

  // Security configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-super-secret-jwt-refresh-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 12,

  // CORS configuration
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'],

  // API configuration
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  // Email configuration
  emailHost: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  emailPort: parseInt(process.env.EMAIL_PORT, 10) || 587,
  emailUser: process.env.EMAIL_USER || 'your-ethereal-email',
  emailPass: process.env.EMAIL_PASS || 'your-ethereal-password',
  emailFrom: process.env.EMAIL_FROM || 'noreply@finwise.com'
};

// Export configuration
module.exports = config;