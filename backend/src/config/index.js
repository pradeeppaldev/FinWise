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
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,

  // CORS configuration
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'],

  // API configuration
  apiPrefix: process.env.API_PREFIX || '/api/v1',
};

// Export configuration
module.exports = config;