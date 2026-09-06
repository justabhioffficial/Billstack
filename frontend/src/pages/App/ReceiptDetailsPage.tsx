import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { Badge } from '../../components/Badge';
import { receiptApi, categoryApi } from '../../services/api';
import { Receipt, Category } from '../../types';
import {
  ArrowLeft, Save, Trash2, ExternalLink, AlertCircle, CheckCircle2,
  Download, Eye, ZoomIn, ZoomOut, RotateCw, RefreshCw, Maximize2
} from 'lucide-react';

export const ReceiptDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [vendorName, setVendorName] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [taxAmount, setTaxAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState('INR');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [categoryId, setCategoryId] = useState('');
  const [isBusiness, setIsBusiness] = useState(true);

  // Interactive Document Viewer State (Zoom / Rotate / Pan)
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setIsLoading(true);
      setImageError(false);
      try {
        const [res, catRes] = await Promise.all([
          receiptApi.getReceiptById(id),
          categoryApi.getCategories()
        ]);

        if (res.data.success) {
          const r = res.data.data;
          setReceipt(r);
          setVendorName(r.vendorName || '');
          setReceiptDate(r.receiptDate || '');
          setTotalAmount(r.totalAmount != null ? r.totalAmount : '');
          setTaxAmount(r.taxAmount != null ? r.taxAmount : '');
          setCurrency(r.currency || 'INR');
          setReceiptNumber(r.receiptNumber || '');
          setPaymentMode(r.paymentMode || 'UPI');
          setCategoryId(r.categoryId || '');
          setIsBusiness(r.isBusiness);
        }

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      } catch (e) {
        navigate('/receipts');
      }
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 4.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1.0);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1.0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await receiptApi.updateReceipt(id, {
        vendorName,
        receiptDate,
        totalAmount: totalAmount === '' ? null : totalAmount,
        taxAmount: taxAmount === '' ? null : taxAmount,
        currency,
        receiptNumber,
        paymentMode,
        categoryId,
        isBusiness
      });

      if (res.data.success) {
        setReceipt(res.data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (ignored) {}
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this receipt?')) return;
    try {
      await receiptApi.deleteReceipt(id);
      navigate('/receipts');
    } catch (ignored) {}
  };

  if (isLoading || !receipt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Back & Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/receipts" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{receipt.vendorName || 'Receipt Review'}</h1>
                <span className="text-xs text-slate-500 font-mono">ID: {receipt.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge status={receipt.ocrStatus} />
              <button
                onClick={handleDelete}
                className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Low Confidence Review Warning */}
          {receipt.ocrStatus === 'NEEDS_REVIEW' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Please review extracted details</h4>
                <p className="mt-0.5 text-amber-800">
                  Some extracted fields have lower confidence or missing values. Please verify the amount, date, and vendor details against the receipt preview before saving.
                </p>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Receipt details updated successfully!</span>
            </div>
          )}

          {/* Side-by-Side Review Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Interactive Receipt Viewport */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col">
              <div className="flex flex-wrap justify-between items-center pb-3 border-b border-slate-100 gap-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-600" />
                  Original Receipt Document
                </h3>

                {/* Zoom & Rotate Controls */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In (+)"
                    className="p-1.5 hover:bg-white text-slate-700 rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out (-)"
                    className="p-1.5 hover:bg-white text-slate-700 rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRotate}
                    title="Rotate 90°"
                    className="p-1.5 hover:bg-white text-slate-700 rounded transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset Zoom"
                    className="px-2 py-0.5 text-[11px] font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                </div>
              </div>

              {/* Viewport Box */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className={`relative bg-slate-950 rounded-xl p-3 min-h-[460px] max-h-[560px] flex items-center justify-center overflow-hidden border border-slate-800 select-none ${
                  zoomLevel > 1.0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                }`}
              >
                {receipt.mimeType.includes('pdf') ? (
                  <iframe
                    src={receipt.fileUrl}
                    className="w-full h-[480px] rounded bg-white"
                    title="Receipt PDF"
                  />
                ) : imageError ? (
                  <div className="flex flex-col items-center gap-3 p-6 text-center text-slate-400">
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Unable to load image directly</p>
                      <p className="text-xs text-slate-400 mt-1">Click below to open the original stored file</p>
                    </div>
                    <a
                      href={receipt.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Document
                    </a>
                  </div>
                ) : (
                  <div
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                      transformOrigin: 'center center'
                    }}
                    className="max-h-full flex items-center justify-center"
                  >
                    <img
                      src={receipt.fileUrl}
                      alt={receipt.vendorName || 'Receipt'}
                      onError={() => setImageError(true)}
                      className="max-h-[480px] object-contain rounded shadow-2xl pointer-events-none"
                    />
                  </div>
                )}
              </div>

              {/* Viewport Footer Info */}
              <div className="text-[11px] text-slate-500 flex justify-between items-center pt-1 border-t border-slate-100">
                <span>Filename: <strong className="text-slate-700">{receipt.originalFilename}</strong></span>
                <div className="flex items-center gap-3">
                  <span>Size: <strong>{(receipt.fileSize / 1024).toFixed(1)} KB</strong></span>
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3 h-3" />
                    Full File
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: Editable Extraction Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <form onSubmit={handleSave} className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
                  Extracted Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Receipt Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Total Amount (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Tax / GST Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Expense Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash</option>
                      <option value="NET_BANKING">Net Banking / NEFT</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Invoice / Receipt Number
                  </label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="e.g. RD-2026-0491"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Business vs Personal Toggle */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Expense Classification
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBusiness(true)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        isBusiness ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Business Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBusiness(false)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        !isBusiness ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Personal Expense
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Receipt Changes'}
                  </button>
                </div>
              </form>
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
