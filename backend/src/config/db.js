const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if MONGO_URI is provided
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not provided. Skipping database connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.warn('Database connection failed. Server will start without database.');
    // Don't exit the process, allow server to start without DB for development
  }
};

module.exports = connectDB;