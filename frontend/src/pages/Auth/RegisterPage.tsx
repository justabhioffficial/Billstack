import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, AlertCircle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, referralApi } from '../../services/api';
import { analytics } from '../../services/analytics';
import { PROFESSIONS_LIST } from '../../utils/professionCategories';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('Software Developer');
  const [customProfession, setCustomProfession] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any = null;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const professions = PROFESSIONS_LIST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const finalBusinessType = businessType === 'Other / Custom Profession' ? (customProfession.trim() || 'Other Small Business') : businessType;
      await register({
        name,
        email,
        password,
        businessType: finalBusinessType,
        country: 'India',
        currency: 'INR'
      });

      analytics.trackSignup('email');

      const searchParams = new URLSearchParams(window.location.search);
      const refCode = searchParams.get('ref');
      if (refCode) {
        try { await referralApi.trackReferral(refCode); } catch (ignored) {}
      }

      setStep('verify');
      setSuccessMsg('Registration successful! Please check your email for the 6-digit OTP code.');
    } catch (err: any) {
      const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Unable to connect to server.' : err.message) || 'Registration failed.';
      setError(msg);
    }
    setIsSubmitting(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await authApi.verifyRegistrationOtp({ email, otp });
      if (res.data.success) {
        localStorage.setItem('billstack_token', res.data.data.accessToken);
        localStorage.setItem('billstack_refresh_token', res.data.data.refreshToken);
        navigate('/onboarding');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setError(msg);
    }
    setIsSubmitting(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await authApi.resendOtp({ email, purpose: 'REGISTRATION_VERIFICATION' });
      setSuccessMsg('A new OTP has been dispatched to your email.');
      setResendTimer(30);
      setCanResend(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
          <img src="/logo.png" alt="BillStack Logo" className="h-16 sm:h-20 w-auto object-contain" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">
          {step === 'form' ? 'Create your free BillStack account' : 'Verify Email Address'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 'form' ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abhishek Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profession / Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {professions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="Other / Custom Profession">+ Other / Write Custom Profession</option>
                </select>
                {businessType === 'Other / Custom Profession' && (
                  <input
                    type="text"
                    required
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                    placeholder="e.g. Architect, Event Planner, Fitness Coach..."
                    className="mt-2 w-full px-3.5 py-2 bg-white border border-brand-400 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account & Send Verification OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification View */
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="text-center mb-4">
                <p className="text-xs text-slate-600">
                  We have dispatched a 6-digit EmailJS OTP to <span className="font-bold text-slate-900">{email}</span>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  placeholder="123456"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-lg text-center font-mono text-lg font-bold tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length < 6}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify & Activate Account
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:text-slate-400"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {canResend ? 'Resend OTP Code' : `Resend available in ${resendTimer}s`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
