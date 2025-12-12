// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
};

// App Constants
export const APP_CONFIG = {
  APP_NAME: 'Pesanin',
  APP_DESCRIPTION: 'Sistem Pemesanan Restoran Berbasis Barcode',
  CURRENCY: 'Rp',
  LOCALE: 'id-ID',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  COOKING: 'cooking',
  DONE: 'done',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Menunggu Pembayaran',
  [ORDER_STATUS.PAID]: 'Sudah Dibayar',
  [ORDER_STATUS.COOKING]: 'Sedang Dimasak',
  [ORDER_STATUS.DONE]: 'Selesai',
  [ORDER_STATUS.CANCELLED]: 'Dibatalkan',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PAID]: 'processing',
  [ORDER_STATUS.COOKING]: 'orange',
  [ORDER_STATUS.DONE]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  KASIR: 'kasir',
  WAITER: 'waiter',
} as const;

// Table Status
export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'pesanin_token',
  USER: 'pesanin_user',
  CART: 'pesanin_cart',
  TABLE_ID: 'pesanin_table_id',
};
