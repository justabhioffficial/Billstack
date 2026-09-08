import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { subscriptionApi } from '../../services/api';
import { Subscription } from '../../types';
import { CreditCard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchSubscription = async () => {
    setIsLoading(true);
    try {
      const res = await subscriptionApi.getSubscription();
      if (res.data.success) {
        setSub(res.data.data);
      }
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await subscriptionApi.createCheckout('PRO', billingCycle);
      if (res.data.success) {
        const checkoutData = res.data.data;

        // Check if Razorpay JS SDK is loaded and using a live key
        if ((window as any).Razorpay && checkoutData.razorpayKeyId && !checkoutData.razorpayKeyId.includes('mock')) {
          const options: any = {
            key: checkoutData.razorpayKeyId,
            amount: Math.round(Number(checkoutData.amount) * 100),
            currency: checkoutData.currency,
            name: 'BillStack Pro',
            description: `BillStack Pro Plan (${billingCycle})`,
            handler: async function (response: any) {
              try {
                const verifyRes = await subscriptionApi.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id || checkoutData.orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                if (verifyRes.data.success) {
                  setSub(verifyRes.data.data);
                  alert('🎉 Pro Plan upgraded successfully!');
                }
              } catch (verifyErr: any) {
                alert('Payment verification failed: ' + (verifyErr.response?.data?.message || verifyErr.message));
              } finally {
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
            prefill: {
              name: checkoutData.userName,
              email: checkoutData.userEmail,
            },
            theme: { color: '#2563eb' },
          };

          if (checkoutData.orderId && !checkoutData.orderId.startsWith('order_mock_')) {
            options.order_id = checkoutData.orderId;
          }
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        }

        // Direct Verification Flow for Dev/Mock Environment
        const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 12);
        const mockSignature = 'sig_mock_verified';

        const verifyRes = await subscriptionApi.verifyPayment({
          razorpay_order_id: checkoutData.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
        });

        if (verifyRes.data.success) {
          setSub(verifyRes.data.data);
          alert('🎉 Pro Plan upgraded successfully!');
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout failed: ' + (err.response?.data?.message || err.message || 'Please try again.'));
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Subscription & Billing</h1>
            <p className="text-xs text-slate-500">Manage your monthly receipt limits and subscription plan</p>
          </div>

          {/* Current Subscription Usage Status */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Current Active Plan</span>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  {sub?.plan === 'PRO' ? (
                    <span className="text-brand-600 flex items-center gap-1.5"><Zap className="w-5 h-5 fill-brand-600" /> Pro Plan (Unlimited Receipts)</span>
                  ) : (
                    <span>Free Plan (20 Receipts / mo)</span>
                  )}
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                sub?.plan === 'PRO' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {sub?.status || 'ACTIVE'}
              </span>
            </div>

            {/* Pro Plan Days Remaining Indicator */}
            {sub?.plan === 'PRO' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900">30-Day Pro Subscription Active</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-extrabold shadow-2xs">
                    {sub.daysRemaining != null ? `${sub.daysRemaining} Days Left` : '30 Days Left'}
                  </span>
                </div>
                <p className="text-xs text-emerald-700">
                  Enjoy unlimited receipt uploads! Your subscription is active until{' '}
                  <strong>{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '30 days from activation'}</strong>.
                </p>
              </div>
            )}

            {/* Monthly Usage Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Monthly Receipt Usage</span>
                <span className="text-slate-900">
                  {sub?.monthlyUsageCount || 0} / {sub?.plan === 'PRO' ? 'Unlimited' : sub?.monthlyLimit || 20}
                </span>
              </div>
              {sub?.plan !== 'PRO' && (
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (sub?.monthlyUsageCount || 0) >= 20 ? 'bg-rose-600' : 'bg-brand-600'
                    }`}
                    style={{ width: `${Math.min(100, ((sub?.monthlyUsageCount || 0) / 20) * 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade Cards */}
          {sub?.plan !== 'PRO' && (
            <div className="bg-white p-6 rounded-xl border-2 border-brand-600 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Upgrade to Pro (₹99 / Month)</h3>
                  <p className="text-xs text-slate-500">Get 30 days of unlimited receipt uploads, custom auto-rules, and Excel exports.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-semibold">
                    <button
                      onClick={() => setBillingCycle('MONTHLY')}
                      className={`px-3 py-1 rounded ${billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      ₹99 / mo
                    </button>
                    <button
                      onClick={() => setBillingCycle('YEARLY')}
                      className={`px-3 py-1 rounded ${billingCycle === 'YEARLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      ₹999 / yr
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Unlimited Receipt Uploads (30 Days)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Priority OCR Extraction</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Custom Auto-Categorization Rules</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Excel (.xlsx) & CSV Downloads</div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {isProcessing ? 'Processing via Razorpay...' : `Upgrade via Razorpay (${billingCycle === 'MONTHLY' ? '₹99/mo' : '₹999/yr'})`}
              </button>
            </div>
          )}
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
