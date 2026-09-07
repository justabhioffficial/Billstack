import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { monthlyReviewApi, exportApi } from '../../services/api';
import { CaReview } from '../../types';
import { Download, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CAReviewPage: React.FC = () => {
  const [caReview, setCaReview] = useState<CaReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaReview();
  }, [selectedYear, selectedMonth]);

  const fetchCaReview = async () => {
    setLoading(true);
    try {
      const res = await monthlyReviewApi.getCaReview(selectedYear, selectedMonth);
      if (res.data.success) {
        setCaReview(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load CA review data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFixNextIssue = () => {
    if (caReview?.nextIssueReceiptId) {
      navigate(`/receipts/${caReview.nextIssueReceiptId}`);
    } else {
      navigate('/receipts');
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
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wide">CA & Tax Prep</span>
                <h1 className="text-2xl font-bold text-slate-900">1-Click CA Review & Cleanup Checklist</h1>
              </div>
              <p className="text-slate-500 text-sm mt-1">Audit-ready expense verification checklist for seamless GST & income tax filing.</p>
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
              <a
                href={exportApi.getExportExcelUrl()}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" /> Export Excel Package
              </a>
            </div>
          </div>

          {loading && !caReview ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Clean Status Banner */}
              <div className={`p-6 rounded-xl border ${caReview?.isCleanAndReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${caReview?.isCleanAndReady ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {caReview?.isCleanAndReady ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {caReview?.isCleanAndReady ? '✨ 100% Clean & CA-Ready' : `⚠ ${caReview?.flaggedCount || 0} Item${(caReview?.flaggedCount || 0) > 1 ? 's' : ''} Need Review Before CA Export`}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {caReview?.isCleanAndReady
                        ? 'All receipts for this period are verified, categorized, and have valid amount records.'
                        : `${(caReview?.cleanPercentage ?? 100).toFixed(0)}% of month expenses are clean. Fix remaining issues to achieve 100% tax compliance.`}
                    </p>
                  </div>
                </div>

                {caReview?.nextIssueReceiptId && (
                  <button
                    onClick={handleFixNextIssue}
                    className="px-5 py-2.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shrink-0 flex items-center shadow-md"
                  >
                    <span>Fix Next Issue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>

              {/* Audit Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Month Spend</div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">₹{(caReview?.totalMonthExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Claimable GST</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">₹{(caReview?.totalClaimableTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Verified Receipts</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">{caReview?.verifiedCount || 0}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Flagged / Pending</div>
                  <div className="text-2xl font-bold text-amber-600 mt-2">{caReview?.flaggedCount || 0}</div>
                </div>
              </div>

              {/* Compliance Checklist Notes */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>CA Audit & Compliance Notes</span>
                </h3>
                <div className="space-y-3">
                  {caReview?.complianceNotes && caReview.complianceNotes.length > 0 ? (
                    caReview.complianceNotes.map((note, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 flex items-start space-x-3">
                        <span className="font-bold text-indigo-600">{idx + 1}.</span>
                        <span>{note}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-sm">No compliance issues detected.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={fetchCaReview} />
    </div>
  );
};
