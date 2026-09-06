import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: September 6, 2026</p>

        <div className="bg-white p-8 rounded-xl border border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p>We collect your account information (name, email address, business type, country, currency) and financial receipt files uploaded by you. We do NOT store credit card numbers or UPI PINs; all payment processing is securely handled directly by Razorpay.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. How Uploaded Receipts Are Processed</h2>
            <p>When you upload a receipt, our server parses the image using automated OCR (Optical Character Recognition) to extract text such as vendor name, date, total amount, tax, and invoice numbers. Files are stored securely in isolated private storage buckets.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Data Sharing & Third Parties</h2>
            <p>We do NOT sell, rent, or trade your financial records or receipt data to advertisers or third parties. We share data only with infrastructure providers strictly necessary to operate the service (cloud storage, payment gateways, and email services).</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Account Deletion & Data Rights</h2>
            <p>You have the right to request deletion of your account and all associated receipt files at any time. When you initiate account deletion from Settings, your uploaded receipts and extracted data are permanently purged from active storage.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Security Standards</h2>
            <p>We use HTTPS encryption for all data in transit and industry-standard BCrypt password hashing for user authentication.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
