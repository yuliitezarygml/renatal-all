"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Package, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Gear",
    description: "Browse our extensive catalog of premium equipment."
  },
  {
    icon: CalendarCheck,
    title: "Book Dates",
    description: "Select your rental period and confirm availability instantly."
  },
  {
    icon: Package,
    title: "Receive & Use",
    description: "Pick up locally or get it delivered straight to your door."
  },
  {
    icon: RefreshCw,
    title: "Return Easily",
    description: "Drop off the item or schedule a convenient pickup when done."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Renting high-end equipment has never been this seamless. Follow these simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
