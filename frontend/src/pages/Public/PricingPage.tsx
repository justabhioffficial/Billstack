import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, HelpCircle } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Flexible Pricing for Every Solo Business</h1>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Start with our 100% Free plan. Upgrade whenever you need unlimited uploads and custom tax export rules.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex justify-center">
            <div className="bg-slate-200 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('YEARLY')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${
                  billingCycle === 'YEARLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly Billing <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Save 16%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="border border-slate-200 rounded-2xl p-8 bg-white space-y-6 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-xl">Free Plan</h3>
              <p className="text-xs text-slate-500 mt-1">20 receipts every month</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> 20 Receipts per month</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Automated OCR Field Extraction</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Standard Categories</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> CSV Export</li>
            </ul>

            <Link
              to="/register"
              className="block text-center w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-brand-600 rounded-2xl p-8 bg-white space-y-6 shadow-md relative">
            <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Popular
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-xl">Pro Plan</h3>
              <p className="text-xs text-slate-500 mt-1">For active solo professionals</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {billingCycle === 'MONTHLY' ? '₹99' : '₹999'}
                </span>
                <span className="text-xs text-slate-500">
                  {billingCycle === 'MONTHLY' ? '/ month' : '/ year'}
                </span>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2 font-semibold text-slate-900"><CheckCircle className="w-4 h-4 text-brand-600" /> Unlimited Receipts</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> High-Confidence OCR Engine</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Category Breakdown & Monthly Trends</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Custom Categorization Rules</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Excel (.xlsx) & CSV Exports</li>
            </ul>

            <Link
              to="/register"
              className="block text-center w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
            >
              Get Pro Plan
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
