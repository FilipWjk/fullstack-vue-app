const express = require('express');
const { query } = require('express-validator');
const router = express.Router();
const {
  getDashboard,
  getSales,
  getProductAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
} = require('../controllers/analyticsController');

/**
 * @route GET /api/analytics/dashboard
 * @desc Get comprehensive dashboard analytics
 * @access Private
 */
router.get('/dashboard', getDashboard);

/**
 * @route GET /api/analytics/sales
 * @desc Get sales analytics with date range
 * @access Private
 */
router.get(
  '/sales',
  [
    query('startDate')
      .optional()
      .custom((value) => {
        if (value === '' || value === undefined || value === null) return true;
        return new Date(value).toString() !== 'Invalid Date';
      }),
    query('endDate')
      .optional()
      .custom((value) => {
        if (value === '' || value === undefined || value === null) return true;
        return new Date(value).toString() !== 'Invalid Date';
      }),
    query('groupBy')
      .optional()
      .custom((value) => {
        if (value === '' || value === undefined || value === null) return true;
        return ['day', 'week', 'month'].includes(value);
      }),
  ],
  getSales,
);

/**
 * @route GET /api/analytics/products
 * @desc Get product performance analytics
 * @access Private
 */
router.get(
  '/products',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('sortBy')
      .optional()
      .custom((value) => {
        // ? Allow empty string or valid sortBy value
        if (value === '' || value === undefined || value === null) return true;
        return ['sales', 'revenue', 'views'].includes(value);
      }),
  ],
  getProductAnalytics,
);

/**
 * @route GET /api/analytics/customers
 * @desc Get customer analytics
 * @access Private
 */
router.get('/customers', getCustomerAnalytics);

/**
 * @route GET /api/analytics/inventory
 * @desc Get inventory analytics
 * @access Private
 */
router.get('/inventory', getInventoryAnalytics);

module.exports = router;
