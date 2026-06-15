"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";

export function Navbar() {
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
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
