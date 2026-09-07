import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SeoHead } from '../../components/SeoHead';
import { CheckSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChecklistPage: React.FC = () => {
  const checklistItems = [
    { title: 'Vendor Name & GSTIN Verified', desc: 'Ensure supplier name and 15-digit GSTIN are clearly visible on every invoice.' },
    { title: 'Tax Invoice Date Within Tax Period', desc: 'Verify receipt date matches the target financial month or quarter.' },
    { title: 'Clear Total & Tax Amounts', desc: 'Confirm base amount and CGST/SGST/IGST breakdown match.' },
    { title: 'Business Expense Designation', desc: 'Separate personal transactions from tax-deductible business expenses.' },
    { title: 'Digital Backup Preserved', desc: 'Store digital copies safely for audit compliance.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <SeoHead
        title="Receipt Organization & CA Compliance Checklist — BillStack"
        description="A simple 5-step checklist for Indian freelancers and small businesses to organize receipts for CA tax audit readiness."
      />
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
            <CheckSquare className="w-3.5 h-3.5" /> Free Compliance Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Receipt Audit & CA Compliance Checklist
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            5 quick checks to ensure your business receipts are 100% compliant before sending to your Chartered Accountant.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center space-y-3 shadow-md">
          <h3 className="text-xl font-bold">Automate This Checklist with CA Review Mode</h3>
          <p className="text-xs text-indigo-100 max-w-md mx-auto">
            BillStack's built-in CA Review engine scans every uploaded receipt for missing GST, dates, or vendor names automatically.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow transition"
            >
              Get Started with BillStack <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
