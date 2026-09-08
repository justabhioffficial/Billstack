import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Tags, CreditCard, Settings, ShieldAlert, PlusCircle, PieChart, Store, FileCheck, Calculator, Sparkles, Gift, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUpload }) => {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopVisible, setIsDesktopVisible] = useState(true);

  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth >= 768) {
        setIsDesktopVisible((prev) => !prev);
      } else {
        setIsMobileOpen((prev) => !prev);
      }
    };
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/receipts', label: 'Receipts & Expenses', icon: Receipt },
    { to: '/intelligence', label: 'Expense Intelligence', icon: PieChart },
    { to: '/vendors', label: 'Vendor Intelligence', icon: Store },
    { to: '/monthly-review', label: 'Executive Review', icon: FileCheck },
    { to: '/ca-review', label: 'CA Checklist', icon: Calculator },
    { to: '/ask', label: 'Ask BillStack', icon: Sparkles },
    { to: '/referrals', label: 'Refer & Earn', icon: Gift },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/categories', label: 'Categories & Rules', icon: Tags },
    { to: '/billing', label: 'Billing & Plan', icon: CreditCard },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ to: '/admin/founder-dashboard', label: 'Founder Dashboard', icon: TrendingUp });
    navItems.push({ to: '/admin', label: 'Admin Health', icon: ShieldAlert });
  }

  const renderNavList = (onItemClick?: () => void) => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar (Web View Toggleable) */}
      {isDesktopVisible && (
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 justify-between shrink-0 transition-all duration-300">
          <div className="space-y-6">
            <button
              onClick={onOpenUpload}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Upload Receipt
            </button>

            {renderNavList()}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Free Plan</span>
                <span className="text-slate-500 font-medium">20 / mo</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Need unlimited receipt uploads & tax exports?</p>
              <NavLink
                to="/billing"
                className="block text-center text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-brand-200 py-1.5 rounded-md hover:bg-brand-50 transition-colors"
              >
                Upgrade for ₹99/mo
              </NavLink>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 max-w-xs w-full bg-white flex flex-col justify-between p-4 z-10 shadow-2xl h-full overflow-y-auto">
            <div className="space-y-4">
              {/* Header with Title & Hide 3-bars / Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="BillStack Logo" className="h-10 sm:h-12 w-auto object-contain" />
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Hide Menu"
                  aria-label="Hide Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Receipt Button */}
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  onOpenUpload();
                }}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Upload Receipt
              </button>

              {/* Navigation Items List */}
              {renderNavList(() => setIsMobileOpen(false))}
            </div>

            {/* Upgrade Banner Footer */}
            <div className="pt-4 mt-6 border-t border-slate-200 space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Free Plan</span>
                  <span className="text-slate-500 font-medium">20 / mo</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Need unlimited receipt uploads & tax exports?</p>
                <NavLink
                  to="/billing"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-center text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-brand-200 py-1.5 rounded-md hover:bg-brand-50 transition-colors"
                >
                  Upgrade for ₹99/mo
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
