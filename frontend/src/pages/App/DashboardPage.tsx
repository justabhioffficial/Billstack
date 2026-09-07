import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { Badge } from '../../components/Badge';
import { reportApi, receiptApi, alertApi, gamificationApi, intelligenceApi } from '../../services/api';
import { MonthlyReport, Receipt, ExpenseAlert, Streak, ExpenseHealth } from '../../types';
import { IndianRupee, Briefcase, User as UserIcon, Receipt as ReceiptIcon, ArrowUpRight, Plus, PieChart as PieIcon, TrendingUp, Calendar, RefreshCw, Sparkles, AlertTriangle, ShieldCheck, Flame, X, Store, FileCheck, Calculator, ChevronDown, Zap } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import { WeeklySummaryCard } from '../../components/WeeklySummaryCard';

export const DashboardPage: React.FC = () => {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [alerts, setAlerts] = useState<ExpenseAlert[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [health, setHealth] = useState<ExpenseHealth | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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
      const [reportRes, receiptsRes, alertsRes, streakRes, healthRes] = await Promise.all([
        reportApi.getMonthlyReport(monthStr),
        receiptApi.getReceipts({ page: 0, size: 6 }),
        alertApi.getAlerts(),
        gamificationApi.getStreaks(),
        intelligenceApi.getExpenseHealth(),
      ]);

      if (reportRes.data.success) setReport(reportRes.data.data);
      if (receiptsRes.data.success) setRecentReceipts(receiptsRes.data.data.content);
      if (alertsRes.data.success) setAlerts(alertsRes.data.data);
      if (streakRes.data.success) setStreak(streakRes.data.data);
      if (healthRes.data.success) setHealth(healthRes.data.data);
    } catch (ignored) {}
    setIsLoading(false);
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      await alertApi.dismissAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (e) {
      console.error('Failed to dismiss alert:', e);
    }
  };

  useEffect(() => {
    loadDashboardData(selectedMonth);
  }, [selectedMonth]);

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

              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Upload Receipt
              </button>
            </div>
          </div>

          {/* Smart Weekly Digest Card */}
          <WeeklySummaryCard />

          {/* Smart Spending Alerts Banner */}
          {alerts && alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex items-center justify-between shadow-xs transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-5 h-5 shrink-0 ${
                      alert.severity === 'CRITICAL' ? 'text-red-600' : alert.severity === 'WARNING' ? 'text-amber-600' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h4 className="font-bold text-sm">{alert.title}</h4>
                      <p className="text-xs mt-0.5 opacity-90">{alert.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
                    title="Dismiss Alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Gamification Streak & Quick Intelligence Bar with Toggle Button */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden transition-all duration-300">
            {/* Toggle Header Button */}
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left focus:outline-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Quick Actions & Tracking Intelligence</h3>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold text-[10px] rounded-full border border-indigo-100">
                      3 Shortcuts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Streak score, MoM intelligence shift & natural language search
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  Health Score: {health?.score || 100}/100
                </span>
                <div className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-transform duration-300 ${isShortcutsOpen ? 'rotate-180 bg-slate-100' : ''}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </button>

            {/* Collapsible Content Grid with Smooth Transition */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isShortcutsOpen ? 'max-h-[500px] opacity-100 p-4 pt-0 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Card 1: Streak */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tracking Streak</div>
                      <div className="font-extrabold text-sm text-slate-900">{streak?.streakLabel || 'Active User'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">{streak?.totalOrganizedReceipts || 0}</span>
                    <div className="text-[11px] text-slate-500 font-medium">Organized</div>
                  </div>
                </div>

                {/* Card 2: Where Did My Money Go */}
                <Link
                  to="/intelligence"
                  className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <PieIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Where Did My Money Go?</div>
                      <div className="text-xs text-slate-500">MoM shifts & Health ({health?.score || 100}/100)</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </Link>

                {/* Card 3: Ask BillStack */}
                <Link
                  to="/ask"
                  className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Ask BillStack</div>
                      <div className="text-xs text-slate-500">Natural language expense search</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </Link>
              </div>
            </div>
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                  <div className="h-56 w-full sm:w-1/2 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={report.categoryBreakdown}
                          dataKey="amount"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                        >
                          {report.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Clean Legend List */}
                  <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
                    {report.categoryBreakdown.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || '#2563EB' }}></span>
                          <span className="font-semibold text-slate-800 truncate">{cat.categoryName}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="font-bold text-slate-900">₹{cat.amount.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] text-slate-500 ml-1 font-medium">({cat.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <p>No category data available for {selectedMonth}.</p>
                </div>
              )}
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  6-Month Spending Trend
                </h3>
              </div>
              {report?.monthlyTrend && report.monthlyTrend.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="dateOrMonth" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} width={50} tickFormatter={(val) => val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`} />
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="businessAmount" name="Business" fill="#2563eb" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="personalAmount" name="Personal" fill="#94a3b8" stackId="a" radius={[4, 4, 0, 0]} />
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
                  Upload your first receipt image or digital PDF to start organizing your monthly business expenses.
                </p>
                <div className="flex justify-center pt-2">
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
