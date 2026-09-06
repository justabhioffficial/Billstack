import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { Badge } from '../../components/Badge';
import { reportApi, receiptApi, authApi } from '../../services/api';
import { MonthlyReport, Receipt } from '../../types';
import { IndianRupee, Briefcase, User as UserIcon, Receipt as ReceiptIcon, ArrowUpRight, Plus, PieChart as PieIcon, TrendingUp, Calendar, RefreshCw, Sparkles } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const monthsList = [
    { label: 'Sep 2026', value: '2026-09' },
    { label: 'Aug 2026', value: '2026-08' },
    { label: 'Jul 2026', value: '2026-07' },
    { label: 'Jun 2026', value: '2026-06' },
    { label: 'May 2026', value: '2026-05' },
    { label: 'Apr 2026', value: '2026-04' },
  ];

  const loadDashboardData = async (monthStr: string = selectedMonth) => {
    setIsLoading(true);
    try {
      const [reportRes, receiptsRes] = await Promise.all([
        reportApi.getMonthlyReport(monthStr),
        receiptApi.getReceipts({ page: 0, size: 6 })
      ]);

      if (reportRes.data.success) setReport(reportRes.data.data);
      if (receiptsRes.data.success) setRecentReceipts(receiptsRes.data.data.content);
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboardData(selectedMonth);
  }, [selectedMonth]);

  const handleSeedPastData = async () => {
    setIsSeeding(true);
    try {
      await authApi.seedPastData();
      await loadDashboardData(selectedMonth);
    } catch (ignored) {}
    setIsSeeding(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header & Quick Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                Expense Overview
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {selectedMonth}
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Track, categorize and inspect past 6-month expenses</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Month Selector Dropdown / Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-2 py-1"
                >
                  {monthsList.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seed Demo Past Data Button */}
              <button
                onClick={handleSeedPastData}
                disabled={isSeeding}
                title="Populate past 5 months sample receipts"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSeeding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>Seed Past Data</span>
              </button>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Upload Receipt
              </button>
            </div>
          </div>

          {/* Past Months Navigation Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">Quick Select:</span>
            {monthsList.map((m) => {
              const isSelected = selectedMonth === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setSelectedMonth(m.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs ring-2 ring-brand-300'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Expenses */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                ₹{report?.totalExpenses?.toLocaleString('en-IN') || '0.00'}
              </p>
              <span className="text-[11px] text-slate-500">Spending in {selectedMonth}</span>
            </div>

            {/* Business Expenses */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Business</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                ₹{report?.businessExpenses?.toLocaleString('en-IN') || '0.00'}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">Tax-deductible expenses</span>
            </div>

            {/* Personal Expenses */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Personal</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                ₹{report?.personalExpenses?.toLocaleString('en-IN') || '0.00'}
              </p>
              <span className="text-[11px] text-slate-500">Non-business spending</span>
            </div>

            {/* Top Category */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Top Category</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <PieIcon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-900 truncate">
                {report?.topCategoryName || 'None'}
              </p>
              <span className="text-[11px] text-slate-500">Highest spending area</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-brand-600" />
                  Spending by Category ({selectedMonth})
                </h3>
              </div>
              {report?.categoryBreakdown && report.categoryBreakdown.length > 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report.categoryBreakdown}
                        dataKey="amount"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ categoryName, percentage }) => `${categoryName} (${percentage}%)`}
                      >
                        {report.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                  <p>No category data available for {selectedMonth}.</p>
                  <button
                    onClick={handleSeedPastData}
                    className="text-brand-600 font-semibold hover:underline text-xs"
                  >
                    Click here to seed past sample expenses
                  </button>
                </div>
              )}
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  6-Month Spending Trend (Apr - Sep 2026)
                </h3>
              </div>
              {report?.monthlyTrend && report.monthlyTrend.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.monthlyTrend}>
                      <XAxis dataKey="dateOrMonth" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: any) => [`₹${value}`, 'Amount']} />
                      <Bar dataKey="businessAmount" name="Business" fill="#2563eb" stackId="a" />
                      <Bar dataKey="personalAmount" name="Personal" fill="#94a3b8" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <p>No monthly trend data available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Receipts List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Recent Receipts</h3>
              <Link to="/receipts" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View All Receipts <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentReceipts.length > 0 ? (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentReceipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <Link to={`/receipts/${r.id}`} className="hover:underline">
                            {r.vendorName || r.originalFilename}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{r.receiptDate || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                            {r.categoryName || 'Other'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">₹{r.totalAmount || 0}</td>
                        <td className="py-3 px-4">
                          <Badge status={r.ocrStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="py-12 px-4 text-center space-y-3">
                <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto text-slate-400">
                  <ReceiptIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">You haven't uploaded any receipts yet.</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload your first receipt image or digital PDF, or click "Seed Past Data" to populate historical months.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleSeedPastData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Seed Past 5 Months
                  </button>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Upload receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => loadDashboardData(selectedMonth)}
      />
    </div>
  );
};
