import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { Badge } from '../../components/Badge';
import { receiptApi, categoryApi, exportApi } from '../../services/api';
import { Receipt, Category } from '../../types';
import { Search, Filter, Download, Plus, ChevronLeft, ChevronRight, FileSpreadsheet, Trash2 } from 'lucide-react';

export const ReceiptsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isBusinessFilter, setIsBusinessFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchReceipts = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = { page, size: 10 };
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (isBusinessFilter !== 'all') params.isBusiness = isBusinessFilter === 'business';

      const [res, catRes] = await Promise.all([
        receiptApi.getReceipts(params),
        categoryApi.getCategories()
      ]);

      if (res.data.success) {
        setReceipts(res.data.data.content);
        setTotalElements(res.data.data.totalElements);
        setTotalPages(res.data.data.totalPages);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
  }, [page, selectedCategory, selectedStatus, isBusinessFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchReceipts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;
    try {
      await receiptApi.deleteReceipt(id);
      fetchReceipts();
    } catch (ignored) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Receipts & Expenses</h1>
              <p className="text-xs text-slate-500">Manage, review, and filter your uploaded receipts ({totalElements} total)</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={exportApi.getExportCsvUrl()}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </a>
              <a
                href={exportApi.getExportExcelUrl()}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors"
                title="Export Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Excel (.xlsx)
              </a>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Upload Receipt
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search vendor name, amount, or receipt number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </form>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Business / Personal */}
            <select
              value={isBusinessFilter}
              onChange={(e) => { setIsBusinessFilter(e.target.value); setPage(0); }}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Expenses</option>
              <option value="business">Business Only</option>
              <option value="personal">Personal Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Receipts Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {receipts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Vendor & Details</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">OCR Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <Link to={`/receipts/${r.id}`} className="font-bold text-slate-900 hover:text-brand-600 block">
                            {r.vendorName || r.originalFilename}
                          </Link>
                          {r.receiptNumber && <span className="text-[11px] text-slate-400 font-mono">#{r.receiptNumber}</span>}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{r.receiptDate || 'N/A'}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                            {r.categoryName || 'Other'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          ₹{r.totalAmount || 0}
                          {r.taxAmount ? <span className="block text-[10px] text-slate-400 font-normal">(Tax: ₹{r.taxAmount})</span> : null}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.isBusiness ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {r.isBusiness ? 'Business' : 'Personal'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={r.ocrStatus} />
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link
                            to={`/receipts/${r.id}`}
                            className="text-xs font-semibold text-brand-600 hover:underline"
                          >
                            Review / Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Delete receipt"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                No receipts found matching your criteria.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 text-xs text-slate-600">
                <span>Page {page + 1} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
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
        onSuccess={fetchReceipts}
      />
    </div>
  );
};
