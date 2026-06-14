"use client";

import { motion } from "framer-motion";
import { Plus, Tag, Percent, Hash, Loader2, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";

type Discount = {
  id: number;
  code: string;
  percentage?: number;
  fixedAmount?: number;
  isActive: boolean;
  uses?: number;
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentDiscount, setCurrentDiscount] = useState<Partial<Discount>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi<Discount[]>("/discounts");
      setDiscounts(data);
    } catch (error) {
      console.error("Failed to load discounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentDiscount({ code: "", isActive: true, percentage: 0, fixedAmount: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (discount: Discount) => {
    setModalMode("edit");
    setCurrentDiscount(discount);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (discount: Discount) => {
    setDiscountToDelete(discount);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...currentDiscount,
        percentage: currentDiscount.percentage || null,
        fixedAmount: currentDiscount.fixedAmount || null,
      };

      if (modalMode === "add") {
        await fetchApi("/discounts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (modalMode === "edit" && currentDiscount.id) {
        await fetchApi(`/discounts/${currentDiscount.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to save discount:", error);
      alert("Failed to save discount.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!discountToDelete) return;
    setIsSaving(true);
    try {
      await fetchApi(`/discounts/${discountToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      setDiscountToDelete(null);
      loadData();
    } catch (error) {
      console.error("Failed to delete discount:", error);
      alert("Failed to delete discount.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (discount: Discount) => {
    try {
      await fetchApi(`/discounts/${discount.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...discount, isActive: !discount.isActive }),
      });
      loadData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discounts & Promos</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage promotional codes.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Create Discount
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : discounts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">No discounts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((discount, index) => {
            const isPercentage = discount.percentage != null && discount.percentage > 0;
            const valueDisplay = isPercentage ? `${discount.percentage}%` : `$${discount.fixedAmount}`;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={discount.id}
                className={cn(
                  "bg-white rounded-2xl p-6 border shadow-sm transition-all duration-200 group relative",
                  discount.isActive ? "border-emerald-200 hover:border-emerald-300" : "border-slate-200 opacity-75"
                )}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button 
                    onClick={() => handleToggleActive(discount)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 bg-white rounded-md shadow-sm border border-slate-100 transition-colors"
                    title={discount.isActive ? "Deactivate" : "Activate"}
                  >
                    {discount.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(discount)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 bg-white rounded-md shadow-sm border border-slate-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleOpenDelete(discount)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-white rounded-md shadow-sm border border-slate-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isPercentage ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {isPercentage ? <Percent className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-slate-400" />
                        {discount.code}
                      </h3>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-full",
                    discount.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {discount.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-slate-500">Value</p>
                    <p className="text-2xl font-bold text-slate-900">{valueDisplay}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total Uses</p>
                    <p className="text-lg font-semibold text-slate-700">{discount.uses || 0}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={modalMode === "add" ? "Add Discount" : "Edit Discount"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
            <input 
              type="text" 
              required
              value={currentDiscount.code || ""}
              onChange={(e) => setCurrentDiscount({...currentDiscount, code: e.target.value.toUpperCase()})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 uppercase"
              placeholder="e.g. SUMMER2026"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Percentage (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={currentDiscount.percentage || ""}
                onChange={(e) => setCurrentDiscount({...currentDiscount, percentage: parseFloat(e.target.value), fixedAmount: undefined})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. 15"
                disabled={!!currentDiscount.fixedAmount}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Amount ($)</label>
              <input 
                type="number" 
                min="0"
                value={currentDiscount.fixedAmount || ""}
                onChange={(e) => setCurrentDiscount({...currentDiscount, fixedAmount: parseFloat(e.target.value), percentage: undefined})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. 50"
                disabled={!!currentDiscount.percentage}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="isActive"
              checked={currentDiscount.isActive !== false}
              onChange={(e) => setCurrentDiscount({...currentDiscount, isActive: e.target.checked})}
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active</label>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving || (!currentDiscount.percentage && !currentDiscount.fixedAmount)}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Discount"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isSaving && setIsDeleteModalOpen(false)}
        title="Delete Discount"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the discount code <span className="font-bold text-slate-900">{discountToDelete?.code}</span>? This action cannot be undone.
          </p>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
