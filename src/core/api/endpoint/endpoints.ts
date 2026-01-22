// Auth API endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/admin/login',
  REGISTER: '/api/v1/admin/register',
  LOGOUT: '/api/v1/admin/logout',
  REFRESH_TOKEN: '/api/v1/admin/refresh',
  VERIFY_EMAIL: '/api/v1/admin/verify-email',
  FORGOT_PASSWORD: '/api/v1/admin/forgot-password',
  RESET_PASSWORD: '/api/v1/admin/reset-password',
  ME: '/api/v1/admin/me',
} as const;

// Brand API endpoints
export const BRAND_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-brand',
  LIST: '/api/v1/admin/brands/products',
  UPDATE: '/api/v1/admin/update-brand',
  DELETE: '/api/v1/admin/delete-brand',
} as const;

// Category API endpoints
export const CATEGORY_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-category',
  LIST: '/api/v1/admin/categories/sub-categories',
  UPDATE: '/api/v1/admin/update-category',
  DELETE: '/api/v1/admin/category',
} as const;

// Subcategory API endpoints
export const SUBCATEGORY_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-subcategory',
  LIST: '/api/v1/admin/sub-categories/products',
  UPDATE: '/api/v1/admin/update-subcategory',
  DELETE: '/api/v1/admin/delete-subcategory',
} as const;

// User API endpoints
export const USER_ENDPOINTS = {
  CREATE: '/api/v1/admin/user',
  LIST: '/api/v1/admin/users',
  UPDATE: '/api/v1/admin/update-user',
  DELETE: '/api/v1/admin/user',
} as const;

// Product API endpoints
export const PRODUCT_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-product',
  LIST: '/api/v1/admin/products',
  UPDATE: '/api/v1/admin/update-product',
  DELETE: '/api/v1/admin/delete-product',
} as const;

// Metrics (Dimensions/Units) API endpoints
export const METRICS_ENDPOINTS = {
  ADD: '/api/v1/admin/add-metrics',
  LIST: '/api/v1/admin/metrics',
} as const;

// Inventory API endpoints
export const INVENTORY_ENDPOINTS = {
  LIST: '/api/v1/admin/inventory',
  ADD_BILL: '/api/v1/admin/add-inventory-bill',
  BILL_LIST: '/api/v1/admin/inventory-bills',
  BILL_BY_ID: '/api/v1/admin/inventory-bill-by-id',
} as const;

// Order API endpoints
export const ORDER_ENDPOINTS = {
  LIST: '/api/v1/admin/orders',
  UPDATE_STATUS: '/api/v1/admin/order-status',
  CONFIRM_ORDER: '/api/v1/admin/confirm-order',
} as const;

// Dashboard API endpoints
export const DASHBOARD_ENDPOINTS = {
  DATA: '/api/v1/admin/dashboard/data',
} as const;

// Carousel API endpoints
export const CAROUSEL_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-carousel',
  LIST: '/api/v1/admin/carousel',
  UPDATE: '/api/v1/admin/update-carousel',
  DELETE: '/api/v1/admin/carousel',
} as const;

// Banner API endpoints
export const BANNER_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-banner',
  LIST: '/api/v1/admin/banner',
  DELETE: '/api/v1/admin/banner',
} as const;

// Countdown API endpoints
export const COUNTDOWN_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-countdown',
  LIST: '/api/v1/admin/countdown',
} as const;

// Supplier API endpoints
export const SUPPLIER_ENDPOINTS = {
  CREATE: '/api/v1/admin/add-supplier',
  LIST: '/api/v1/admin/suppliers', // Assuming a list endpoint exists or will exist, but for now user only asked for create. I'll just add create.
} as const;
