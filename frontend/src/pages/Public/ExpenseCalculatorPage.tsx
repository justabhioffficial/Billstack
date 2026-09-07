import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SeoHead } from '../../components/SeoHead';
import { Calculator, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExpenseCalculatorPage: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(35000);
  const [taxBracket, setTaxBracket] = useState<number>(30);

  const annualExpenses = monthlyExpenses * 12;
  const estimatedTaxSavings = (annualExpenses * taxBracket) / 100;
  const timeSavedHours = Math.round((monthlyExpenses / 500) * 2.67 / 60);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <SeoHead
        title="Business Expense & Tax Savings Estimator — BillStack"
        description="Estimate how much tax you can save by properly tracking business expenses as an Indian freelancer or small business."
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
            <DollarSign className="w-3.5 h-3.5" /> Tax Savings & Efficiency Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Business Tax Savings & Time Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Discover potential tax deductions and administrative hours saved by digitizing every business receipt.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Estimated Monthly Business Expenses (₹)
              </label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Income Tax Bracket (%)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 30].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setTaxBracket(rate)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      taxBracket === rate
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500">Estimated Annual Tax Deduction Savings</span>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{estimatedTaxSavings.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Estimated Hours Saved per Year</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  ~{timeSavedHours} Hours
                </p>
              </div>
            </div>

            <Link
              to="/register"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              Capture All Deductions with BillStack <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
