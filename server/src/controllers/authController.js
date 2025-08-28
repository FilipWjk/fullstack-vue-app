const { validationResult } = require('express-validator');
const { createUser, verifyCredentials, refreshJwt } = require('../services/authService');
const { isError, createValidationError, logError } = require('../utils/errorUtils');
const { ErrorType } = require('../constants/errorMessages');
const { SuccessMessage } = require('../constants/successMessages');

// * POST /api/auth/register
async function register(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = createValidationError(
        errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
          value: err.value,
        })),
      );
      return res.status(errorResponse.status).json({
        success: false,
        message: errorResponse.error,
        errors: errorResponse.errors,
      });
    }

    const { email, password, name, role } = req.body;
    const result = await createUser({ email, password, name, role });

    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }
    res.status(201).json({ success: true, message: SuccessMessage.USER_REGISTERED, data: result });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * POST /api/auth/login
async function login(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = createValidationError(
        errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
          value: err.value,
        })),
      );
      return res.status(errorResponse.status).json({
        success: false,
        message: errorResponse.error,
        errors: errorResponse.errors,
      });
    }

    const { email, password } = req.body;
    const result = await verifyCredentials({ email, password });

    if (isError(result)) {
      logError(result);
      if (result.error === ErrorType.DB_UNAVAILABLE) {
        return res.status(503).json({
          success: false,
          message: ErrorType.SERVICE_UNAVAILABLE,
        });
      }

      if (result.error === ErrorType.INVALID_CREDENTIALS) {
        return res.status(401).json({
          success: false,
          message: ErrorType.INVALID_CREDENTIALS,
        });
      }

      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.json({ success: true, message: SuccessMessage.LOGIN_SUCCESSFUL, data: result });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * POST /api/auth/refresh
async function refreshToken(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: ErrorType.TOKEN_REQUIRED });
    }

    const newToken = refreshJwt(token);
    if (!newToken) {
      return res.status(401).json({ success: false, message: ErrorType.TOKEN_INVALID_OR_EXPIRED });
    }
    res.json({ success: true, data: { token: newToken } });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * POST /api/auth/logout
async function logout(req, res, next) {
  try {
    res.json({
      success: true,
      message: SuccessMessage.LOGOUT_SUCCESSFUL,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
}

module.exports = { register, login, refreshToken, logout };
