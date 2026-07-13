import axios from 'axios';
import { mockDb } from './mockDb';
import { useAuthStore } from '../store/authStore';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Mock Request Handler Fallback ─────────────────────────────────
async function handleMockRequest(config: any) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : null;
  const params = config.params || {};

  console.warn(`⚠️ Backend offline. Falling back to browser Local Mock DB for ${method.toUpperCase()} ${url}`);

  let responseData: any = null;

  try {
    // 1. Auth endpoints
    if (url.startsWith('/auth/login')) {
      const { email } = data || {};
      const res = mockDb.login(email);
      responseData = { success: true, message: 'Logged in (mock mode)', data: res };
    } else if (url.startsWith('/auth/register')) {
      const res = mockDb.register(data);
      responseData = { success: true, message: 'Registered (mock mode)', data: res };
    } else if (url.startsWith('/auth/logout')) {
      responseData = { success: true, message: 'Logged out (mock mode)' };
    } else if (url.startsWith('/auth/me')) {
      let currentUser = null;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dewan-auth');
        if (stored) {
          currentUser = JSON.parse(stored).state?.user;
        }
      }
      responseData = { success: true, data: currentUser };
    }
    // 2. Products endpoints
    else if (url.startsWith('/products/featured')) {
      const res = mockDb.getProducts({ featured: true });
      responseData = { success: true, data: res.products };
    } else if (url.startsWith('/products/')) {
      const slugOrId = url.replace('/products/', '');
      const product = mockDb.getProductBySlug(slugOrId) || mockDb.getProducts().products.find(p => p.id === slugOrId);
      responseData = { success: true, data: product };
    } else if (url === '/products') {
      if (method === 'post') {
        const product = mockDb.createProduct(data);
        responseData = { success: true, message: 'Product created (mock mode)', data: product };
      } else {
        const res = mockDb.getProducts(params);
        responseData = { success: true, data: res };
      }
    } else if (url.startsWith('/products/')) {
      const id = url.replace('/products/', '');
      if (method === 'put') {
        const product = mockDb.updateProduct(id, data);
        responseData = { success: true, message: 'Product updated (mock mode)', data: product };
      } else if (method === 'delete') {
        mockDb.deleteProduct(id);
        responseData = { success: true, message: 'Product deleted (mock mode)' };
      }
    }
    // 3. Categories endpoints
    else if (url === '/categories') {
      const res = mockDb.getCategories();
      responseData = { success: true, data: res };
    }
    // 4. Inquiries endpoints
    else if (url === '/inquiries') {
      if (method === 'post') {
        const inq = mockDb.createInquiry(data);
        responseData = { success: true, message: 'Inquiry submitted (mock mode)', data: inq };
      } else {
        const res = mockDb.getInquiries(params);
        responseData = { success: true, data: res };
      }
    } else if (url.startsWith('/inquiries/')) {
      const id = url.split('/')[2];
      if (url.endsWith('/status')) {
        const inq = mockDb.updateInquiryStatus(id, data.status, data.adminNotes);
        responseData = { success: true, message: 'Inquiry updated (mock mode)', data: inq };
      } else if (method === 'delete') {
        mockDb.deleteInquiry(id);
        responseData = { success: true, message: 'Inquiry deleted (mock mode)' };
      }
    }
    // 5. Orders endpoints
    else if (url === '/orders') {
      if (method === 'post') {
        let userId = 'u-user';
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('dewan-auth');
          if (stored) {
            userId = JSON.parse(stored).state?.user?.id || 'u-user';
          }
        }
        const order = mockDb.createOrder(userId, data);
        responseData = { success: true, message: 'Order placed (mock mode)', data: order };
      } else {
        const res = mockDb.getOrders(params);
        responseData = { success: true, data: res };
      }
    } else if (url.startsWith('/orders/my-orders')) {
      let userId = 'u-user';
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dewan-auth');
        if (stored) {
          userId = JSON.parse(stored).state?.user?.id || 'u-user';
        }
      }
      const res = mockDb.getMyOrders(userId);
      responseData = { success: true, data: res };
    } else if (url.startsWith('/orders/track/')) {
      const orderNumber = url.replace('/orders/track/', '');
      const order = mockDb.getOrders().orders.find(o => o.orderNumber === orderNumber);
      if (!order) {
        responseData = { success: false, message: 'Cargo tracking reference not found' };
      } else {
        responseData = { success: true, data: order };
      }
    } else if (url.startsWith('/orders/')) {
      const id = url.split('/')[2];
      if (url.endsWith('/status')) {
        const order = mockDb.updateOrderStatus(id, data.status, data.trackingNumber);
        responseData = { success: true, message: 'Order status updated (mock mode)', data: order };
      } else {
        const order = mockDb.getOrders().orders.find(o => o.id === id);
        responseData = { success: true, data: order };
      }
    }
    // 6. Journal endpoints
    else if (url === '/journal' || url.startsWith('/journal/admin/')) {
      const res = mockDb.getJournalPosts(params);
      responseData = { success: true, data: res };
    } else if (url.startsWith('/journal/')) {
      const slug = url.replace('/journal/', '');
      const post = mockDb.getJournalPosts().posts.find(p => p.slug === slug);
      responseData = { success: true, data: post };
    }
    // 7. CMS endpoints
    else if (url.startsWith('/cms/pages/')) {
      const page = url.replace('/cms/pages/', '');
      if (method === 'put') {
        const content = mockDb.updatePageContent(page, data);
        responseData = { success: true, data: content };
      } else {
        const content = mockDb.getPageContent(page);
        responseData = { success: true, data: content };
      }
    } else if (url === '/cms/contact') {
      if (method === 'put') {
        const info = mockDb.updateContactInfo(data);
        responseData = { success: true, data: info };
      } else {
        const info = mockDb.getContactInfo();
        responseData = { success: true, data: info };
      }
    } else if (url === '/cms/testimonials') {
      if (method === 'post') {
        const t = mockDb.createTestimonial(data);
        responseData = { success: true, data: t };
      } else {
        const list = mockDb.getTestimonials();
        responseData = { success: true, data: list };
      }
    } else if (url.startsWith('/cms/testimonials/')) {
      const id = url.replace('/cms/testimonials/', '');
      if (method === 'put') {
        const t = mockDb.updateTestimonial(id, data);
        responseData = { success: true, data: t };
      } else if (method === 'delete') {
        mockDb.deleteTestimonial(id);
        responseData = { success: true };
      }
    } else if (url === '/cms/dashboard') {
      const stats = mockDb.getDashboardStats();
      responseData = { success: true, data: stats };
    }
  } catch (err) {
    console.error('Error handling mock request:', err);
  }

  return {
    data: responseData || { success: true, data: {} },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}

// ─── Request Interceptor ─────────────────────────────────────────
// Primary auth: attach accessToken from Zustand store as Bearer header.
// This ensures authenticated requests work across different domains in production
// (Vercel frontend → Render backend) where cross-origin cookies may be blocked.
// The backend also accepts cookies as a fallback (req.cookies?.accessToken).
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store (persisted in localStorage via zustand/persist)
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Auto Refresh Token & Mock Fallback ─────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // In production, never fall back to mock — reject properly
    if (process.env.NODE_ENV === 'production') {
      return Promise.reject(error);
    }
    // Check if network error or connection refused (backend server is down)
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status >= 500) {
      return handleMockRequest(originalRequest);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post('/auth/refresh');
        const accessToken = refreshResponse.data?.data?.accessToken;

        if (accessToken) {
          // Persist new token in Zustand store (also saves to localStorage via zustand/persist)
          useAuthStore.getState().setToken(accessToken);
          // Immediately attach the new token to the retried request header
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
