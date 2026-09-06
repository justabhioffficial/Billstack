export interface User {
  id: string;
  email: string;
  name: string;
  businessType?: string;
  country: string;
  currency: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export type OcrStatus = 'UPLOADED' | 'PROCESSING' | 'NEEDS_REVIEW' | 'COMPLETED' | 'FAILED';
export type ReceiptSource = 'WEB' | 'MOBILE' | 'WHATSAPP' | 'API' | 'MANUAL';

export interface Receipt {
  id: string;
  userId: string;
  vendorName?: string;
  receiptDate?: string;
  totalAmount?: number;
  taxAmount?: number;
  currency: string;
  receiptNumber?: string;
  paymentMode?: string;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  isBusiness: boolean;
  fileKey: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  source: ReceiptSource;
  ocrStatus: OcrStatus;
  ocrRawText?: string;
  overallConfidence?: number;
  fileUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
}

export interface CategorizationRule {
  id: string;
  vendorPattern: string;
  categoryId: string;
  categoryName?: string;
  active: boolean;
  createdAt: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface VendorBreakdown {
  vendorName: string;
  amount: number;
  count: number;
}

export interface SpendingTrend {
  dateOrMonth: string;
  amount: number;
  businessAmount: number;
  personalAmount: number;
}

export interface MonthlyReport {
  yearMonth: string;
  totalExpenses: number;
  businessExpenses: number;
  personalExpenses: number;
  totalReceiptsCount: number;
  topCategoryName: string;
  categoryBreakdown: CategoryBreakdown[];
  vendorBreakdown: VendorBreakdown[];
  monthlyTrend: SpendingTrend[];
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'PRO';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  monthlyUsageCount: number;
  monthlyLimit: number;
  isLimitReached: boolean;
}

export interface CheckoutResponse {
  orderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  plan: string;
  userEmail: string;
  userName: string;
}

export interface AdminStats {
  totalUsers: number;
  totalReceipts: number;
  failedOcrCount: number;
  freeUsersCount: number;
  proUsersCount: number;
  monthlyRecurringRevenue: number;
  failedPaymentsCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
