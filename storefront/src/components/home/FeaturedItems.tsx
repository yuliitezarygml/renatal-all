"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export function FeaturedItems({ items = [] }: { items?: any[] }) {
  const featuredItems = items.slice(0, 4);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Featured Equipment</h2>
            <p className="text-lg text-muted-foreground">Top-rated gear available for rent right now.</p>
          </div>
          <Link href="/catalog" className="hidden md:inline-flex font-medium text-primary hover:underline">
            View All Items
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-all"
            >
              <Link href={`/items/${item.id}`} className="flex-1 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image 
                    src={item.photoUrl || "https://images.unsplash.com/photo-1504280650214-41d1e4eb41ce?q=80&w=2000&auto=format&fit=crop"} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold">
                    {item.category?.name || "Equipment"}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{item.averageRating ? item.averageRating.toFixed(1) : "New"}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-lg">${item.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link href="/catalog" className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            View All Items
          </Link>
        </div>
      </div>
    </section>
  );
}
