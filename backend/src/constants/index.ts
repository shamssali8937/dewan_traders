export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const INQUIRY_STATUS = {
  PENDING: 'pending',
  READ: 'read',
  RESPONDED: 'responded',
  CLOSED: 'closed',
} as const;

export const PRODUCT_CATEGORIES = {
  FRUITS: 'fruits',
  VEGETABLES: 'vegetables',
  SURGICAL: 'surgical',
  SPORTS: 'sports',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;
