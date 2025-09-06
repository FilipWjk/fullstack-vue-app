//* User Role Enum -> Defines all available user roles in the system
export const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
} as const

//* Product Status Enum -> Defines all available product statuses in the system
export const ProductStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

// * Order Status Enum -> Defines all available order statuses in the system
export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const

//* Payment Status Enum -> Defines all available payment statuses in the system
export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const

// * Type definitions for better TypeScript support
export type UserRoleType = keyof typeof UserRole
export type ProductStatusType = keyof typeof ProductStatus
export type OrderStatusType = keyof typeof OrderStatus
export type PaymentStatusType = keyof typeof PaymentStatus

//* Arrays of all enum values for validation

export const USER_ROLES = Object.values(UserRole)
export const PRODUCT_STATUSES = Object.values(ProductStatus)
export const ORDER_STATUSES = Object.values(OrderStatus)
export const PAYMENT_STATUSES = Object.values(PaymentStatus)
