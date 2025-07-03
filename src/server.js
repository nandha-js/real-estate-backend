require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// 💥 Handle uncaught exceptions (e.g., sync code errors)
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1); // mandatory, otherwise process stays in undefined state
});

// IIFE to start server
(async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // 💥 Handle unhandled promise rejections (e.g., DB/network issues)
    process.on('unhandledRejection', (err) => {
      console.error('💥 Unhandled Rejection:', err.message);
      console.error(err.stack);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
})();
