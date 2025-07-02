const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Mongoose v6+ handles createIndex & findAndModify automatically
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`.red.underline.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
