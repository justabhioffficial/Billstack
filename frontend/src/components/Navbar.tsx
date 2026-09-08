import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, LogOut, LayoutDashboard, User as UserIcon, Download, Smartphone, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AppDownloadModal } from './AppDownloadModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const publicRoutes = ['/', '/pricing', '/about', '/faq', '/terms', '/privacy', '/login', '/register', '/forgot-password'];
  const isAppRoute = !publicRoutes.includes(location.pathname);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & 3-Bars Menu Toggle (Web & Mobile) */}
            <div className="flex items-center gap-2">
              {isAppRoute && (
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
                  className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Toggle Side Menu"
                  aria-label="Toggle Side Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
                <img src="/logo.png" alt="BillStack Logo" className="h-10 sm:h-12 max-h-12 w-auto object-contain" />
              </Link>
            </div>

            {/* Navigation Links */}
            {!isAppRoute ? (
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
                <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
                <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</Link>
                <Link to="/faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">FAQ</Link>
              </nav>
            ) : null}

            {/* Actions & Top Right Download Button */}
            <div className="flex items-center gap-3">
              {/* App Download Button in Right Corner */}
              <button
                type="button"
                onClick={() => setIsDownloadOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-all shadow-2xs"
                title="Download BillStack App for Mobile & Desktop"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden xs:inline">Download App</span>
                <span className="xs:hidden">App</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {!isAppRoute && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.name}</span>
                    <button
                      onClick={logout}
                      title="Logout"
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Start Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* App Download / PWA Installation Modal */}
      <AppDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </>
  );
};
