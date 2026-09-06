import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, PlusCircle, CreditCard, Settings } from 'lucide-react';

interface MobileNavProps {
  onOpenUpload: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenUpload }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        Dashboard
      </NavLink>

      <NavLink
        to="/receipts"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Receipt className="w-5 h-5 mb-0.5" />
        Receipts
      </NavLink>

      {/* Floating Upload Button */}
      <button
        onClick={onOpenUpload}
        className="-mt-5 bg-brand-600 text-white p-3 rounded-full shadow-md hover:bg-brand-700 focus:outline-none transition-transform active:scale-95"
        title="Upload Receipt"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        Reports
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Settings className="w-5 h-5 mb-0.5" />
        Settings
      </NavLink>
    </div>
  );
};
