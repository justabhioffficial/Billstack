import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ShieldCheck, Target, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">About BillStack</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We are building simple financial clarity for Indian freelancers, creators, and solo business owners.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-slate-700 leading-relaxed">
            BillStack was born out of a simple frustration: independent workers lose thousands of rupees every year in eligible tax deductions simply because bills stay buried in WhatsApp chats, email attachments, and phone photo galleries.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Traditional accounting software is bloated, complicated, and requires formal bookkeeping knowledge. BillStack is deliberately NOT an ERP or accounting system. It is a streamlined expense vault and report generator built around one core action: <span className="font-semibold">Photo &rarr; OCR &rarr; Clean Expense Report</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
            <Target className="w-8 h-8 text-brand-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-base">Focused Simplicity</h3>
            <p className="text-xs text-slate-600">No complex double-entry ledger setups. Just quick receipt ingestion and clear expense metrics.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-base">Financial Privacy</h3>
            <p className="text-xs text-slate-600">Your documents are isolated and securely stored in encrypted cloud storage with private access keys.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
            <HeartHandshake className="w-8 h-8 text-indigo-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-base">Built for Solopreneurs</h3>
            <p className="text-xs text-slate-600">Optimized specifically for Indian tax contexts, GST invoice details, and local payment modes.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
