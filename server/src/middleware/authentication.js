const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { UserRole } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { logError } = require('../utils/errorUtils');

// * Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // * Bearer TOKEN
  if (!token) {
    logError({
      error: `Unauthorized access attempt to ${req.method} ${req.originalUrl}`,
      status: 401,
    });
    return res.status(401).json({
      success: false,
      message: ErrorType.TOKEN_REQUIRED,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // * Fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      logError({
        error: `User not found for token access to ${req.method} ${req.originalUrl}`,
        status: 403,
      });
      return res.status(403).json({
        success: false,
        message: ErrorType.USER_NOT_FOUND,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logError(error);
    return res.status(403).json({
      success: false,
      message: ErrorType.TOKEN_INVALID_OR_EXPIRED,
    });
  }
};

// * Middleware to check if user has admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== UserRole.ADMIN) {
    logError(ErrorType.INSUFFICIENT_PERMISSIONS);
    return res.status(403).json({
      success: false,
      message: ErrorType.INSUFFICIENT_PERMISSIONS,
    });
  }
  next();
};

// * Middleware to check if user has admin or manager role
const requireManagerOrAdmin = (req, res, next) => {
  if (![UserRole.ADMIN, UserRole.MANAGER].includes(req.user.role)) {
    logError(ErrorType.INSUFFICIENT_PERMISSIONS);
    return res.status(403).json({
      success: false,
      message: ErrorType.INSUFFICIENT_PERMISSIONS,
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireManagerOrAdmin,
};
