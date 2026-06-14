"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Smartphone, Key, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your rental service preferences and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-2">
          {[
            { name: "General", icon: Settings, active: true },
            { name: "Notifications", icon: Bell, active: false },
            { name: "Security", icon: Shield, active: false },
            { name: "Telegram Bot", icon: Smartphone, active: false },
            { name: "API Keys", icon: Key, active: false },
          ].map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active 
                  ? "bg-brand-50 text-brand-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? "text-brand-600" : "text-slate-400"}`} />
              {item.name}
            </button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
            <p className="text-sm text-slate-500">Update your company details and basic settings.</p>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  defaultValue="Rental Service Inc."
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@rental.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="RUB">RUB (₽)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Telegram ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. 123456789"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">This ID receives support messages from the bot.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-sm flex items-center"
              >
                {isSaving ? "Saving..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
