import React from 'react';
import { OcrStatus } from '../types';
import { CheckCircle2, AlertCircle, Clock, FileWarning } from 'lucide-react';

interface BadgeProps {
  status: OcrStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Completed
        </span>
      );
    case 'NEEDS_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Needs Review
        </span>
      );
    case 'PROCESSING':
    case 'UPLOADED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Processing OCR
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <FileWarning className="w-3.5 h-3.5 text-rose-600" />
          OCR Failed
        </span>
      );
    default:
      return null;
  }
};
