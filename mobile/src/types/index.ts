export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PRO' | 'BUSINESS';
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Receipt {
  id: string;
  userId: string;
  originalFilename: string;
  vendorName?: string;
  totalAmount?: number;
  taxAmount?: number;
  receiptDate?: string;
  currency?: string;
  receiptNumber?: string;
  paymentMode?: string;
  ocrStatus: 'PROCESSING' | 'COMPLETED' | 'NEEDS_REVIEW' | 'FAILED';
  overallConfidence?: number;
  ocrRawText?: string;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  isBusiness: boolean;
  fileUrl?: string;
  createdAt?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isSystem: boolean;
}

export interface MonthlyIntelligence {
  month: string;
  totalSpent: number;
  receiptCount: number;
  previousMonthSpent: number;
  momChangePercentage: number;
  averageReceiptAmount: number;
  minReceiptAmount: number;
  maxReceiptAmount: number;
  organizationScore: number;
  estimatedTimeSavedMinutes: number;
}

export interface VendorAnalytics {
  vendorName: string;
  receiptCount: number;
  totalSpent: number;
  averageAmount: number;
  maxAmount: number;
}

export interface ExpenseHealth {
  score: number;
  categorizedCount: number;
  totalCount: number;
  unreviewedCount: number;
  healthGrade: string;
}

export interface AskQueryRequest {
  prompt: string;
}

export interface AskQueryResponse {
  query: string;
  intent: string;
  answer: string;
  sqlQuery?: string;
  receipts?: Receipt[];
}
