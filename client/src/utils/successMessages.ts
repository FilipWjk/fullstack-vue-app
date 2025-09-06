export const SuccessMessages = {
  // ? Authentication success messages
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTRATION_SUCCESS: 'Account created successfully!',

  // ? Profile success messages
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',

  // ? Product success messages
  PRODUCT_CREATE_SUCCESS: 'Product created successfully',
  PRODUCT_UPDATE_SUCCESS: 'Product updated successfully',
  PRODUCT_DELETE_SUCCESS: 'Product deleted successfully',

  // ? Category success messages
  CATEGORY_CREATE_SUCCESS: 'Category created successfully',
  CATEGORY_UPDATE_SUCCESS: 'Category updated successfully',
  CATEGORY_DELETE_SUCCESS: 'Category deleted successfully',

  // ? User success messages
  USER_CREATE_SUCCESS: 'User created successfully',
  USER_UPDATE_SUCCESS: 'User updated successfully',
  USER_DELETE_SUCCESS: 'User deleted successfully',

  // ? Order success messages
  ORDER_UPDATE_SUCCESS: 'Order updated successfully',
} as const

// * Type for success message values
export type SuccessMessageType = (typeof SuccessMessages)[keyof typeof SuccessMessages]

// * Helper function to get success message by key
// * Provides better IDE support and validation
export const getSuccessMessage = (key: keyof typeof SuccessMessages): string => {
  return SuccessMessages[key]
}

// * Categorized success messages for better organization
export const SuccessCategories = {
  AUTH: {
    LOGIN_SUCCESS: SuccessMessages.LOGIN_SUCCESS,
    LOGOUT_SUCCESS: SuccessMessages.LOGOUT_SUCCESS,
    REGISTRATION_SUCCESS: SuccessMessages.REGISTRATION_SUCCESS,
  },

  PROFILE: {
    UPDATE_SUCCESS: SuccessMessages.PROFILE_UPDATE_SUCCESS,
    PASSWORD_CHANGE_SUCCESS: SuccessMessages.PASSWORD_CHANGE_SUCCESS,
  },

  PRODUCTS: {
    CREATE_SUCCESS: SuccessMessages.PRODUCT_CREATE_SUCCESS,
    UPDATE_SUCCESS: SuccessMessages.PRODUCT_UPDATE_SUCCESS,
    DELETE_SUCCESS: SuccessMessages.PRODUCT_DELETE_SUCCESS,
  },

  CATEGORIES: {
    CREATE_SUCCESS: SuccessMessages.CATEGORY_CREATE_SUCCESS,
    UPDATE_SUCCESS: SuccessMessages.CATEGORY_UPDATE_SUCCESS,
    DELETE_SUCCESS: SuccessMessages.CATEGORY_DELETE_SUCCESS,
  },

  USERS: {
    CREATE_SUCCESS: SuccessMessages.USER_CREATE_SUCCESS,
    UPDATE_SUCCESS: SuccessMessages.USER_UPDATE_SUCCESS,
    DELETE_SUCCESS: SuccessMessages.USER_DELETE_SUCCESS,
  },

  ORDERS: {
    UPDATE_SUCCESS: SuccessMessages.ORDER_UPDATE_SUCCESS,
  },
} as const
