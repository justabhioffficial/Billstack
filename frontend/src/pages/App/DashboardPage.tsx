import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { Badge } from '../../components/Badge';
import { reportApi, receiptApi } from '../../services/api';
import { MonthlyReport, Receipt } from '../../types';
import { IndianRupee, Briefcase, User as UserIcon, Receipt as ReceiptIcon, ArrowUpRight, Plus, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [reportRes, receiptsRes] = await Promise.all([
        reportApi.getMonthlyReport(),
        receiptApi.getReceipts({ page: 0, size: 5 })
      ]);

      if (reportRes.data.success) setReport(reportRes.data.data);
      if (receiptsRes.data.success) setRecentReceipts(receiptsRes.data.data.content);
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Expense Overview</h1>
              <p className="text-xs text-slate-500">Summary for {report?.yearMonth || 'Current Month'}</p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload Receipt
            </button>
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
              <span className="text-[11px] text-slate-500">Total spending this month</span>
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
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-brand-600" />
                Spending by Category
              </h3>
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
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <p>No category data available yet.</p>
                </div>
              )}
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                6-Month Spending Trend
              </h3>
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
              <h3 className="font-bold text-slate-900 text-sm">Recent Uploaded Receipts</h3>
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
                  Upload your first receipt image or digital PDF to start organizing your monthly business expenses.
                </p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Upload your first receipt
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};
