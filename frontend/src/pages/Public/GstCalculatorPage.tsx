import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SeoHead } from '../../components/SeoHead';
import { Calculator, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GstCalculatorPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [calculationType, setCalculationType] = useState<'EXCLUSIVE' | 'INCLUSIVE'>('EXCLUSIVE');
  const [copied, setCopied] = useState<boolean>(false);

  let baseAmount = amount;
  let gstAmount = 0;
  let totalAmount = amount;
  let cgst = 0;
  let sgst = 0;

  if (calculationType === 'EXCLUSIVE') {
    gstAmount = (amount * gstRate) / 100;
    totalAmount = amount + gstAmount;
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  } else {
    baseAmount = (amount * 100) / (100 + gstRate);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  }

  const handleCopySummary = () => {
    const text = `GST Breakdown:\nNet Amount: ₹${baseAmount.toFixed(2)}\nGST (${gstRate}%): ₹${gstAmount.toFixed(2)}\nCGST (50%): ₹${cgst.toFixed(2)}\nSGST (50%): ₹${sgst.toFixed(2)}\nTotal Amount: ₹${totalAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <SeoHead
        title="Free Online GST Calculator (India) — Calculate CGST, SGST & IGST | BillStack"
        description="Free GST Calculator for freelancers and small businesses in India. Calculate exclusive and inclusive GST amounts with CGST & SGST breakdown instantly."
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" /> Free Financial Acquisition Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            India GST Calculator (Exclusive & Inclusive)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Quickly calculate net amount, CGST, SGST, IGST, and total invoice value for 5%, 12%, 18%, and 28% GST slabs.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Calculation Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalculationType('EXCLUSIVE')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    calculationType === 'EXCLUSIVE'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Add GST (Exclusive)
                </button>
                <button
                  type="button"
                  onClick={() => setCalculationType('INCLUSIVE')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    calculationType === 'INCLUSIVE'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Remove GST (Inclusive)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                GST Rate Slab (%)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      gstRate === rate
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-semibold text-slate-500">Net Base Amount</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">₹{baseAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-500">CGST ({gstRate / 2}%)</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">₹{cgst.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-500">SGST ({gstRate / 2}%)</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">₹{sgst.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total Gross Value</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCopySummary}
              className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy GST Breakdown'}
            </button>
          </div>
        </div>

        {/* Product Conversion CTA */}
        <div className="bg-indigo-600 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-lg">Automate Your GST Expense Tracking</h3>
            <p className="text-xs text-indigo-100">Upload your bills and let BillStack automatically extract GST rates and amounts in seconds.</p>
          </div>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
