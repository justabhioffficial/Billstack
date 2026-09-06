import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: September 6, 2026</p>

        <div className="bg-white p-8 rounded-xl border border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>By accessing or using BillStack ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Service Description & Disclaimer</h2>
            <p>BillStack provides digital receipt storage, optical character recognition (OCR), expense categorization, and report generation tools. BillStack is NOT an accounting firm, Chartered Accountant (CA), or tax advisory service. You are solely responsible for reviewing and verifying the accuracy of extracted receipts prior to filing official tax returns.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. User Responsibilities</h2>
            <p>You agree to provide accurate registration details and maintain the security of your account credentials. You must not upload unlawful, fraudulent, or malicious files to the platform.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Subscriptions & Billing</h2>
            <p>BillStack offers a Free plan (up to 20 receipts per month) and paid Pro plans processed via Razorpay. Subscriptions are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time from your account settings.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>BillStack shall not be liable for any indirect, incidental, or consequential damages resulting from OCR extraction discrepancies, lost receipts, or tax penalties resulting from user reliance on unverified records.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
