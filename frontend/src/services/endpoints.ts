import api from './api';

export interface LoginInput { email: string; password: string; }
export interface RegisterInput {
  name: string; email: string; password: string; phone?: string;
  userType: 'individual' | 'company';
  companyName?: string; companyReg?: string; taxNumber?: string;
  address?: string; city?: string;
}

export const authApi = {
  login: (data: LoginInput) => api.post('/auth/login', data),
  register: (data: RegisterInput) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
};

export const productApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: string, data: unknown) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data: unknown) => api.post('/categories', data),
  update: (id: string, data: unknown) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const inquiryApi = {
  create: (data: unknown) => api.post('/inquiries', data),
  getAll: (params?: Record<string, unknown>) => api.get('/inquiries', { params }),
  getById: (id: string) => api.get(`/inquiries/${id}`),
  updateStatus: (id: string, data: unknown) => api.patch(`/inquiries/${id}/status`, data),
  delete: (id: string) => api.delete(`/inquiries/${id}`),
};

export const orderApi = {
  create: (data: unknown) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getAll: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  updateStatus: (id: string, data: unknown) => api.patch(`/orders/${id}/status`, data),
};

export const journalApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/journal', { params }),
  getBySlug: (slug: string) => api.get(`/journal/${slug}`),
  create: (data: unknown) => api.post('/journal', data),
  update: (id: string, data: unknown) => api.put(`/journal/${id}`, data),
  delete: (id: string) => api.delete(`/journal/${id}`),
  getAllAdmin: (params?: Record<string, unknown>) => api.get('/journal/admin/all', { params }),
};

export const cmsApi = {
  getPage: (page: string) => api.get(`/cms/pages/${page}`),
  updatePage: (page: string, data: unknown) => api.put(`/cms/pages/${page}`, data),
  getContactInfo: () => api.get('/cms/contact'),
  updateContactInfo: (data: unknown) => api.put('/cms/contact', data),
  getTestimonials: () => api.get('/cms/testimonials'),
  createTestimonial: (data: unknown) => api.post('/cms/testimonials', data),
  updateTestimonial: (id: string, data: unknown) => api.put(`/cms/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/cms/testimonials/${id}`),
  getDashboardStats: () => api.get('/cms/dashboard'),
};
