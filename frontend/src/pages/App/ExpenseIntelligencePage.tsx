import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { intelligenceApi } from '../../services/api';
import { MonthlyIntelligence, ExpenseHealth } from '../../types';
import { TrendingUp, TrendingDown, Clock, ShieldCheck, PieChart, Award } from 'lucide-react';

export const ExpenseIntelligencePage: React.FC = () => {
  const [intelligence, setIntelligence] = useState<MonthlyIntelligence | null>(null);
  const [health, setHealth] = useState<ExpenseHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const fetchIntelligence = async () => {
    setLoading(true);
    try {
      const [intelRes, healthRes] = await Promise.all([
        intelligenceApi.getMonthlyIntelligence(selectedYear, selectedMonth),
        intelligenceApi.getExpenseHealth(),
      ]);
      if (intelRes.data.success) setIntelligence(intelRes.data.data);
      if (healthRes.data.success) setHealth(healthRes.data.data);
    } catch (err) {
      console.error('Failed to load intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, [selectedYear, selectedMonth]);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const timeSavedMins = Math.round((intelligence?.totalReceipts || 0) * 2.67);
  const hoursSaved = Math.floor(timeSavedMins / 60);
  const minsSaved = timeSavedMins % 60;
  const formattedTimeSaved = hoursSaved > 0 ? `${hoursSaved}h ${minsSaved}m` : `${minsSaved}m`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header with Month Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Monthly Expense Intelligence</h1>
              <p className="text-slate-500 text-sm mt-1">Deep analysis of where your money went, MoM shifts, and organization health score.</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && !intelligence ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Top Metrics Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Expenses ({intelligence?.monthName})</div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">
                    ₹{(intelligence?.totalExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  {intelligence?.momChangePercentage !== undefined && (
                    <div className={`flex items-center text-xs font-semibold mt-2 ${intelligence.momChangePercentage >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {intelligence.momChangePercentage >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      <span>{Math.abs(intelligence.momChangePercentage)}% {intelligence.momChangePercentage >= 0 ? 'increase' : 'decrease'} vs last month</span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Receipts Processed</div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">{intelligence?.totalReceipts || 0}</div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center">
                    <span className="text-emerald-600 font-semibold mr-1">{intelligence?.categorizedReceipts || 0} categorized</span>
                    <span>({intelligence?.uncategorizedReceipts || 0} pending)</span>
                  </div>
                </div>

                {/* Expense Health Score */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span>Expense Health Score</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-extrabold text-indigo-600">{health?.score || 100}</span>
                    <span className="text-slate-400 text-sm font-medium">/ 100</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${
                      (health?.score || 100) >= 85 ? 'bg-emerald-100 text-emerald-800' : (health?.score || 100) >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {health?.statusLabel || 'Excellent'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        (health?.score || 100) >= 85 ? 'bg-emerald-500' : (health?.score || 100) >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${health?.score || 100}%` }}
                    />
                  </div>
                </div>

                {/* Time Saved Widget */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span>Time Saved</span>
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{formattedTimeSaved}</div>
                  <p className="text-slate-500 text-xs mt-1">Automated OCR saved ~2m 40s per entry baseline.</p>
                </div>
              </div>

              {/* Where Did My Money Go Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-bold text-slate-900">"Where Did My Money Go?" Breakdown</h2>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{intelligence?.categoryBreakdown.length || 0} active categories</span>
                  </div>

                  <div className="space-y-4">
                    {intelligence?.categoryBreakdown && intelligence.categoryBreakdown.length > 0 ? (
                      intelligence.categoryBreakdown.map((cat) => (
                        <div key={cat.categoryId} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color || '#64748B' }}></div>
                              <span className="font-semibold text-slate-900">{cat.categoryName}</span>
                              <span className="text-xs text-slate-500">({cat.receiptCount} receipts)</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-900">₹{cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              <span className="text-xs text-slate-500 ml-2 font-medium">({cat.percentageShare.toFixed(1)}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, cat.percentageShare)}%`, backgroundColor: cat.color || '#64748B' }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">No expenses recorded for {intelligence?.monthName}.</div>
                    )}
                  </div>
                </div>

                {/* Key Intelligence Insights & Health Audit */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>Smart Key Insights</span>
                    </h3>
                    <div className="space-y-3">
                      {intelligence?.keyInsights && intelligence.keyInsights.length > 0 ? (
                        intelligence.keyInsights.map((insight, idx) => (
                          <div key={idx} className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900 flex items-start space-x-2">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{insight}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">Upload more receipts to unlock automated AI insights.</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Health Audit Breakdown</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Categorization Completeness</span>
                        <span className="font-semibold text-slate-900">{health?.categorizationRate || 0}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Verified Amount Accuracy</span>
                        <span className="font-semibold text-slate-900">{health?.validAmountRate || 0}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">OCR Review Rate</span>
                        <span className="font-semibold text-slate-900">{health?.reviewedRate || 0}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Vendor Verification</span>
                        <span className="font-semibold text-slate-900">{health?.validVendorRate || 0}%</span>
                      </div>
                    </div>

                    {health?.warningFactors && health.warningFactors.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-bold text-amber-700 uppercase mb-2">Attention Required</div>
                        {health.warningFactors.map((warn, idx) => (
                          <div key={idx} className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mb-1">
                            {warn}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={fetchIntelligence} />
    </div>
  );
};
