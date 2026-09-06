import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Receipt, UploadCloud, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UploadModal } from '../../components/UploadModal';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [businessType, setBusinessType] = useState(user?.businessType || 'Software Developer');
  const [country, setCountry] = useState(user?.country || 'India');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [step, setStep] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ businessType, country, currency });
    } catch (ignored) {}
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        <div className="inline-flex p-3 bg-brand-50 text-brand-600 rounded-xl mb-2">
          <Receipt className="w-8 h-8" />
        </div>

        {step === 1 ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome to BillStack, {user?.name}!</h2>
              <p className="text-sm text-slate-600 mt-1">Let's set your default currency and business type.</p>
            </div>

            <form onSubmit={handleProfileSave} className="text-left space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profession / Business Type
                </label>
                <input
                  type="text"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Upload your first receipt</h2>
              <p className="text-sm text-slate-600 mt-1">
                Upload any digital invoice or snap a bill photo to test automatic OCR parsing.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-5 h-5" />
                Upload Receipt Now
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Skip for now & go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
};
