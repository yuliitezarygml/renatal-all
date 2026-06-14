"use client";

import { Bell, Search, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const isNowDark = !isDark;
    setIsDark(isNowDark);
    if (isNowDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center flex-1">
        <button className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700">
          <Menu className="h-5 w-5" />
        </button>
        <div className="max-w-md w-full relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all duration-200"
            placeholder="Search rentals, users, or items..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="no-invert relative p-2 text-slate-400 hover:text-slate-500 transition-colors">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm ring-2 ring-white cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
