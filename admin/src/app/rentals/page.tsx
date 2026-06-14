"use client";

import { motion } from "framer-motion";
import { Plus, Search, Filter, Calendar as CalendarIcon, Loader2, Edit2, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";

type Rental = {
  id: number;
  user: { id: number; name: string; phone?: string; telegramId?: string } | string;
  userId?: number;
  item: { id: number; name: string } | string;
  itemId?: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
};

type UserOption = { id: number; name: string };
type ItemOption = { id: number; name: string; pricePerDay: number };

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "manage">("create");
  const [currentRental, setCurrentRental] = useState<Partial<Rental>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rentalsData, usersData, itemsData] = await Promise.all([
        fetchApi<Rental[]>("/rentals"),
        fetchApi<UserOption[]>("/users").catch(() => []),
        fetchApi<ItemOption[]>("/items").catch(() => []),
      ]);
      setRentals(rentalsData);
      setUsers(usersData);
      setItems(itemsData);
    } catch (error) {
      console.error("Failed to load rentals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentRental({
      userId: undefined,
      itemId: undefined,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: "PENDING"
    });
    setIsModalOpen(true);
  };

  const handleOpenManage = (rental: Rental) => {
    setModalMode("manage");
    setCurrentRental(rental);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === "create") {
        await fetchApi("/rentals", {
          method: "POST",
          body: JSON.stringify(currentRental),
        });
      } else if (modalMode === "manage" && currentRental.id) {
        await fetchApi(`/rentals/${currentRental.id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: currentRental.status }),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to save rental:", error);
      alert("Failed to save rental.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (status: string) => {
    setIsSaving(true);
    try {
      await fetchApi(`/rentals/${currentRental.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rentals Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage active, pending, and completed rentals.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Create Rental
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
              placeholder="Search by ID, User, or Item..."
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200">
              <CalendarIcon className="-ml-1 mr-2 h-4 w-4 text-slate-400" />
              Dates
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200">
              <Filter className="-ml-1 mr-2 h-4 w-4 text-slate-400" />
              Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : rentals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">No rentals found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rental ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User & Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {rentals.map((rental, index) => {
                  const userName = typeof rental.user === 'object' ? rental.user.name : rental.user || 'Unknown User';
                  const itemName = typeof rental.item === 'object' ? rental.item.name : rental.item || 'Unknown Item';
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      key={rental.id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-600">
                        R-{rental.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-900">{userName}</span>
                          {typeof rental.user === 'object' && rental.user.phone && (
                            <div className="flex items-center gap-1.5 ml-1">
                              <a href={`tel:${rental.user.phone}`} className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-1 rounded-md transition-colors" title="Call User">
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                              <a href={`https://t.me/+${rental.user.phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 p-1 rounded-md transition-colors" title="Telegram">
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                              <a href={`viber://chat?number=${rental.user.phone.replace('+', '')}`} className="text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 p-1 rounded-md transition-colors" title="Viber">
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{itemName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div>{new Date(rental.startDate).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400">to {new Date(rental.endDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        ${rental.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                          rental.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" :
                          rental.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                          rental.status === "COMPLETED" ? "bg-slate-100 text-slate-800" :
                          "bg-rose-100 text-rose-800"
                        )}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleOpenManage(rental)}
                          className="text-brand-600 hover:text-brand-900 transition-colors inline-flex items-center"
                        >
                          <Edit2 className="h-4 w-4 mr-1" /> Manage
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create/Manage Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={modalMode === "create" ? "Create New Rental" : "Manage Rental R-" + currentRental?.id?.toString().padStart(4, '0')}
      >
        {modalMode === "create" ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">User</label>
              <select
                required
                value={currentRental.userId || ""}
                onChange={(e) => setCurrentRental({...currentRental, userId: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Select User</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Item</label>
              <select
                required
                value={currentRental.itemId || ""}
                onChange={(e) => setCurrentRental({...currentRental, itemId: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Select Item</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.name} (${i.pricePerDay}/day)</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  required
                  value={currentRental.startDate ? new Date(currentRental.startDate).toISOString().split('T')[0] : ""}
                  onChange={(e) => setCurrentRental({...currentRental, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input 
                  type="date"
                  required
                  value={currentRental.endDate ? new Date(currentRental.endDate).toISOString().split('T')[0] : ""}
                  onChange={(e) => setCurrentRental({...currentRental, endDate: e.target.value})}
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
                {isSaving ? "Saving..." : "Save Rental"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">User</p>
                  <p className="font-semibold text-slate-900">{typeof currentRental.user === 'object' ? currentRental.user?.name : currentRental.user}</p>
                </div>
                <div>
                  <p className="text-slate-500">Item</p>
                  <p className="font-semibold text-slate-900">{typeof currentRental.item === 'object' ? currentRental.item?.name : currentRental.item}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-slate-500">Period</p>
                  <p className="font-semibold text-slate-900">
                    {currentRental.startDate && new Date(currentRental.startDate).toLocaleDateString()} - 
                    {currentRental.endDate && new Date(currentRental.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Total Price</p>
                  <p className="font-bold text-emerald-600 text-lg">${currentRental.totalPrice}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500">Current Status</p>
                  <span className={cn(
                    "mt-1 px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full",
                    currentRental.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" :
                    currentRental.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                    currentRental.status === "COMPLETED" ? "bg-slate-100 text-slate-800" :
                    "bg-rose-100 text-rose-800"
                  )}>
                    {currentRental.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => updateStatus("ACTIVE")}
                  disabled={isSaving || currentRental.status === "ACTIVE"}
                  className="w-full px-4 py-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 hover:border-emerald-300 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  ✅ Approve & Activate
                </button>
                <button 
                  onClick={() => updateStatus("COMPLETED")}
                  disabled={isSaving || currentRental.status === "COMPLETED"}
                  className="w-full px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  🏁 Mark as Completed
                </button>
                <button 
                  onClick={() => updateStatus("PENDING")}
                  disabled={isSaving || currentRental.status === "PENDING"}
                  className="w-full px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 hover:border-amber-300 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  ⏳ Set to Pending
                </button>
                <button 
                  onClick={() => updateStatus("CANCELLED")}
                  disabled={isSaving || currentRental.status === "CANCELLED"}
                  className="w-full px-4 py-3 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 hover:border-rose-300 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  ❌ Reject / Cancel
                </button>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
