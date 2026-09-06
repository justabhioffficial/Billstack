import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { reportApi, exportApi } from '../../services/api';
import { MonthlyReport } from '../../types';
import { BarChart3, Download, FileSpreadsheet, Calendar, PieChart as PieIcon, Store } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await reportApi.getMonthlyReport(month);
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [month]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
              <p className="text-xs text-slate-500">Tax-ready expense summaries and vendor breakdowns</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Month Selector */}
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <a
                href={exportApi.getExportCsvUrl()}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </a>
              <a
                href={exportApi.getExportExcelUrl()}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white font-semibold text-xs rounded-lg hover:bg-brand-700 shadow-sm transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel (.xlsx)
              </a>
            </div>
          </div>

          {/* Report Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Expenses</span>
              <p className="text-2xl font-extrabold text-slate-900">₹{report?.totalExpenses?.toLocaleString('en-IN') || '0.00'}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-emerald-600 uppercase">Business Deductible</span>
              <p className="text-2xl font-extrabold text-slate-900">₹{report?.businessExpenses?.toLocaleString('en-IN') || '0.00'}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Personal</span>
              <p className="text-2xl font-extrabold text-slate-900">₹{report?.personalExpenses?.toLocaleString('en-IN') || '0.00'}</p>
            </div>
          </div>

          {/* Category & Vendor Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Table */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-brand-600" />
                Expenses by Category
              </h3>

              {report?.categoryBreakdown && report.categoryBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {report.categoryBreakdown.map((cat) => (
                    <div key={cat.categoryId} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800">{cat.categoryName} ({cat.count} receipts)</span>
                        <span className="font-bold text-slate-900">₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color || '#2563EB' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No expense records for this period.</p>
              )}
            </div>

            {/* Vendor Breakdown Table */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600" />
                Top Vendor Spending
              </h3>

              {report?.vendorBreakdown && report.vendorBreakdown.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {report.vendorBreakdown.map((v, i) => (
                    <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{v.vendorName}</span>
                        <span className="block text-[11px] text-slate-400">{v.count} receipt(s)</span>
                      </div>
                      <span className="font-extrabold text-slate-900">₹{v.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No vendor records for this period.</p>
              )}
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
