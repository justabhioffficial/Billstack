import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: "Is BillStack an accounting software?",
      a: "No. BillStack is a receipt tracking and expense organization tool. It simplifies digitizing bills, extracting text via OCR, tagging expenses, and exporting spreadsheets for personal tracking or sharing with your Chartered Accountant (CA)."
    },
    {
      q: "How accurate is the OCR data extraction?",
      a: "Our OCR engine achieves high accuracy on clear digital receipts and printed tax invoices (such as Swiggy, Uber, AWS, Airtel, Reliance Digital). However, because thermal prints can fade or be noisy, we always prompt you to review low-confidence extracted data."
    },
    {
      q: "Can I use BillStack on my mobile phone?",
      a: "Yes! BillStack is fully mobile responsive. You can open BillStack in your mobile web browser and snap photos of physical bills directly using your phone camera."
    },
    {
      q: "What formats can I export my expenses into?",
      a: "You can export your expense logs into standard CSV files and Microsoft Excel (.xlsx) spreadsheets containing clean date, vendor, category, total amount, tax, and receipt ID columns."
    },
    {
      q: "How does the Free plan work?",
      a: "The Free plan lets you upload and process up to 20 receipts every month with zero cost forever. If you need to process more receipts, you can upgrade to the Pro plan for ₹199/month."
    },
    {
      q: "Are my uploaded receipts safe and private?",
      a: "Yes. Uploaded receipts are stored in private object storage accessible only to your authenticated account. We do not sell user data or share receipt details with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-base">Everything you need to know about BillStack.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <h3 className="font-bold text-slate-900 text-lg">{faq.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
