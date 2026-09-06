import React, { useState } from 'react';
import { X, Upload, Camera, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { receiptApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const res = await receiptApi.upload(file, 'WEB');
      if (res.data.success) {
        setFile(null);
        setIsUploading(false);
        onClose();
        if (onSuccess) onSuccess();
        navigate(`/receipts/${res.data.data.id}`);
      }
    } catch (err: any) {
      setIsUploading(false);
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Upload Receipt or Invoice</h3>
            <p className="text-xs text-slate-500">Supports JPG, PNG, and PDF up to 10MB</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              {error.includes('limit') && (
                <button
                  onClick={() => { onClose(); navigate('/billing'); }}
                  className="mt-1 font-bold underline hover:text-rose-900"
                >
                  Upgrade to Pro for unlimited receipt uploads →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Drag & Drop Box */}
        <div className="mt-5">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              file ? 'border-brand-500 bg-brand-50/50' : 'border-slate-300 hover:border-brand-400 bg-slate-50'
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 text-brand-600" />
                <span className="text-sm font-semibold text-slate-800">{file.name}</span>
                <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-rose-600 hover:underline mt-1 font-medium"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-white rounded-full border border-slate-200 shadow-xs">
                  <Upload className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Drag & drop your receipt image here</p>
                  <p className="text-xs text-slate-500 mt-0.5">or browse from your device</p>
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-xs">
                    Browse File
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <label className="sm:hidden cursor-pointer px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors shadow-xs flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    Camera
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-2 ${
              !file || isUploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-sm'
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Extracting Details...
              </>
            ) : (
              'Process & Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
