import axios from 'axios';
import { ApiResponse, AuthResponse, User, Receipt, PagedResponse, Category, CategorizationRule, MonthlyReport, Subscription, CheckoutResponse, AdminStats } from '../types';

const getApiBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return '/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('billstack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Prevent browser/CDN 304 stale caching for real-time updates
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('billstack_refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post<ApiResponse<AuthResponse>>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data.success) {
            localStorage.setItem('billstack_token', res.data.data.accessToken);
            localStorage.setItem('billstack_refresh_token', res.data.data.refreshToken);
            error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return axios(error.config);
          }
        } catch (e) {
          localStorage.removeItem('billstack_token');
          localStorage.removeItem('billstack_refresh_token');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('billstack_token');
        localStorage.removeItem('billstack_refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: any) => api.post<ApiResponse<AuthResponse>>('/auth/register', data),
  login: (data: any) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  logout: () => api.post<ApiResponse<void>>('/auth/logout'),
  getCurrentUser: () => api.get<ApiResponse<User>>('/me'),
  updateUser: (data: any) => api.put<ApiResponse<User>>('/me', data),
  seedPastData: () => api.post<ApiResponse<string>>('/me/seed-past-data'),
};

export const receiptApi = {
  upload: (file: File, source: string = 'WEB') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);
    return api.post<ApiResponse<Receipt>>('/receipts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getReceipts: (params: Record<string, any>) => api.get<ApiResponse<PagedResponse<Receipt>>>('/receipts', { params }),
  getReceiptById: (id: string) => api.get<ApiResponse<Receipt>>(`/receipts/${id}`),
  updateReceipt: (id: string, data: any) => api.put<ApiResponse<Receipt>>(`/receipts/${id}`, data),
  deleteReceipt: (id: string) => api.delete<ApiResponse<void>>(`/receipts/${id}`),
};

export const categoryApi = {
  getCategories: () => api.get<ApiResponse<Category[]>>('/categories'),
  createCategory: (data: { name: string; icon?: string; color?: string }) => api.post<ApiResponse<Category>>('/categories', data),
};

export const ruleApi = {
  getRules: () => api.get<ApiResponse<CategorizationRule[]>>('/categorization-rules'),
  createRule: (data: { vendorPattern: string; categoryId: string }) => api.post<ApiResponse<CategorizationRule>>('/categorization-rules', data),
  deleteRule: (id: string) => api.delete<ApiResponse<void>>(`/categorization-rules/${id}`),
};

export const reportApi = {
  getMonthlyReport: (month?: string) => api.get<ApiResponse<MonthlyReport>>('/reports/monthly', { params: { month } }),
};

export const exportApi = {
  getExportCsvUrl: (startDate?: string, endDate?: string) => {
    let url = `${API_BASE_URL}/exports/receipts.csv?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    return url;
  },
  getExportExcelUrl: (startDate?: string, endDate?: string) => {
    let url = `${API_BASE_URL}/exports/receipts.xlsx?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    return url;
  },
};

export const subscriptionApi = {
  getSubscription: () => api.get<ApiResponse<Subscription>>('/subscription'),
  createCheckout: (plan: string, billingCycle: string = 'MONTHLY') => api.post<ApiResponse<CheckoutResponse>>('/subscription/checkout', { plan, billingCycle }),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => api.post<ApiResponse<Subscription>>('/subscription/verify', data),
};

export const adminApi = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
};
