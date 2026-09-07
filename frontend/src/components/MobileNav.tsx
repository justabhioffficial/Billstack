import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Camera, Settings, Sparkles } from 'lucide-react';

interface MobileNavProps {
  onOpenUpload: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenUpload }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg select-none">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 touch-manipulation ${
            isActive ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        Home
      </NavLink>

      <NavLink
        to="/receipts"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 touch-manipulation ${
            isActive ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Receipt className="w-5 h-5 mb-0.5" />
        Bills
      </NavLink>

      {/* Floating Camera Scan / Upload Action Button */}
      <button
        onClick={onOpenUpload}
        className="-mt-6 bg-indigo-600 text-white p-3.5 rounded-full shadow-lg hover:bg-indigo-700 active:scale-90 transition-all border-4 border-white flex items-center justify-center cursor-pointer ring-4 ring-indigo-500/20"
        title="Scan & Upload Receipt"
      >
        <Camera className="w-6 h-6" />
      </button>

      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 touch-manipulation ${
            isActive ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        Reports
      </NavLink>

      <NavLink
        to="/ask"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 touch-manipulation ${
            isActive ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Sparkles className="w-5 h-5 mb-0.5" />
        Ask AI
      </NavLink>
    </div>
  );
};
