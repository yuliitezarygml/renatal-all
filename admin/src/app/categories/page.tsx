"use client";

import { motion } from "framer-motion";
import { Plus, MoreVertical, Edit2, Trash2, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  description: string;
  itemsCount?: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi<Category[]>("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentCategory({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setModalMode("edit");
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === "add") {
        await fetchApi("/categories", {
          method: "POST",
          body: JSON.stringify(currentCategory),
        });
      } else if (modalMode === "edit" && currentCategory.id) {
        await fetchApi(`/categories/${currentCategory.id}`, {
          method: "PUT",
          body: JSON.stringify(currentCategory),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsSaving(true);
    try {
      await fetchApi(`/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadData();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the item categories available for rent.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={category.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg uppercase">
                  {category.name.charAt(0)}
                </div>
                <div className="relative group/menu">
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 shadow-lg rounded-xl w-36 py-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-opacity z-10 hidden group-hover/menu:block">
                    <button 
                      onClick={() => handleOpenEdit(category)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </button>
                    <button 
                      onClick={() => handleOpenDelete(category)}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{category.name}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{category.description || "No description provided."}</p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{category.itemsCount || 0} Items</span>
                <Link href="/items" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                  View items
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={modalMode === "add" ? "Add Category" : "Edit Category"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              value={currentCategory.name || ""}
              onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g. Electronics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={3}
              value={currentCategory.description || ""}
              onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
              placeholder="Brief description of the category..."
            />
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
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isSaving && setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the category <span className="font-bold text-slate-900">{categoryToDelete?.name}</span>? This action cannot be undone.
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
