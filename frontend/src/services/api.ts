import axios from 'axios';
import { ApiResponse, AuthResponse, User, Receipt, PagedResponse, Category, CategorizationRule, MonthlyReport, Subscription, CheckoutResponse, AdminStats, MonthlyIntelligence, ExpenseHealth, VendorAnalytics, ExpenseAlert, UserNotificationPreferences, MonthlyReview, CaReview, AskQueryRequest, AskQueryResponse, Streak, UserMilestone, UserFeedback, CreateFeedbackRequest, AuditLog, HealthStatus, ReferralStats, FounderMetrics, WeeklySummary, CancelSubscriptionRequest } from '../types';

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
  verifyRegistrationOtp: (data: { email: string; otp: string }) => api.post<ApiResponse<AuthResponse>>('/auth/verify-registration-otp', data),
  resendOtp: (data: { email: string; purpose?: string }) => api.post<ApiResponse<void>>('/auth/resend-otp', data),
  login: (data: any) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  requestLoginOtp: (data: { email: string }) => api.post<ApiResponse<void>>('/auth/request-login-otp', data),
  loginWithOtp: (data: { email: string; otp: string }) => api.post<ApiResponse<AuthResponse>>('/auth/login-with-otp', data),
  forgotPassword: (data: { email: string }) => api.post<ApiResponse<void>>('/auth/forgot-password', data),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => api.post<ApiResponse<void>>('/auth/reset-password', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.post<ApiResponse<void>>('/auth/change-password', data),
  logout: () => api.post<ApiResponse<void>>('/auth/logout'),
  getCurrentUser: () => api.get<ApiResponse<User>>('/me'),
  updateUser: (data: any) => api.put<ApiResponse<User>>('/me', data),
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
    const token = localStorage.getItem('billstack_token');
    let url = `${API_BASE_URL}/exports/receipts.csv?`;
    if (token) url += `token=${encodeURIComponent(token)}&`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    return url;
  },
  getExportExcelUrl: (startDate?: string, endDate?: string) => {
    const token = localStorage.getItem('billstack_token');
    let url = `${API_BASE_URL}/exports/receipts.xlsx?`;
    if (token) url += `token=${encodeURIComponent(token)}&`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    return url;
  },
  downloadCsv: (startDate?: string, endDate?: string) =>
    api.get('/exports/receipts.csv', { params: { startDate, endDate }, responseType: 'blob' }),
  downloadExcel: (startDate?: string, endDate?: string) =>
    api.get('/exports/receipts.xlsx', { params: { startDate, endDate }, responseType: 'blob' }),
};

export const subscriptionApi = {
  getSubscription: () => api.get<ApiResponse<Subscription>>('/subscription'),
  createCheckout: (plan: string, billingCycle: string = 'MONTHLY') => api.post<ApiResponse<CheckoutResponse>>('/subscription/checkout', { plan, billingCycle }),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => api.post<ApiResponse<Subscription>>('/subscription/verify', data),
  cancelSubscription: (data: CancelSubscriptionRequest) => api.post<ApiResponse<Subscription>>('/subscription/cancel', data),
};

export const adminApi = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
  getHealth: () => api.get<ApiResponse<HealthStatus>>('/admin/health'),
  getFounderMetrics: () => api.get<ApiResponse<FounderMetrics>>('/admin/founder-metrics'),
  getAuditLogs: (page = 0, size = 20) => api.get<ApiResponse<PagedResponse<AuditLog>>>('/admin/audit-logs', { params: { page, size } }),
  getFeedbackList: (page = 0, size = 15, status?: string) => api.get<ApiResponse<PagedResponse<UserFeedback>>>('/admin/feedback', { params: { page, size, status } }),
  updateFeedbackStatus: (id: string, status: string, adminNotes?: string) => api.put<ApiResponse<UserFeedback>>(`/admin/feedback/${id}/status`, null, { params: { status, adminNotes } }),
  getAnalyticsFunnel: () => api.get<ApiResponse<Record<string, any>>>('/admin/analytics/funnel'),
};

export const referralApi = {
  getStats: () => api.get<ApiResponse<ReferralStats>>('/referrals/stats'),
  trackReferral: (referralCode: string) => api.post<ApiResponse<void>>('/referrals/track', { referralCode }),
};

export const feedbackApi = {
  submitFeedback: (data: CreateFeedbackRequest) => api.post<ApiResponse<UserFeedback>>('/feedback', data),
  getUserFeedback: () => api.get<ApiResponse<UserFeedback[]>>('/feedback'),
};

export const intelligenceApi = {
  getMonthlyIntelligence: (year?: number, month?: number) => api.get<ApiResponse<MonthlyIntelligence>>('/intelligence/monthly', { params: { year, month } }),
  getExpenseHealth: () => api.get<ApiResponse<ExpenseHealth>>('/intelligence/health'),
  getWeeklySummary: () => api.get<ApiResponse<WeeklySummary>>('/intelligence/weekly-summary'),
};

export const vendorApi = {
  getVendorAnalytics: () => api.get<ApiResponse<VendorAnalytics[]>>('/vendors'),
};

export const alertApi = {
  getAlerts: () => api.get<ApiResponse<ExpenseAlert[]>>('/alerts'),
  dismissAlert: (alertId: string) => api.post<ApiResponse<void>>(`/alerts/${alertId}/dismiss`),
  getPreferences: () => api.get<ApiResponse<UserNotificationPreferences>>('/alerts/preferences'),
  updatePreferences: (preferences: UserNotificationPreferences) => api.put<ApiResponse<UserNotificationPreferences>>('/alerts/preferences', preferences),
};

export const monthlyReviewApi = {
  getMonthlyReview: (year?: number, month?: number) => api.get<ApiResponse<MonthlyReview>>('/monthly-review', { params: { year, month } }),
  getCaReview: (year?: number, month?: number) => api.get<ApiResponse<CaReview>>('/ca-review', { params: { year, month } }),
};

export const gamificationApi = {
  getStreaks: () => api.get<ApiResponse<Streak>>('/gamification/streaks'),
  getMilestones: () => api.get<ApiResponse<UserMilestone[]>>('/gamification/milestones'),
};

export const askApi = {
  query: (data: AskQueryRequest) => api.post<ApiResponse<AskQueryResponse>>('/ask', data),
};



