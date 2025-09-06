const { validationResult } = require('express-validator');
const { OrderStatus } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { SuccessMessage } = require('../constants/successMessages');
const { isError, logError } = require('../utils/errorUtils');
const {
  listOrders,
  listUserOrders,
  getOrderById,
  updateOrderStatusTx,
  orderSummaryStats,
} = require('../services/ordersService');

// * Helper function to handle validation errors
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = `Validation failed for ${req.method} ${req.originalUrl}: ${errors
      .array()
      .map(e => `${e.param}: ${e.msg}`)
      .join(', ')}`;
    logError({ error: errorMessage, status: 400 });
    res
      .status(400)
      .json({ success: false, message: ErrorType.VALIDATION_FAILED, errors: errors.array() });
    return true; // ? Return true if there were validation errors
  }
  return false; // ? Return false if validation passed
}

// * Helper function to format paginated response
function formatPaginatedResponse(orders, total, page, limit) {
  return {
    success: true,
    data: {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  };
}

// * GET /api/orders
async function getOrders(req, res, next) {
  try {
    // * Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, search, startDate, endDate } = req.query;
    const { orders, total } = await listOrders({ page, limit, status, search, startDate, endDate });

    res.json(formatPaginatedResponse(orders, total, page, limit));
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/orders/my-orders
async function getMyOrders(req, res, next) {
  try {
    // * Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;
    const userId = req.user.id; // ? Get from authenticated user

    const { orders, total } = await listUserOrders({ userId, page, limit, status });

    res.json(formatPaginatedResponse(orders, total, page, limit));
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/orders/:id
async function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: ErrorType.ORDER_NOT_FOUND });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * PATCH /api/orders/:id
async function updateOrderStatus(req, res, next) {
  try {
    // * Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;
    const result = await updateOrderStatusTx(id, status);

    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({ success: false, message: result.error });
    }

    res.json({ success: true, message: SuccessMessage.ORDER_UPDATED, data: result.order });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/orders/stats/summary
async function getOrderSummaryStats(req, res, next) {
  try {
    const stats = await orderSummaryStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    logError(error);
    next(error);
  }
}

module.exports = {
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getOrderSummaryStats,
};
