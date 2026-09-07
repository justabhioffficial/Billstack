import React, { useState, useEffect } from 'react';
import { WeeklySummary } from '../types';
import { intelligenceApi } from '../services/api';
import { Calendar, TrendingUp, TrendingDown, Lightbulb, ChevronDown, Sparkles, Layers, QrCode, Download, X, Smartphone, Check } from 'lucide-react';
import { AppDownloadModal } from './AppDownloadModal';

export const WeeklySummaryCard: React.FC = () => {
  const [weekly, setWeekly] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await intelligenceApi.getWeeklySummary();
        if (res.data.success) {
          setWeekly(res.data.data);
        }
      } catch (ignored) {}
      setLoading(false);
    };
    fetchWeekly();
  }, []);

  if (loading || !weekly) return null;

  const isUp = weekly.wowPercentageChange > 0;

  const handleDownloadWeeklyReport = () => {
    if (!weekly) return;
    const content = `================================================
BILLSTACK — WEEKLY EXPENSE INTELLIGENCE DIGEST
Week Period: ${weekly.weekStartDate} to ${weekly.weekEndDate}
================================================
Weekly Total Spent: ₹${weekly.totalWeeklySpent.toLocaleString('en-IN')}
Total Transactions: ${weekly.totalWeeklyTransactions}
Top Category: ${weekly.topCategoryName}
Top Vendor: ${weekly.largestExpenseVendor}
Week-over-Week Shift: ${weekly.wowPercentageChange}%

AI Financial Insight:
${weekly.weeklySummaryInsight}
================================================
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BillStack_Weekly_Digest_${weekly.weekStartDate}_to_${weekly.weekEndDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden transition-all duration-300 group">
        {/* BillStack Theme Watermark Background - Only inside this card */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-[0.05] text-indigo-900 flex items-center gap-1 font-black select-none">
          <Layers className="w-32 h-32 text-indigo-900" />
        </div>

        {/* Toggle Button Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors text-left relative z-10 cursor-pointer"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">Weekly Expense Digest & Intelligence</h3>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold text-[10px] rounded-full border border-indigo-100 shrink-0">
                  {weekly.totalWeeklyTransactions} Bills
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                {weekly.weekStartDate} to {weekly.weekEndDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
            {/* Quick Summary Metrics */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                ₹{weekly.totalWeeklySpent.toLocaleString('en-IN')}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                isUp ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {Math.abs(weekly.wowPercentageChange)}% WoW
              </span>
            </div>

            <div className={`p-1 sm:p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-slate-100' : ''}`}>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* Expandable Collapsible Body with Smooth Transition Effect */}
        <div
          className={`transition-all duration-300 ease-in-out relative z-10 ${
            isOpen ? 'max-h-[600px] opacity-100 p-5 pt-0 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Weekly Total</span>
                <p className="text-lg font-extrabold text-slate-900 mt-1">₹{weekly.totalWeeklySpent.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3.5 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Transactions</span>
                <p className="text-lg font-extrabold text-slate-900 mt-1">{weekly.totalWeeklyTransactions}</p>
              </div>

              <div className="p-3.5 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Top Category</span>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate">{weekly.topCategoryName}</p>
              </div>

              <div className="p-3.5 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Top Vendor</span>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate">{weekly.largestExpenseVendor}</p>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-lg text-xs text-indigo-950 font-medium flex items-start gap-2.5 shadow-2xs">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold text-slate-800">{weekly.weeklySummaryInsight}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Scan Mobile QR Code</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="w-44 h-44 bg-white p-2.5 border-2 border-indigo-200 rounded-2xl shadow-inner flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')}`}
                  alt="BillStack Mobile App QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-900">Scan with Phone Camera</p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Instantly open BillStack on mobile, scan receipt photos, and sync weekly expense digests.
                </p>
                <p className="text-[10px] text-slate-400 font-mono pt-1">
                  Target: {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setShowQrModal(false);
                  setShowAppModal(true);
                }}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Download App Options</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Download Modal */}
      <AppDownloadModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
      />
    </>
  );
};
