const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/surya_stores';
  
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ Warning: MONGODB_URI is not defined in environment variables. Falling back to local MongoDB.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Tip: On Render.com, ensure MONGODB_URI environment variable is added in the Environment tab.');
    process.exit(1);
  }
};

module.exports = connectDB;
