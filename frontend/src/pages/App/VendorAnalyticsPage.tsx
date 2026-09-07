import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { vendorApi } from '../../services/api';
import { VendorAnalytics } from '../../types';
import { Store, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export const VendorAnalyticsPage: React.FC = () => {
  const [vendors, setVendors] = useState<VendorAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await vendorApi.getVendorAnalytics();
      if (res.data.success) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendor analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((v) =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Vendor Intelligence & Recurring Subscriptions</h1>
              <p className="text-slate-500 text-sm mt-1">Track top vendors, recurring software/service subscriptions, average spend, and MoM shifts.</p>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            /* Vendor Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div key={vendor.vendorName} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{vendor.vendorName}</h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-slate-500">{vendor.receiptCount} receipt{vendor.receiptCount > 1 ? 's' : ''}</span>
                          {vendor.isRecurring && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <RefreshCw className="w-3 h-3 mr-1" /> Recurring ({vendor.frequencyPattern || 'Monthly'})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 bg-slate-50 p-3 rounded-lg text-sm">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Total Spent</div>
                      <div className="font-bold text-slate-900 text-base">₹{vendor.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Avg Transaction</div>
                      <div className="font-bold text-slate-900 text-base">₹{vendor.averageTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Highest Single Bill</div>
                      <div className="font-semibold text-slate-700">₹{vendor.highestTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Current Month</div>
                      <div className="font-semibold text-slate-700">₹{vendor.currentMonthSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>

                  {vendor.momPercentageChange !== undefined && vendor.momPercentageChange !== null && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">MoM Spend Shift:</span>
                      <span className={`font-semibold flex items-center ${vendor.momPercentageChange >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {vendor.momPercentageChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(vendor.momPercentageChange)}% vs last month
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {filteredVendors.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                  No vendor matching your search.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <MobileNav onOpenUpload={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={fetchVendors} />
    </div>
  );
};
