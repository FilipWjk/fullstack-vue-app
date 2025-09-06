export const ErrorMessages = {
  // ? Generic errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  NETWORK_ERROR: 'Network connection failed',
  SERVER_ERROR: 'Server error occurred',

  // ? Authentication errors
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_FAILED: 'Registration failed',
  TOKEN_EXPIRED: 'Session expired, please login again',
  UNAUTHORIZED: 'You are not authorized to perform this action',

  // ? Product errors
  PRODUCT_FETCH_FAILED: 'Failed to fetch products',
  PRODUCT_FETCH_SINGLE_FAILED: 'Failed to fetch product',
  PRODUCT_CREATE_FAILED: 'Failed to create product',
  PRODUCT_UPDATE_FAILED: 'Failed to update product',
  PRODUCT_DELETE_FAILED: 'Failed to delete product',

  // ? Category errors
  CATEGORIES_FETCH_FAILED: 'Failed to fetch categories',
  CATEGORY_FETCH_FAILED: 'Failed to fetch category',
  CATEGORY_CREATE_FAILED: 'Failed to create category',
  CATEGORY_UPDATE_FAILED: 'Failed to update category',
  CATEGORY_DELETE_FAILED: 'Failed to delete category',
  CATEGORY_IMAGE_REMOVE_FAILED: 'Failed to remove category image',

  // ? User errors
  USERS_FETCH_FAILED: 'Failed to fetch users',
  USER_FETCH_FAILED: 'Failed to fetch user',
  USER_CREATE_FAILED: 'Failed to create user',
  USER_UPDATE_FAILED: 'Failed to update user',
  USER_DELETE_FAILED: 'Failed to delete user',

  // ? Order errors
  ORDERS_FETCH_FAILED: 'Failed to fetch orders',
  ORDER_FETCH_FAILED: 'Failed to fetch order',
  ORDER_CREATE_FAILED: 'Failed to create order',
  ORDER_UPDATE_FAILED: 'Failed to update order',
  ORDER_DELETE_FAILED: 'Failed to delete order',
  ORDER_STATS_FETCH_FAILED: 'Failed to fetch order stats',

  // ? Analytics errors
  DASHBOARD_FETCH_FAILED: 'Failed to fetch dashboard data',
  SALES_DATA_FETCH_FAILED: 'Failed to fetch sales data',
  PRODUCT_ANALYTICS_FETCH_FAILED: 'Failed to fetch product analytics',
  CUSTOMER_ANALYTICS_FETCH_FAILED: 'Failed to fetch customer analytics',
  INVENTORY_ANALYTICS_FETCH_FAILED: 'Failed to fetch inventory analytics',

  // ? Profile errors
  PROFILE_LOAD_FAILED: 'Failed to load profile data',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  PASSWORD_CHANGE_FAILED: 'Failed to change password',

  // ? Form validation errors
  FORM_VALIDATION_FAILED: 'Please fix the form errors before submitting',
  FORM_VALIDATION_CHECK_ERRORS: 'Please check the form for errors',

  // ? User interface messages
  OPERATION_FAILED: 'Operation failed',
  DATA_LOAD_FAILED: 'Failed to load data',
  DATA_SAVE_FAILED: 'Failed to save data',

  // ? Success messages
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_FAILED: 'Error logging out',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
  PRODUCT_CREATE_SUCCESS: 'Product created successfully',
  PRODUCT_UPDATE_SUCCESS: 'Product updated successfully',
  PRODUCT_DELETE_SUCCESS: 'Product deleted successfully',
  CATEGORY_CREATE_SUCCESS: 'Category created successfully',
  CATEGORY_UPDATE_SUCCESS: 'Category updated successfully',
  CATEGORY_DELETE_SUCCESS: 'Category deleted successfully',
  CATEGORY_IMAGE_REMOVE_SUCCESS: 'Category image removed successfully',
  USER_CREATE_SUCCESS: 'User created successfully',
  USER_UPDATE_SUCCESS: 'User updated successfully',
  USER_DELETE_SUCCESS: 'User deleted successfully',
  ORDER_CREATE_SUCCESS: 'Order created successfully',
  ORDER_UPDATE_SUCCESS: 'Order updated successfully',
} as const

// * Type for error message values
export type ErrorMessageType = (typeof ErrorMessages)[keyof typeof ErrorMessages]

// * Helper function to get error message by key
// * Provides better IDE support and validation
export const getErrorMessage = (key: keyof typeof ErrorMessages): string => {
  return ErrorMessages[key]
}

// * Categorized error messages for better organization
export const ErrorCategories = {
  AUTH: {
    LOGIN_FAILED: ErrorMessages.LOGIN_FAILED,
    REGISTRATION_FAILED: ErrorMessages.REGISTRATION_FAILED,
    TOKEN_EXPIRED: ErrorMessages.TOKEN_EXPIRED,
    UNAUTHORIZED: ErrorMessages.UNAUTHORIZED,
  },

  PRODUCTS: {
    FETCH_FAILED: ErrorMessages.PRODUCT_FETCH_FAILED,
    FETCH_SINGLE_FAILED: ErrorMessages.PRODUCT_FETCH_SINGLE_FAILED,
    CREATE_FAILED: ErrorMessages.PRODUCT_CREATE_FAILED,
    UPDATE_FAILED: ErrorMessages.PRODUCT_UPDATE_FAILED,
    DELETE_FAILED: ErrorMessages.PRODUCT_DELETE_FAILED,
  },

  ORDERS: {
    FETCH_FAILED: ErrorMessages.ORDERS_FETCH_FAILED,
    FETCH_SINGLE_FAILED: ErrorMessages.ORDER_FETCH_FAILED,
    CREATE_FAILED: ErrorMessages.ORDER_CREATE_FAILED,
    UPDATE_FAILED: ErrorMessages.ORDER_UPDATE_FAILED,
    DELETE_FAILED: ErrorMessages.ORDER_DELETE_FAILED,
    STATS_FETCH_FAILED: ErrorMessages.ORDER_STATS_FETCH_FAILED,
  },

  ANALYTICS: {
    DASHBOARD_FAILED: ErrorMessages.DASHBOARD_FETCH_FAILED,
    SALES_DATA_FAILED: ErrorMessages.SALES_DATA_FETCH_FAILED,
    PRODUCT_ANALYTICS_FAILED: ErrorMessages.PRODUCT_ANALYTICS_FETCH_FAILED,
    CUSTOMER_ANALYTICS_FAILED: ErrorMessages.CUSTOMER_ANALYTICS_FETCH_FAILED,
    INVENTORY_ANALYTICS_FAILED: ErrorMessages.INVENTORY_ANALYTICS_FETCH_FAILED,
  },

  PROFILE: {
    LOAD_FAILED: ErrorMessages.PROFILE_LOAD_FAILED,
    UPDATE_FAILED: ErrorMessages.PROFILE_UPDATE_FAILED,
    PASSWORD_CHANGE_FAILED: ErrorMessages.PASSWORD_CHANGE_FAILED,
  },
} as const
