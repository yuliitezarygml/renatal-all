"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";

type Rental = {
  id: number;
  user: { name: string } | string;
  item: { name: string } | string;
  status: string;
};

type DashboardStats = {
  totalRevenue: string;
  activeRentals: string;
  totalUsers: string;
  totalItems: string;
  chartData: { name: string; total: number }[];
  topItems: { name: string; revenue: number }[];
};

const defaultStats = [
  { name: "Total Revenue", value: "$0", change: "0%", trend: "up", icon: DollarSign },
  { name: "Active Rentals", value: "0", change: "0%", trend: "up", icon: CalendarCheck },
  { name: "Total Users", value: "0", change: "0%", trend: "up", icon: Users },
  { name: "Available Items", value: "0", change: "0%", trend: "up", icon: Package },
];

export default function Dashboard() {
  const [recentRentals, setRecentRentals] = useState<Rental[]>([]);
  const [stats, setStats] = useState(defaultStats);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch rentals for recent rentals table
        const rentalsData = await fetchApi<Rental[]>("/rentals");
        setRecentRentals(rentalsData.slice(0, 5)); // Just take top 5
        
        try {
          const statsData = await fetchApi<any>("/stats");
          if (statsData) {
            setDashboardData(statsData);
            setStats([
              { name: "Total Revenue", value: `$${statsData.totalRevenue}`, change: "Active", trend: "up", icon: DollarSign },
              { name: "Active Rentals", value: statsData.activeRentals.toString(), change: "Now", trend: "up", icon: CalendarCheck },
              { name: "Total Users", value: statsData.totalUsers.toString(), change: "Total", trend: "up", icon: Users },
              { name: "Available Items", value: statsData.totalItems.toString(), change: "Total", trend: "up", icon: Package },
            ]);
          }
        } catch (e) {
          console.error("Stats error", e);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here's what's happening with your rental business today.</p>
        </div>
        <Link href="/rentals" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200">
          Create New Rental
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={stat.name}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={cn(
                "inline-flex items-center text-sm font-medium",
                stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
              )}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="ml-1 h-4 w-4" /> : <ArrowDownRight className="ml-1 h-4 w-4" />}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.name}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Rentals</h2>
            <Link href="/rentals" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              </div>
            ) : recentRentals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No recent rentals found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {recentRentals.map((rental) => {
                    const userName = typeof rental.user === 'object' ? rental.user.name : rental.user || 'Unknown User';
                    const itemName = typeof rental.item === 'object' ? rental.item.name : rental.item || 'Unknown Item';
                    return (
                      <tr key={rental.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          R-{rental.id.toString().padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                            rental.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" :
                            rental.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                            "bg-slate-100 text-slate-800"
                          )}>
                            {rental.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Add New Item", icon: Package, href: "/items" },
              { label: "Create Category", icon: TrendingUp, href: "/categories" },
              { label: "Generate Discount", icon: DollarSign, href: "/discounts" },
            ].map((action, i) => (
              <Link 
                key={i} 
                href={action.href}
                className="w-full flex items-center p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-white flex items-center justify-center mr-3 transition-colors">
                  <action.icon className="h-5 w-5 text-slate-500 group-hover:text-brand-600" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-brand-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Analytics Section */}
      {dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
              <TrendingUp className="h-5 w-5 text-brand-500" />
            </div>
            <div className="h-72 w-full min-w-0 min-h-[288px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Top Performing Items</h2>
            <div className="space-y-4">
              {dashboardData.topItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-emerald-600">${item.revenue}</span>
                </div>
              ))}
              {(!dashboardData.topItems || dashboardData.topItems.length === 0) && (
                <p className="text-slate-500 text-center py-4">No data available yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


