import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { UploadModal } from '../../components/UploadModal';
import { categoryApi, ruleApi } from '../../services/api';
import { Category, CategorizationRule } from '../../types';
import { Tags, Plus, Trash2, Sliders, CheckCircle2 } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<CategorizationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#2563EB');

  // New Rule Form
  const [vendorPattern, setVendorPattern] = useState('');
  const [selectedRuleCategory, setSelectedRuleCategory] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catRes, ruleRes] = await Promise.all([
        categoryApi.getCategories(),
        ruleApi.getRules()
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (ruleRes.data.success) setRules(ruleRes.data.data);
    } catch (ignored) {}
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await categoryApi.createCategory({ name: newCatName, color: newCatColor });
      setNewCatName('');
      loadData();
    } catch (ignored) {}
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorPattern.trim() || !selectedRuleCategory) return;
    try {
      await ruleApi.createRule({ vendorPattern, categoryId: selectedRuleCategory });
      setVendorPattern('');
      loadData();
    } catch (ignored) {}
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await ruleApi.deleteRule(id);
      loadData();
    } catch (ignored) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 pb-20 md:pb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories & Rules</h1>
            <p className="text-xs text-slate-500">Manage expense categories and custom vendor auto-tagging rules</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CATEGORIES SECTION */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Tags className="w-4 h-4 text-brand-600" />
                  Expense Categories
                </h2>

                {/* Create Custom Category */}
                <form onSubmit={handleCreateCategory} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-8 h-8 p-0.5 border border-slate-300 rounded cursor-pointer"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Add
                  </button>
                </form>

                {/* Category Pills List */}
                <div className="space-y-2 pt-2">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color || '#2563EB' }}></span>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                      </div>
                      {c.isDefault ? (
                        <span className="text-[10px] text-slate-400 font-medium">Default</span>
                      ) : (
                        <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded">Custom</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CATEGORIZATION RULES SECTION */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  Custom Categorization Rules
                </h2>
                <p className="text-xs text-slate-500">
                  Automate tagging. User-created rules override generic keyword matching.
                </p>

                {/* Create Custom Rule Form */}
                <form onSubmit={handleCreateRule} className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">If Vendor Contains</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS or Swiggy"
                      value={vendorPattern}
                      onChange={(e) => setVendorPattern(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Tag As Category</label>
                    <select
                      value={selectedRuleCategory}
                      onChange={(e) => setSelectedRuleCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-600 text-white font-semibold text-xs rounded-lg hover:bg-brand-700 transition-colors shadow-xs"
                  >
                    Save Rule
                  </button>
                </form>

                {/* Rules List */}
                <div className="space-y-2 pt-2">
                  {rules.length > 0 ? (
                    rules.map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs">
                        <div>
                          <span className="font-mono text-slate-900 font-bold">"{r.vendorPattern}"</span>
                          <span className="text-slate-400 mx-2">→</span>
                          <span className="font-semibold text-brand-600">{r.categoryName}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteRule(r.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">No custom rules created yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
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
