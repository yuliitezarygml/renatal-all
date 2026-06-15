"use client";

import { motion } from "framer-motion";
import { Plus, Search, Filter, Loader2, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Item = {
  id: number;
  name: string;
  category: { name: string } | string;
  categoryId?: number;
  pricePerDay: number;
  deposit: number;
  status?: string;
  photoUrls?: string[];
  description?: string;
  averageRating?: number;
  reviewCount?: number;
};

type Category = {
  id: number;
  name: string;
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [itemsData, categoriesData] = await Promise.all([
        fetchApi<Item[]>("/items"),
        fetchApi<Category[]>("/categories").catch(() => []) // Optional categories fetch
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentItem({ name: "", pricePerDay: 0, deposit: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Item) => {
    setModalMode("edit");
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      // Bypass fetchApi for FormData since fetchApi forces JSON
      const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/upload`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.photoUrls && data.photoUrls.length > 0) {
        setCurrentItem({ ...currentItem, photoUrls: data.photoUrls });
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenDelete = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === "add") {
        await fetchApi("/items", {
          method: "POST",
          body: JSON.stringify(currentItem),
        });
      } else if (modalMode === "edit" && currentItem.id) {
        await fetchApi(`/items/${currentItem.id}`, {
          method: "PUT",
          body: JSON.stringify(currentItem),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Failed to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSaving(true);
    try {
      await fetchApi(`/items/${itemToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Items Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all rental items, pricing, and availability.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all duration-200"
              placeholder="Search items..."
            />
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 w-full sm:w-auto">
            <Filter className="-ml-1 mr-2 h-4 w-4 text-slate-400" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">No items found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {items.map((item, index) => {
                  const status = item.status || "Available";
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      key={item.id} 
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.photoUrls && item.photoUrls.length > 0 ? (
                            <img src={`http://localhost:3001${item.photoUrls[0]}`} alt={item.name} className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
                          ) : (
                            <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">IMG</div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{item.name}</div>
                            <div className="text-xs mt-1 mb-0.5">
                              {item.averageRating && item.averageRating > 0 ? (
                                <span className="flex items-center text-amber-500 font-medium">
                                  ⭐️ {item.averageRating.toFixed(1)} <span className="text-slate-400 ml-1 font-normal">({item.reviewCount})</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">Нет отзывов</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">ID: ITM-{item.id.toString().padStart(4, '0')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {typeof item.category === 'object' ? item.category?.name : item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="text-slate-900 font-medium">${item.pricePerDay} / day</div>
                        <div className="text-xs">Deposit: ${item.deposit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                          status === "Available" ? "bg-emerald-100 text-emerald-800" :
                          status === "Rented" ? "bg-indigo-100 text-indigo-800" :
                          "bg-rose-100 text-rose-800"
                        )}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenDelete(item)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={modalMode === "add" ? "Add Item" : "Edit Item"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              value={currentItem.name || ""}
              onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g. Sony A7IV Camera"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <ReactQuill 
              theme="snow" 
              value={currentItem.description || ""} 
              onChange={(val) => setCurrentItem({...currentItem, description: val})} 
              className="bg-white rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image Upload</label>
            <div className="flex items-center gap-4">
              {currentItem.photoUrls && currentItem.photoUrls.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {currentItem.photoUrls.map((url, idx) => (
                    <img key={idx} src={`http://localhost:3001${url}`} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-slate-200" />
                  ))}
                </div>
              )}
              <input type="file" multiple className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => {
                const data = new FormData();
                Array.from((e.target as HTMLInputElement).files || []).forEach(file => {
                  data.append('images', file);
                });
                fetch('http://localhost:3001/api/upload', {
                  method: 'POST',
                  body: data,
                }).then(res => res.json()).then(data => {
                  if (data.photoUrls) {
                    setCurrentItem({...currentItem, photoUrls: [...(currentItem.photoUrls || []), ...data.photoUrls]});
                  }
                });
              }} />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-brand-600" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={currentItem.categoryId || ""}
              onChange={(e) => setCurrentItem({...currentItem, categoryId: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price per Day ($)</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                value={currentItem.pricePerDay || ""}
                onChange={(e) => setCurrentItem({...currentItem, pricePerDay: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deposit ($)</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                value={currentItem.deposit || ""}
                onChange={(e) => setCurrentItem({...currentItem, deposit: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
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
              {isSaving ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isSaving && setIsDeleteModalOpen(false)}
        title="Delete Item"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-bold text-slate-900">{itemToDelete?.name}</span>? This action cannot be undone.
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
