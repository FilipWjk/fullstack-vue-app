// * Setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// * Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');
const { ErrorType } = require('./constants/errorMessages');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// * Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // ? 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: ErrorType.TOO_MANY_REQUESTS,
});
app.use(limiter);

// * CORS Config
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// * Logging
app.use(morgan('combined'));

// * Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ? Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// * API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// * 404 handler for unmatched routes
app.use('*', notFoundHandler);

app.use(errorHandler);

// ! Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
