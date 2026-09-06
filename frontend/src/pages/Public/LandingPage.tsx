import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Receipt, CheckCircle, UploadCloud, Cpu, PieChart, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-600"></span>
            Built for Indian Freelancers & Solo Professionals
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Turn your bills into organized <br className="hidden sm:inline" />
            <span className="text-brand-600">business expenses.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload receipts, automatically extract expense details, organize spending, and export clean, tax-ready reports without learning accounting software.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Start Free (20 Receipts/mo)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base rounded-lg transition-colors flex items-center justify-center"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Instant OCR extraction</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Razorpay & UPI receipt support</span>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Stop keeping your business bills scattered across your phone, email and WhatsApp.
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Whether it's an Uber trip, Swiggy meal, Airtel bill, or AWS invoice — BillStack centralizes all your receipts in one secure place and prepares them for your CA.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How BillStack Works in 4 Simple Steps</h2>
            <p className="mt-3 text-slate-600 text-base">From receipt photo to tax report in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">1</div>
              <h3 className="font-bold text-slate-900 text-lg">Upload Receipt</h3>
              <p className="text-slate-600 text-sm">Snap a picture on mobile or drag and drop JPG, PNG, or PDF bills from desktop.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">2</div>
              <h3 className="font-bold text-slate-900 text-lg">OCR Extraction</h3>
              <p className="text-slate-600 text-sm">BillStack automatically detects vendor, date, total amount, GST, and payment mode.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">3</div>
              <h3 className="font-bold text-slate-900 text-lg">Auto Categorization</h3>
              <p className="text-slate-600 text-sm">Expenses are tagged as Software, Travel, Food, Utilities, or custom user rules.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">4</div>
              <h3 className="font-bold text-slate-900 text-lg">Export Clean Reports</h3>
              <p className="text-slate-600 text-sm">Download organized CSV or Excel spreadsheets ready for personal or CA review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Purpose-Built for Financial Clarity</h2>
            <p className="mt-3 text-slate-600 text-base">Simple tools to track spending without accounting bloat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Mobile Camera Upload</h3>
              <p className="text-slate-600 text-sm">Upload receipts directly from your phone camera or gallery while on the move.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Indian Receipt Parser</h3>
              <p className="text-slate-600 text-sm">Detects CGST, SGST, IGST, UPI payment modes, and INR currency fields automatically.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg w-fit">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Business vs Personal</h3>
              <p className="text-slate-600 text-sm">Separate your tax-deductible business expenses from personal spending instantly.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg w-fit">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">One-Click CSV & Excel Export</h3>
              <p className="text-slate-600 text-sm">Export clean, structured spreadsheets with receipt dates, vendors, amounts, and tax numbers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Secure Storage</h3>
              <p className="text-slate-600 text-sm">Receipt images are securely stored with private access control. User data is never shared.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Custom Vendor Rules</h3>
              <p className="text-slate-600 text-sm">Set custom categorization rules (e.g. "AWS" always tags as Software & Tools).</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-slate-600 text-base">No hidden charges. Upgrade only when you need more volume.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-xl">Free Plan</h3>
                <p className="text-xs text-slate-500 mt-1">Ideal for starting freelancers</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> 20 Receipts per month</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> OCR Data Extraction</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Standard Expense Dashboard</li>
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
            <div className="border-2 border-brand-600 rounded-2xl p-8 bg-white space-y-6 relative shadow-lg">
              <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xl">Pro Plan</h3>
                <p className="text-xs text-slate-500 mt-1">For active solo professionals & creators</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹199</span>
                  <span className="text-xs text-slate-500">/ month or ₹1,999/yr</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2 font-semibold text-slate-900"><CheckCircle className="w-4 h-4 text-brand-600" /> Unlimited Receipts</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Priority OCR Extraction</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Advanced Analytics & Reports</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Custom Categorization Rules</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" /> Excel (.xlsx) & CSV Exports</li>
              </ul>

              <Link
                to="/register"
                className="block text-center w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-600 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to clean up your business expenses?</h2>
          <p className="text-brand-100 text-base max-w-xl mx-auto">
            Join hundreds of freelancers in India organizing their receipts and getting tax-ready.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3.5 bg-white text-brand-700 hover:bg-brand-50 font-bold text-base rounded-lg transition-colors shadow-md"
          >
            Create Your Free Account Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
