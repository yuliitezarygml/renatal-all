"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

import Image from "next/image";

export function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Custom event listener to update user if changed elsewhere
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    };
    
    handleStorageChange();
    window.addEventListener("user-updated", handleStorageChange);
    return () => window.removeEventListener("user-updated", handleStorageChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">EquipRent</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/catalog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Catalog
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              How it Works
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors hidden md:block">
            <Search className="w-5 h-5" />
          </button>
          
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors">
              {user.avatar ? (
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image 
                    src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${user.avatar}`} 
                    alt={user.name} 
                    fill 
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-medium hidden md:block text-primary">{user.name}</span>
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Sign In
            </Link>
          )}

          <button className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
