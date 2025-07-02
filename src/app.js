const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const isDev = process.env.NODE_ENV === 'development';

// CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Preflight for all routes
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(cookieParser());

if (isDev) {
  app.use(morgan('dev'));
}

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/agents', require('./routes/agent.routes'));
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
