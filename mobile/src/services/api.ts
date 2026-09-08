import axios from 'axios';
import { Platform } from 'react-native';
import { ApiResponse, AuthResponse, User, Receipt, PagedResponse, Category, MonthlyIntelligence, VendorAnalytics, ExpenseHealth, AskQueryRequest, AskQueryResponse } from '../types';

// In Android emulator localhost is 10.0.2.2; on iOS / physical device, standard localhost or local IP
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api/v1';
  }
  return 'http://localhost:8080/api/v1';
};

export const API_BASE_URL = getBaseUrl();

let tokenStorage: { [key: string]: string } = {};

export const setAuthToken = (token: string | null) => {
  if (token) {
    tokenStorage['billstack_token'] = token;
  } else {
    delete tokenStorage['billstack_token'];
  }
};

export const getAuthToken = () => {
  return tokenStorage['billstack_token'] || null;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) => api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get<ApiResponse<User>>('/me'),
};

export const receiptApi = {
  getReceipts: (params: Record<string, any>) => api.get<ApiResponse<PagedResponse<Receipt>>>('/receipts', { params }),
  getReceiptById: (id: string) => api.get<ApiResponse<Receipt>>(`/receipts/${id}`),
  updateReceipt: (id: string, data: Partial<Receipt>) => api.put<ApiResponse<Receipt>>(`/receipts/${id}`, data),
  deleteReceipt: (id: string) => api.delete<ApiResponse<void>>(`/receipts/${id}`),
  uploadReceipt: (formData: FormData) => api.post<ApiResponse<Receipt>>('/receipts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const categoryApi = {
  getCategories: () => api.get<ApiResponse<Category[]>>('/categories'),
};

export const intelligenceApi = {
  getMonthlyIntelligence: () => api.get<ApiResponse<MonthlyIntelligence>>('/intelligence/monthly'),
  getExpenseHealth: () => api.get<ApiResponse<ExpenseHealth>>('/intelligence/health'),
};

export const vendorApi = {
  getVendorAnalytics: () => api.get<ApiResponse<VendorAnalytics[]>>('/vendors'),
};

export const askApi = {
  query: (data: AskQueryRequest) => api.post<ApiResponse<AskQueryResponse>>('/ask', data),
};
