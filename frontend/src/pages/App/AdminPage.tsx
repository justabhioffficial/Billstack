import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { adminApi } from '../../services/api';
import { AdminStats, HealthStatus, AuditLog, UserFeedback, PagedResponse } from '../../types';
import {
  ShieldAlert,
  Users,
  Receipt,
  FileWarning,
  CreditCard,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  History,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [funnel, setFunnel] = useState<Record<string, any> | null>(null);
  const [auditLogs, setAuditLogs] = useState<PagedResponse<AuditLog> | null>(null);
  const [feedbacks, setFeedbacks] = useState<PagedResponse<UserFeedback> | null>(null);
  const [auditPage, setAuditPage] = useState<number>(0);
  const [feedbackPage, setFeedbackPage] = useState<number>(0);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, healthRes, funnelRes, auditRes, feedbackRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getHealth(),
        adminApi.getAnalyticsFunnel(),
        adminApi.getAuditLogs(auditPage, 10),
        adminApi.getFeedbackList(feedbackPage, 10, feedbackStatusFilter || undefined),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.data);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value.data.success) {
        setHealth(healthRes.value.data.data);
      }
      if (funnelRes.status === 'fulfilled' && funnelRes.value.data.success) {
        setFunnel(funnelRes.value.data.data);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value.data.success) {
        setAuditLogs(auditRes.value.data.data);
      }
      if (feedbackRes.status === 'fulfilled' && feedbackRes.value.data.success) {
        setFeedbacks(feedbackRes.value.data.data);
      }
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, [auditPage, feedbackPage, feedbackStatusFilter]);

  const handleUpdateFeedbackStatus = async (id: string, status: string) => {
    setUpdatingFeedbackId(id);
    try {
      await adminApi.updateFeedbackStatus(id, status, 'Reviewed by Admin');
      fetchAdminData();
    } catch (e) {
      console.error('Failed to update feedback status', e);
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'UP':
      case 'HEALTHY':
      case 'SUCCESS':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      case 'DEGRADED':
      case 'UNDER_REVIEW':
      case 'WARNING':
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            <AlertTriangle className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
            <XCircle className="w-3 h-3" /> {status || 'UNKNOWN'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 pb-20 md:pb-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Operations & Health</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time system health, activation funnel, user feedback, and security audit logs
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchAdminData()}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Telemetry
            </button>
          </div>

          {/* System Health Component Statuses */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">System Component Health</h2>
              </div>
              {health && getStatusBadge(health.overallStatus)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {health?.components ? (
                Object.entries(health.components).map(([comp, state]) => (
                  <div key={comp} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-400">{comp}</span>
                    <div className="mt-2">{getStatusBadge(state)}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Loading system components...</p>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 gap-2">
              <span>Active Platform Users: <strong>{health?.activeUsers ?? 0}</strong></span>
              <span>Total Receipts Tracked: <strong>{health?.totalReceipts ?? 0}</strong></span>
              <span>OCR Success Rate: <strong>{((health?.ocrSuccessRate ?? 0) * 100).toFixed(1)}%</strong></span>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase">Total Users</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Free: {stats?.freeUsersCount || 0} | Pro: {stats?.proUsersCount || 0}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase">Total Receipts</span>
                <Receipt className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.totalReceipts || 0}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Processed in DB</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase">Est. MRR</span>
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{stats?.monthlyRecurringRevenue || 0}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Active Subscriptions</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase text-rose-600">OCR Review Backlog</span>
                <FileWarning className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.failedOcrCount || 0}</p>
              <span className="text-[11px] text-rose-600 font-medium">Flagged receipts</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase text-amber-600">Payment Errors</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.failedPaymentsCount || 0}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Checkout failures</span>
            </div>
          </div>

          {/* Activation Funnel & Telemetry */}
          {funnel && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Product Activation Funnel</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Users</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{funnel.totalUsers || 0}</p>
                </div>
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Activated Users (Uploaded Receipt)</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {funnel.activatedUsers || 0} <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">({funnel.activationRatePercentage || 0}%)</span>
                  </p>
                </div>
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Power Users (5+ Receipts)</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{funnel.retainedUsers || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Feedback Inbox */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">User Feedback Inbox</h2>
              </div>
              <select
                value={feedbackStatusFilter}
                onChange={(e) => {
                  setFeedbackStatusFilter(e.target.value);
                  setFeedbackPage(0);
                }}
                className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="DISMISSED">DISMISSED</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <th className="p-3">Category</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {feedbacks?.content && feedbacks.content.length > 0 ? (
                    feedbacks.content.map((fb) => (
                      <tr key={fb.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{fb.feedbackType}</td>
                        <td className="p-3 text-amber-500 font-bold">{'★'.repeat(fb.rating || 0)}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={fb.message}>
                          {fb.message}
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{fb.userId?.substring(0, 8)}...</td>
                        <td className="p-3">{getStatusBadge(fb.status)}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            disabled={updatingFeedbackId === fb.id}
                            onClick={() => handleUpdateFeedbackStatus(fb.id, 'RESOLVED')}
                            className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg text-[11px] transition"
                          >
                            Resolve
                          </button>
                          <button
                            disabled={updatingFeedbackId === fb.id}
                            onClick={() => handleUpdateFeedbackStatus(fb.id, 'UNDER_REVIEW')}
                            className="px-2 py-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100 rounded-lg text-[11px] transition"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        No feedback items submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {feedbacks && feedbacks.totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
                <span>Page {feedbacks.page + 1} of {feedbacks.totalPages}</span>
                <div className="space-x-2">
                  <button
                    disabled={feedbacks.page === 0}
                    onClick={() => setFeedbackPage((p) => Math.max(0, p - 1))}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={feedbacks.last}
                    onClick={() => setFeedbackPage((p) => p + 1)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Security Audit Log</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {auditLogs?.content && auditLogs.content.length > 0 ? (
                    auditLogs.content.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                        <td className="p-3 text-slate-500">{log.target || '-'}</td>
                        <td className="p-3">{getStatusBadge(log.status)}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-sans max-w-xs truncate" title={log.details}>
                          {log.details || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">
                        No audit log entries recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {auditLogs && auditLogs.totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
                <span>Page {auditLogs.page + 1} of {auditLogs.totalPages}</span>
                <div className="space-x-2">
                  <button
                    disabled={auditLogs.page === 0}
                    onClick={() => setAuditPage((p) => Math.max(0, p - 1))}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={auditLogs.last}
                    onClick={() => setAuditPage((p) => p + 1)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
