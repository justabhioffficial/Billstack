import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { SeoHead } from '../../components/SeoHead';
import { referralApi } from '../../services/api';
import { ReferralStats } from '../../types';
import { Gift, Copy, Check, Users, Sparkles, Share2, ArrowRight } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await referralApi.getStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (ignored) {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleCopyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <SeoHead
        title="Invite Friends & Earn Credits — BillStack Referrals"
        description="Share BillStack with fellow freelancers and small businesses in India. Earn extra receipt OCR credits for every active referral."
      />
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 pb-20 md:pb-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                <Gift className="w-3.5 h-3.5" /> Viral Growth Referral Program
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Invite Friends & Expand Your Receipt Allowance
              </h1>
              <p className="text-sm text-indigo-100">
                Share BillStack with freelancers and business owners. When your friend uploads their 1st receipt, you both unlock <strong>10 bonus receipt credits</strong>.
              </p>

              {/* Referral Link Box */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-xs font-mono truncate text-white">
                  {stats?.referralLink || 'Generating your unique referral link...'}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Invite Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Total Invites</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalInvites || 0}</p>
              <span className="text-xs text-slate-500">Friends signed up</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase text-emerald-600">Activated Referrals</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.activatedReferrals || 0}</p>
              <span className="text-xs text-emerald-600 font-medium">Uploaded 1st receipt</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Bonus Rewards</span>
                <Gift className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{stats?.currentRewardBonus || '0 Credits'}</p>
              <span className="text-xs text-slate-500">Granted to your account</span>
            </div>
          </div>

          {/* Referral History Table */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Referral Activity History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                    <th className="p-3">Referral Code</th>
                    <th className="p-3">Referred User ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reward</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.referralHistory && stats.referralHistory.length > 0 ? (
                    stats.referralHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{item.referralCode}</td>
                        <td className="p-3 font-mono text-slate-500">{item.referredId ? `${item.referredId.substring(0, 8)}...` : 'Pending Signup'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            item.status === 'ACTIVATED' || item.status === 'REWARDED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{item.rewardGranted || 'Pending 1st upload'}</td>
                        <td className="p-3 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">
                        No active referrals yet. Copy your referral link above and invite your contacts!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
