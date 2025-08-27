const { ErrorType } = require('../constants/errorMessages');
const { ErrorStatusCode } = require('../constants/statusCodes');
require('colors');

/**
 * Colorize a message based on HTTP status code
 * @param {string} message - The message to colorize
 * @param {number} status - The HTTP status code
 * @returns {string} The colorized message
 */
function colorize(message, status) {
  if (typeof message !== 'string') message = String(message);

  const prefix = '===> ';
  const fullMessage = prefix + message;

  if (status >= 500) return fullMessage.red.inverse;
  if (status === 404) return fullMessage.blue;
  if (status >= 400) return fullMessage.yellow;
  return fullMessage;
}

/**
 * Create a standardized error response object
 * @param {string} errorType - The error type from ErrorType enum
 * @param {string} [customMessage] - Optional custom message to override the default
 * @param {number} [customStatus] - Optional custom status code to override the default
 * @returns {Object} Error response object with error message and status code
 */
function createError(errorType, customMessage = null, customStatus = null) {
  const message = customMessage || ErrorType[errorType] || errorType;
  const status = customStatus || ErrorStatusCode[errorType] || 500;

  return {
    error: message,
    status,
  };
}

/**
 * Create validation error with details
 * @param {Array} validationErrors - Array of validation error details
 * @returns {Object} Validation error response object
 */
function createValidationError(validationErrors = []) {
  return {
    error: ErrorType.VALIDATION_FAILED,
    status: ErrorStatusCode.VALIDATION_FAILED,
    errors: validationErrors,
  };
}

/**
 * Check if a result object is an error
 * @param {*} result - The result to check
 * @returns {boolean} True if the result is an error object
 */
function isError(result) {
  return result && typeof result === 'object' && 'error' in result;
}

/**
 * Simple error logging with colorization for development and debugging
 * @param {Error|Object|string} err - The error to log
 */
function logError(err) {
  if (!err) return;

  let message = '';
  let status = null;

  if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object') {
    message = err.error || err.message || String(err);
    status = err.status || err.statusCode || null;
  } else {
    message = String(err);
  }

  // * If status is still unknown, try to derive it from error message
  if (!status) {
    for (const [key, value] of Object.entries(ErrorType)) {
      if (value === message && ErrorStatusCode[key]) {
        status = ErrorStatusCode[key];
        break;
      }
    }
  }

  // * Use colorized output for better visibility
  console.log(colorize(message, status));

  // * Log stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }
}

module.exports = {
  createError,
  createValidationError,
  isError,
  logError,
};
