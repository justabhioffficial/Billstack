import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { adminApi } from '../../services/api';
import { AdminStats } from '../../types';
import { ShieldAlert, Users, Receipt, FileWarning, CreditCard, DollarSign } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (ignored) {}
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-brand-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
              <p className="text-xs text-slate-500">System health, platform metrics, and OCR failure monitoring</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Total Users</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</p>
              <span className="text-[11px] text-slate-500">Free: {stats?.freeUsersCount || 0} | Pro: {stats?.proUsersCount || 0}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Receipts Processed</span>
                <Receipt className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stats?.totalReceipts || 0}</p>
              <span className="text-[11px] text-slate-500">Total ingested receipts</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Monthly Recurring Revenue</span>
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">₹{stats?.monthlyRecurringRevenue || 0}</p>
              <span className="text-[11px] text-slate-500">Estimated MRR</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase text-rose-600">OCR Failures</span>
                <FileWarning className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stats?.failedOcrCount || 0}</p>
              <span className="text-[11px] text-rose-600 font-medium">Receipts needing manual review</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase text-amber-600">Failed Payments</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stats?.failedPaymentsCount || 0}</p>
              <span className="text-[11px] text-slate-500">Subscription checkout issues</span>
            </div>
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
