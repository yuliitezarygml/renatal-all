"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Smartphone, Key, Save, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage("Settings saved successfully!");
      setTimeout(() => setToastMessage(""), 3000);
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
            { name: "General", icon: Settings },
            { name: "Notifications", icon: Bell },
            { name: "Security", icon: Shield },
            { name: "Telegram Bot", icon: Smartphone },
            { name: "API Keys", icon: Key },
          ].map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-brand-50 text-brand-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                {item.name}
              </button>
            );
          })}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          {activeTab === "General" && (
            <>
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
                  <option value="MDL">MDL (L)</option>
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
                      <option value="MDL">MDL (L)</option>
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
            </>
          )}

          {activeTab === "Notifications" && (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="space-y-4">
                  {[
                    "New Rental Bookings",
                    "Rental Cancellations",
                    "Daily Revenue Reports",
                    "Low Stock Alerts",
                    "System Updates"
                  ].map((label, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-sm flex items-center">
                    {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "Security" && (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
                <p className="text-sm text-slate-500">Manage your password and security preferences.</p>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div className="pt-2">
                    <button type="button" className="text-sm font-medium text-brand-600 hover:text-brand-700">Enable Two-Factor Authentication (2FA)</button>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-sm flex items-center">
                    {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" />Update Password</>}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "Telegram Bot" && (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Telegram Bot Configuration</h2>
                <p className="text-sm text-slate-500">Configure your bot token and Webhook settings.</p>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bot Token</label>
                    <input type="password" defaultValue="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bot Username</label>
                    <input type="text" defaultValue="@RentalTestBot" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Webhook Status</h3>
                    <p className="text-sm text-emerald-600 flex items-center font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Active and listening</p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-sm flex items-center">
                    {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" />Save Configuration</>}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "API Keys" && (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">API Keys</h2>
                  <p className="text-sm text-slate-500">Manage keys for external integrations.</p>
                </div>
                <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
                  Generate New Key
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Production Key</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">pk_live_********************89ab</p>
                  </div>
                  <button className="text-sm font-medium text-rose-600 hover:text-rose-700">Revoke</button>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Test Key</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">pk_test_********************cd34</p>
                  </div>
                  <button className="text-sm font-medium text-rose-600 hover:text-rose-700">Revoke</button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-50"
        >
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
