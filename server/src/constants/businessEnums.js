// * User Role Enum -> Defines all available user roles in the system
const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
};

// * Product Status Enum -> Defines all available product statuses in the system
const ProductStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

// * Order Status Enum -> Defines all available order statuses in the system
const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

// * Array of all user roles for validation
const USER_ROLES = Object.values(UserRole);

// * Array of all product statuses for validation
const PRODUCT_STATUSES = Object.values(ProductStatus);

// * Array of all order statuses for validation
const ORDER_STATUSES = Object.values(OrderStatus);

module.exports = {
  UserRole,
  ProductStatus,
  OrderStatus,
  USER_ROLES,
  PRODUCT_STATUSES,
  ORDER_STATUSES,
};
