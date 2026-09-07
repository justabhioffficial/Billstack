import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { SeoHead } from '../../components/SeoHead';
import { adminApi } from '../../services/api';
import { FounderMetrics } from '../../types';
import {
  TrendingUp,
  DollarSign,
  Users,
  UserCheck,
  UserX,
  Share2,
  PieChart,
  RefreshCw,
  Zap,
  Activity,
} from 'lucide-react';

export const FounderDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<FounderMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchFounderMetrics = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getFounderMetrics();
      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch (ignored) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchFounderMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <SeoHead title="Founder & Executive Business Dashboard — BillStack" />
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 pb-20 md:pb-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 rounded-xl text-white shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Founder Business Intelligence</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real database metrics: User activation, MRR, ARR, churn reasons, and viral acquisition
                </p>
              </div>
            </div>
            <button
              onClick={fetchFounderMetrics}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Telemetry
            </button>
          </div>

          {/* Revenue & Growth Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Monthly Recurring Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{(metrics?.monthlyRecurringRevenue || 0).toLocaleString('en-IN')}</p>
              <span className="text-xs text-slate-500">ARR: ₹{(metrics?.annualRecurringRevenue || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">User Activation Rate</span>
                <UserCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.activationRatePercentage || 0}%</p>
              <span className="text-xs text-indigo-600 font-medium">Uploaded 1st receipt</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Free $\rightarrow$ Paid Conversion</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.freeToPaidConversionRate || 0}%</p>
              <span className="text-xs text-slate-500">{metrics?.activePaidSubscriptions || 0} active Pro subscribers</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase text-rose-600">Churn Rate</span>
                <UserX className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.churnRatePercentage || 0}%</p>
              <span className="text-xs text-slate-500">{metrics?.totalCancellations || 0} total cancellations</span>
            </div>
          </div>

          {/* User Retention & Churn Reasons Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Retention Cohort Metrics</h2>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="font-medium text-slate-600 dark:text-slate-300">7-Day User Retention</span>
                  <span className="font-bold text-indigo-600">{metrics?.retentionRate7Day || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="font-medium text-slate-600 dark:text-slate-300">30-Day User Retention</span>
                  <span className="font-bold text-indigo-600">{metrics?.retentionRate30Day || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Average Revenue Per User (ARPU)</span>
                  <span className="font-bold text-emerald-600">₹{metrics?.averageRevenuePerUser || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Churn & Cancellation Reasons</h2>
              </div>
              <div className="space-y-2 text-xs">
                {metrics?.cancellationReasonsBreakdown && Object.keys(metrics.cancellationReasonsBreakdown).length > 0 ? (
                  Object.entries(metrics.cancellationReasonsBreakdown).map(([reason, count]) => (
                    <div key={reason} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{reason}</span>
                      <span className="font-bold text-rose-600">{count} users</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No cancellation feedback recorded.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
