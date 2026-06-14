"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Tags, 
  Package, 
  CalendarCheck, 
  Users, 
  Ticket, 
  MessageSquare,
  Settings,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Items", href: "/items", icon: Package },
  { name: "Rentals", href: "/rentals", icon: CalendarCheck },
  { name: "Users", href: "/users", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Discounts", href: "/discounts", icon: Ticket },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
            R
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-900 to-brand-600">
            RentalAdmin
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-brand-50 text-brand-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <Link
          href="/settings"
          className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
        >
          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-600" />
          Settings
        </Link>
      </div>
    </div>
  );
}
