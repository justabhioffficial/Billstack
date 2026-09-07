import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { monthlyReviewApi } from '../../services/api';
import { MonthlyReview } from '../../types';
import { FileCheck, AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MonthlyReviewPage: React.FC = () => {
  const [review, setReview] = useState<MonthlyReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    fetchMonthlyReview();
  }, [selectedYear, selectedMonth]);

  const fetchMonthlyReview = async () => {
    setLoading(true);
    try {
      const res = await monthlyReviewApi.getMonthlyReview(selectedYear, selectedMonth);
      if (res.data.success) {
        setReview(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load monthly review:', err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Monthly Expense Executive Review</h1>
              <p className="text-slate-500 text-sm mt-1">Month-end executive summary, tax audit readiness, and CA review package.</p>
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
              <Link
                to="/ca-review"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Calculator className="w-4 h-4 mr-2" /> CA-Ready Checklist
              </Link>
            </div>
          </div>

          {loading && !review ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Expenses</div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">₹{(review?.totalExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-slate-500 mt-1">{review?.totalReceiptsCount || 0} total receipts</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Claimable Tax (GST)</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">₹{(review?.totalTaxClaimable || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-emerald-700 font-medium mt-1">Ready for input credit deduction</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Largest Spending Category</div>
                  <div className="text-xl font-bold text-slate-900 mt-2 truncate">{review?.topCategoryName || 'N/A'}</div>
                  <div className="text-xs text-slate-500 mt-1">₹{(review?.topCategoryAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Review Backlog</div>
                  <div className="text-2xl font-bold text-amber-600 mt-2">{(review?.uncategorizedCount || 0) + (review?.needsReviewCount || 0)}</div>
                  <div className="text-xs text-amber-700 font-medium mt-1">{review?.uncategorizedCount || 0} uncategorized, {review?.needsReviewCount || 0} pending OCR review</div>
                </div>
              </div>

              {/* Executive Summary Points & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <span>Executive Monthly Briefing</span>
                  </h2>
                  <div className="space-y-3">
                    {review?.executiveSummary && review.executiveSummary.length > 0 ? (
                      review.executiveSummary.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 text-sm">No review details generated.</div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Recommended Month-End Actions</span>
                  </h2>
                  <div className="space-y-3">
                    {review?.recommendedActions && review.recommendedActions.length > 0 ? (
                      review.recommendedActions.map((action, idx) => (
                        <div key={idx} className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <span>{action}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 text-sm">All month-end tasks complete! Your books are 100% clean.</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={fetchMonthlyReview} />
    </div>
  );
};
