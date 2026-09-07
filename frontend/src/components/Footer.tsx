import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-brand-600 p-1.5 rounded text-white">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">BillStack</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn photos and digital bills into clean, organized, tax-ready expense reports. Designed specifically for Indian freelancers and solo professionals.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/tools/gst-calculator" className="hover:text-white transition-colors">Free India GST Calculator</Link></li>
              <li><Link to="/tools/expense-calculator" className="hover:text-white transition-colors">Tax Savings Estimator</Link></li>
              <li><Link to="/tools/checklist" className="hover:text-white transition-colors">CA Compliance Checklist</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Important Notice</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BillStack is an expense organization and receipt tracking application. BillStack is not an accounting firm or tax advisory service. Please review extracted records prior to submitting tax filings.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BillStack Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for Indian Freelancers & Independent Professionals</p>
        </div>
      </div>
    </footer>
  );
};
