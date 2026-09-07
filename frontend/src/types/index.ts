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

// Monthly Intelligence & Expense Health
export interface CategoryBreakdownExtended {
  categoryId: string;
  categoryName: string;
  color: string;
  icon?: string;
  amount: number;
  percentageShare: number;
  receiptCount: number;
  momChangePercentage: number;
}

export interface MonthlyIntelligence {
  targetMonth: string;
  monthName: string;
  totalExpenses: number;
  momChangePercentage?: number;
  totalReceipts: number;
  categorizedReceipts: number;
  uncategorizedReceipts: number;
  averageReceiptAmount?: number;
  largestExpenseAmount?: number;
  largestExpenseVendor?: string;
  topCategoryName?: string;
  topCategoryAmount?: number;
  categoryBreakdown: CategoryBreakdownExtended[];
  keyInsights: string[];
}

export interface ExpenseHealth {
  score: number;
  statusLabel: string;
  categorizationRate: number;
  validAmountRate: number;
  reviewedRate: number;
  validVendorRate: number;
  unresolvedCount: number;
  duplicateWarningCount: number;
  positiveFactors: string[];
  warningFactors: string[];
}

export interface VendorAnalytics {
  vendorName: string;
  totalSpent: number;
  receiptCount: number;
  averageTransaction: number;
  highestTransaction: number;
  currentMonthSpending: number;
  previousMonthSpending: number;
  momPercentageChange?: number;
  isRecurring: boolean;
  frequencyPattern?: string;
  recentReceipts: Receipt[];
}

export interface ExpenseAlert {
  id: string;
  userId: string;
  type: 'MOM_SPIKE' | 'UNREVIEWED_BACKLOG' | 'LARGE_TRANSACTION' | 'RECURRING_DUE' | 'CATEGORY_BUDGET_EXCEEDED';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  contextData?: string;
  isDismissed: boolean;
  createdAt: string;
}

export interface UserNotificationPreferences {
  id?: string;
  userId?: string;
  largeTransactionThreshold: number;
  momSpikeThresholdPercent: number;
  emailAlertsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  monthlyReviewDigestEnabled: boolean;
  unreviewedBacklogAlertEnabled: boolean;
}

export interface MonthlyReview {
  targetMonth: string;
  monthName: string;
  totalExpenses: number;
  totalReceiptsCount: number;
  momChangePercentage?: number;
  topCategoryName: string;
  topCategoryAmount: number;
  totalTaxClaimable: number;
  uncategorizedCount: number;
  needsReviewCount: number;
  missingReceiptNumberCount: number;
  executiveSummary: string[];
  recommendedActions: string[];
  caExportAvailable: boolean;
}

export interface CaReview {
  targetMonth: string;
  monthName: string;
  totalMonthExpenses: number;
  totalClaimableTax: number;
  verifiedCount: number;
  flaggedCount: number;
  isCleanAndReady: boolean;
  nextIssueReceiptId?: string;
  cleanPercentage: number;
  complianceNotes: string[];
}

export interface AskQueryRequest {
  query: string;
}

export interface AskQueryResponse {
  originalQuery: string;
  answerText: string;
  calculatedTotal: number;
  receiptCount: number;
  relevantReceipts: Receipt[];
}

export interface Streak {
  currentWeekStreak: number;
  activeMonthsCount: number;
  totalOrganizedReceipts: number;
  streakLabel: string;
}

export interface UserMilestone {
  id: string;
  userId: string;
  milestoneKey: string;
  title: string;
  description: string;
  badgeIcon?: string;
  achievedAt: string;
}

export interface UserFeedback {
  id: string;
  userId: string;
  feedbackType: 'BUG_REPORT' | 'FEATURE_SUGGESTION' | 'OCR_CORRECTION' | 'COPILOT_FEEDBACK' | 'GENERAL';
  featureArea?: string;
  rating?: number;
  message: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CreateFeedbackRequest {
  feedbackType: 'BUG_REPORT' | 'FEATURE_SUGGESTION' | 'OCR_CORRECTION' | 'COPILOT_FEEDBACK' | 'GENERAL';
  featureArea?: string;
  rating?: number;
  message: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  target?: string;
  ipAddress?: string;
  requestId?: string;
  status: string;
  details?: string;
  createdAt: string;
}

export interface HealthStatus {
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'FAILING';
  components: Record<string, string>;
  activeUsers: number;
  totalReceipts: number;
  ocrSuccessRate: number;
  timestamp: string;
}

export interface ReferralItem {
  id: string;
  referrerId: string;
  referredId?: string;
  referralCode: string;
  status: 'PENDING' | 'ACTIVATED' | 'REWARDED';
  rewardGranted?: string;
  createdAt: string;
  activatedAt?: string;
}

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalInvites: number;
  activatedReferrals: number;
  pendingReferrals: number;
  currentRewardBonus: string;
  referralHistory: ReferralItem[];
}

export interface WeeklySummary {
  weekStartDate: string;
  weekEndDate: string;
  totalWeeklySpent: number;
  totalWeeklyTransactions: number;
  topCategoryName: string;
  topCategoryAmount: number;
  largestExpenseVendor: string;
  largestExpenseAmount: number;
  wowPercentageChange: number;
  receiptsNeedingReview: number;
  potentialRecurringCount: number;
  weeklySummaryInsight: string;
}

export interface FounderMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsersMonthly: number;
  activeUsersDaily: number;
  activationRatePercentage: number;
  retentionRate7Day: number;
  retentionRate30Day: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  activePaidSubscriptions: number;
  freeToPaidConversionRate: number;
  averageRevenuePerUser: number;
  totalCancellations: number;
  churnRatePercentage: number;
  cancellationReasonsBreakdown: Record<string, number>;
  totalReferralInvites: number;
  activatedReferrals: number;
  referralConversionRate: number;
  totalReceiptsProcessed: number;
  totalCopilotQueries: number;
  generatedTimestamp: string;
}

export interface CancelSubscriptionRequest {
  reason: 'TOO_EXPENSIVE' | 'NOT_USING_ENOUGH' | 'MISSING_FEATURE' | 'OCR_ISSUES' | 'OTHER';
  feedback?: string;
}



