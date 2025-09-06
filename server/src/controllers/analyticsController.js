// ? Import required dependencies
const { validationResult } = require('express-validator');
const { createValidationError, logError } = require('../utils/errorUtils');
const {
  dashboardMetrics,
  salesAnalytics,
  productAnalytics,
  customerAnalytics,
  inventoryAnalytics,
} = require('../services/analyticsService');

// * GET /api/analytics/dashboard
// ? Fetches overall dashboard metrics including orders, revenue, products, and users summary
async function getDashboard(req, res, next) {
  try {
    const metrics = await dashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/analytics/sales
// ? Retrieves sales analytics data with optional date range and grouping (day/week/month)
async function getSales(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createValidationError(errors.array());
      return res.status(errorResponse.status).json({
        success: false,
        message: errorResponse.error,
        errors: errorResponse.errors,
      });
    }

    // ? Set default date range (last 30 days) if not provided
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const groupBy = req.query.groupBy || 'day';

    // ? Fetch sales analytics from service layer
    const sales = await salesAnalytics({ startDate, endDate, groupBy });

    res.json({ success: true, data: sales });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/analytics/products
// ? Fetches product analytics including top-selling products and category performance
async function getProductAnalytics(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = createValidationError(errors.array());
      return res.status(errorResponse.status).json({
        success: false,
        message: errorResponse.error,
        errors: errorResponse.errors,
      });
    }

    // ? Set default values for limit and sorting
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'sales';

    // ? Fetch product analytics from service layer
    const analytics = await productAnalytics({ limit, sortBy });

    res.json({ success: true, data: analytics });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/analytics/customers
// ? Retrieves customer analytics including segments and top customers by spending
async function getCustomerAnalytics(req, res, next) {
  try {
    const analytics = await customerAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/analytics/inventory
// ? Fetches inventory analytics including stock levels and category distribution
async function getInventoryAnalytics(req, res, next) {
  try {
    const analytics = await inventoryAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    logError(error);
    next(error);
  }
}

module.exports = {
  getDashboard,
  getSales,
  getProductAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
};
