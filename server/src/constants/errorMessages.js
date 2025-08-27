// * Error Messages Enum -> Defines all possible error messages in the system
const ErrorType = {
  // ? Authentication & Authorization Errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'An account already exists for this email. Please log in or reset your password.',
  CANNOT_CHANGE_OWN_ROLE: 'You cannot change your own role',
  CANNOT_DELETE_OWN_ACCOUNT: 'You cannot delete your own account',
  CURRENT_PASSWORD_REQUIRED: 'Current password is required to change password',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',

  // ? Token & Access Errors
  TOKEN_REQUIRED: 'Access token required',
  TOKEN_INVALID_OR_EXPIRED: 'Invalid or expired token',
  REFRESH_TOKEN_REQUIRED: 'Refresh token required',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

  // ? Resource Not Found Errors
  RESOURCE_NOT_FOUND: 'Resource not found',
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  ORDER_NOT_FOUND: 'Order not found',

  // ? Validation & Business Logic Errors
  VALIDATION_FAILED: 'Validation failed',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',
  CATEGORY_NAME_EXISTS: 'Category with this name already exists',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  INSUFFICIENT_STOCK: 'Insufficient stock for product',
  INVALID_ORDER_STATUS: 'Invalid order status for this operation',
  CANNOT_DELETE_CATEGORY_WITH_PRODUCTS:
    'Cannot delete category with products. Please move or delete products first.',
  CANNOT_DELETE_USER_WITH_ORDERS: 'Cannot delete user with existing orders',
  ONLY_PENDING_ORDERS_CAN_BE_DELETED: 'Only pending orders can be deleted',
  CATEGORY_HAS_NO_IMAGE: 'Category has no image to remove',
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.',

  // ? System Errors
  DB_UNAVAILABLE: 'DB_UNAVAILABLE',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
};

// * Array of all error messages for validation
const ERROR_TYPES = Object.values(ErrorType);

module.exports = {
  ErrorType,
  ERROR_TYPES,
};
