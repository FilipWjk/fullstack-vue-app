const { Prisma } = require('@prisma/client');
const { logError } = require('../utils/errorUtils');
const { ErrorType } = require('../constants/errorMessages');

// * 404 handler for unmatched routes

const notFoundHandler = (req, res, next) => {
  const notFoundMessage = `Route not found: ${req.method} ${req.originalUrl}`;
  logError({ error: notFoundMessage, status: 404 });

  res.status(404).json({
    success: false,
    message: ErrorType.RESOURCE_NOT_FOUND,
    path: req.originalUrl,
  });
};

// * Global error handler middleware for Express -> Converts various error types to standardized HTTP responses
const errorHandler = (err, req, res, next) => {
  logError(err);

  // * Handle Prisma database errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: ErrorType.VALIDATION_FAILED,
    });
  }

  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  ) {
    return res.status(503).json({
      success: false,
      message: ErrorType.SERVICE_UNAVAILABLE,
    });
  }

  // * Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: ErrorType.TOKEN_INVALID_OR_EXPIRED,
    });
  }

  // * Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: ErrorType.VALIDATION_FAILED,
      errors: err.details || err.errors,
    });
  }

  // * Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: ErrorType.VALIDATION_FAILED,
    });
  }

  // * Handle custom application errors (from errorUtils.js)
  if (err.status && err.error) {
    return res.status(err.status).json({
      success: false,
      message: err.error,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // * Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// * Handle specific Prisma error codes
function handlePrismaError(err, res) {
  switch (err.code) {
    case 'P2002': // ? Unique constraint violation
      return res.status(409).json({
        success: false,
        message: ErrorType.RESOURCE_ALREADY_EXISTS,
        field: err.meta?.target,
      });

    case 'P2025': // ? Record not found
      return res.status(404).json({
        success: false,
        message: ErrorType.RESOURCE_NOT_FOUND,
      });

    case 'P2003': // ? Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: ErrorType.VALIDATION_FAILED,
      });

    default:
      return res.status(400).json({
        success: false,
        message: ErrorType.VALIDATION_FAILED,
        code: err.code,
      });
  }
}

module.exports = { errorHandler, notFoundHandler };
