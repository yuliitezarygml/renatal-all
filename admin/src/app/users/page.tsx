"use client";

import { motion } from "framer-motion";
import { Search, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";

type User = {
  id: number;
  name: string;
  phone: string;
  telegramId: string;
  role: string;
  status?: string; // Not explicitly in backend spec, assume derived or added
  rentals?: any[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const handleViewUser = async (id: number) => {
    setIsModalOpen(true);
    setIsUserLoading(true);
    setSelectedUser(null);
    try {
      const data = await fetchApi<User>(`/users/${id}`);
      setSelectedUser(data);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchApi<User[]>("/users");
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users Management</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage clients and admin accounts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all duration-200"
              placeholder="Search users by name, phone, or Telegram ID..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">No users found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rentals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user, index) => {
                  const status = user.status || "Active";
                  const rentalsCount = user.rentals ? user.rentals.length : 0;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      key={user.id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold uppercase">
                            {user.name ? user.name.charAt(0) : '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{user.phone}</div>
                        <div className="text-sm text-slate-500">{user.telegramId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                          user.role === "ADMIN" ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-800"
                        )}>
                          {user.role || 'CUSTOMER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {rentalsCount} total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {status === "Active" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
                          ) : (
                            <ShieldAlert className="h-4 w-4 text-rose-500 mr-1.5" />
                          )}
                          <span className={cn(
                            "text-sm",
                            status === "Active" ? "text-emerald-700" : "text-rose-700"
                          )}>
                            {status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewUser(user.id)}
                          className="text-brand-600 hover:text-brand-900 transition-colors bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 hover:bg-brand-100"
                        >
                          View Dossier
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="User Dossier"
      >
        {isUserLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : selectedUser ? (
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                <div className="h-16 w-16 bg-gradient-to-tr from-brand-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                  {selectedUser.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedUser.name}</h2>
                  <p className="text-slate-500 text-sm">ID: {selectedUser.id} • {selectedUser.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Phone Number</p>
                  <p className="text-slate-900 font-semibold bg-white p-2 rounded-lg border border-slate-200">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Telegram ID</p>
                  <p className="text-slate-900 font-semibold bg-white p-2 rounded-lg border border-slate-200">{selectedUser.telegramId || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-md text-sm">
                  {selectedUser.rentals?.length || 0}
                </span>
                Rental History
              </h3>
              
              {(!selectedUser.rentals || selectedUser.rentals.length === 0) ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-500">This user has no rental history yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {selectedUser.rentals.map((rental: any) => (
                    <div key={rental.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                      <div>
                        <p className="font-semibold text-slate-900">{rental.item?.name || 'Unknown Item'}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-emerald-600">${rental.totalPrice}</p>
                        <span className={cn(
                          "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                          rental.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" :
                          rental.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                          rental.status === "COMPLETED" ? "bg-slate-100 text-slate-800" :
                          "bg-rose-100 text-rose-800"
                        )}>
                          {rental.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-rose-500">Failed to load user dossier.</div>
        )}
      </Modal>
    </div>
  );
}
