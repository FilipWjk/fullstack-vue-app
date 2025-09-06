const express = require('express');
const { body, query } = require('express-validator');
const { ORDER_STATUSES } = require('../constants/businessEnums');
const {
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getOrderSummaryStats,
} = require('../controllers/ordersController');

const router = express.Router();

/**
 * @route GET /api/orders
 * @desc Get all orders with pagination and filtering
 * @access Private
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status')
      .optional()
      .custom(value => {
        if (value === '' || value === undefined || value === null) return true;
        return ORDER_STATUSES.includes(value);
      }),
    query('search').optional().trim(),
    query('startDate')
      .optional()
      .custom(value => {
        if (value === '' || value === undefined || value === null) return true;
        return new Date(value).toString() !== 'Invalid Date';
      }),
    query('endDate')
      .optional()
      .custom(value => {
        if (value === '' || value === undefined || value === null) return true;
        return new Date(value).toString() !== 'Invalid Date';
      }),
  ],
  getOrders
);

/**
 * @route GET /api/orders/my-orders
 * @desc Get current user's orders with pagination and filtering
 * @access Private
 */
router.get(
  '/my-orders',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status')
      .optional()
      .custom(value => {
        if (value === '' || value === undefined || value === null) return true;
        return ORDER_STATUSES.includes(value);
      }),
  ],
  getMyOrders
);

/**
 * @route GET /api/orders/:id
 * @desc Get single order by ID
 * @access Private
 */
router.get('/:id', getOrder);

/**
 * @route PATCH /api/orders/:id
 * @desc Update order status
 * @access Private
 */
router.patch('/:id', [body('status').isIn(ORDER_STATUSES)], updateOrderStatus);

/**
 * @route GET /api/orders/stats/summary
 * @desc Get order statistics summary
 * @access Private
 */
router.get('/stats/summary', getOrderSummaryStats);

module.exports = router;
