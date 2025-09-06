// * Success Messages Enum -> Defines all possible success messages in the system
const SuccessMessage = {
  // ? Authentication
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',

  // ? Users
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',

  // ? Products
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  IMAGES_REMOVED: 'Images removed successfully',

  // ? Orders
  ORDER_UPDATED: 'Order updated successfully',

  // ? Categories
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  CATEGORY_IMAGE_REMOVED: 'Category image removed successfully',
};

module.exports = {
  SuccessMessage,
};
