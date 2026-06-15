"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Access the best equipment, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-primary">without the commitment.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Premium gear for creators, builders, and adventurers. Rent what you need, when you need it.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/catalog" 
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
            >
              Explore Catalog
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/#how-it-works" 
              className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-input bg-background font-medium text-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
