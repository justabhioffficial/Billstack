import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Pages
const LandingPage = React.lazy(() => import('./pages/Public/LandingPage').then(m => ({ default: m.LandingPage })));
const PricingPage = React.lazy(() => import('./pages/Public/PricingPage').then(m => ({ default: m.PricingPage })));
const AboutPage = React.lazy(() => import('./pages/Public/AboutPage').then(m => ({ default: m.AboutPage })));
const FaqPage = React.lazy(() => import('./pages/Public/FaqPage').then(m => ({ default: m.FaqPage })));
const TermsPage = React.lazy(() => import('./pages/Public/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = React.lazy(() => import('./pages/Public/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

// Auth Pages
const LoginPage = React.lazy(() => import('./pages/Auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/Auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/Auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

// Protected App Pages
const OnboardingPage = React.lazy(() => import('./pages/App/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = React.lazy(() => import('./pages/App/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ReceiptsPage = React.lazy(() => import('./pages/App/ReceiptsPage').then(m => ({ default: m.ReceiptsPage })));
const ReceiptDetailsPage = React.lazy(() => import('./pages/App/ReceiptDetailsPage').then(m => ({ default: m.ReceiptDetailsPage })));
const CategoriesPage = React.lazy(() => import('./pages/App/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const ReportsPage = React.lazy(() => import('./pages/App/ReportsPage').then(m => ({ default: m.ReportsPage })));
const BillingPage = React.lazy(() => import('./pages/App/BillingPage').then(m => ({ default: m.BillingPage })));
const SettingsPage = React.lazy(() => import('./pages/App/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdminPage = React.lazy(() => import('./pages/App/AdminPage').then(m => ({ default: m.AdminPage })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated || user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="billstack-global-bg" aria-hidden="true" />
      <BrowserRouter>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated App Routes */}
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/receipts" element={<ProtectedRoute><ReceiptsPage /></ProtectedRoute>} />
            <Route path="/receipts/:id" element={<ProtectedRoute><ReceiptDetailsPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
