import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { askApi } from '../../services/api';
import { AskQueryResponse } from '../../types';
import { Search, Sparkles, Send, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AskBillStackPage: React.FC = () => {
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [response, setResponse] = useState<AskQueryResponse | null>(null);

  const sampleQueries = [
    'How much did I spend on AWS in the last 6 months?',
    'Show travel expenses above ₹5,000',
    'Total spent in current month',
    'Show pending receipts needing review',
  ];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || queryText;
    if (!q.trim()) return;

    setLoading(true);
    setQueryText(q);

    try {
      const res = await askApi.query({ query: q });
      if (res.data.success) {
        setResponse(res.data.data);
      }
    } catch (err) {
      console.error('Ask BillStack query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Search Header */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl shadow-xs space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ask BillStack</h1>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">Natural language financial search across all your expense records.</p>
                </div>
              </div>

              <form onSubmit={(e) => handleSearch(e)} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Ask anything (e.g., 'How much did I spend on AWS in the last 6 months?')..."
                    className="w-full pl-12 pr-28 py-3.5 bg-slate-50 text-slate-900 rounded-xl font-medium border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !queryText.trim()}
                    className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Ask</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sample Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Suggestions:</span>
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(undefined, sample)}
                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Output Card */}
            {response && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Query Interpreted</div>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">"{response.originalQuery}"</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Matching Receipts</span>
                    <div className="text-xl font-bold text-indigo-600">{response.receiptCount}</div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950 font-semibold text-base leading-relaxed">
                  {response.answerText}
                </div>

                {/* Matching Receipts Table */}
                {response.relevantReceipts && response.relevantReceipts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Matching Receipts ({response.relevantReceipts.length})</h3>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {response.relevantReceipts.map((r) => (
                        <div key={r.id} className="p-4 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{r.vendorName || 'Unknown Vendor'}</div>
                              <div className="text-xs text-slate-500">{r.receiptDate || r.createdAt} • {r.categoryName || 'Uncategorized'}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold text-slate-900">₹{(r.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <Link
                              to={`/receipts/${r.id}`}
                              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={() => {}} />
    </div>
  );
};
