"use client";

import { motion } from "framer-motion";
import { Plus, MapPin, Loader2, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";

type Location = {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Partial<Location>>({ isActive: true });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi<Location[]>("/locations");
      setLocations(data);
    } catch (error) {
      console.error("Failed to load locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (loc?: Location) => {
    setCurrentLocation(loc || { name: "", address: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;
    try {
      await fetchApi(`/locations/${id}`, { method: "DELETE" });
      loadData();
    } catch (e) {
      alert("Failed to delete location");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (currentLocation.id) {
        await fetchApi(`/locations/${currentLocation.id}`, {
          method: "PUT",
          body: JSON.stringify(currentLocation),
        });
      } else {
        await fetchApi("/locations", {
          method: "POST",
          body: JSON.stringify(currentLocation),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Failed to save location.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pickup Locations</h1>
          <p className="text-sm text-slate-500 mt-1">Manage pickup points for rentals.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-all"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Location
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">No pickup locations found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {locations.map((loc, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={loc.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                        <span className="text-sm font-medium text-slate-900">{loc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {loc.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${loc.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                        {loc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(loc)} className="text-brand-600 hover:text-brand-900 mx-2"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(loc.id)} className="text-rose-600 hover:text-rose-900 mx-2"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={currentLocation.id ? "Edit Location" : "Create Location"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input 
              required
              type="text"
              value={currentLocation.name || ""}
              onChange={(e) => setCurrentLocation({...currentLocation, name: e.target.value})}
              placeholder="e.g. Main Office"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input 
              required
              type="text"
              value={currentLocation.address || ""}
              onChange={(e) => setCurrentLocation({...currentLocation, address: e.target.value})}
              placeholder="e.g. 123 Main St, City"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="isActive"
              checked={currentLocation.isActive || false}
              onChange={(e) => setCurrentLocation({...currentLocation, isActive: e.target.checked})}
              className="h-4 w-4 text-brand-600 border-slate-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-slate-700">
              Active (Visible to users)
            </label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors flex items-center"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Location"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
