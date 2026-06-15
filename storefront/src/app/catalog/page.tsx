import Link from "next/link";
import Image from "next/image";
import { Star, Filter } from "lucide-react";
import { ITEMS } from "@/data/items";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  let items = [];
  try {
    const res = await fetch(`${apiUrl}/items`, { cache: "no-store" });
    if (res.ok) items = await res.json();
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Equipment Catalog</h1>
          <p className="text-muted-foreground">Browse our entire collection of premium gear.</p>
        </div>
        <button className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors self-start md:self-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item: any) => (
          <div
            key={item.id}
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
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40">
                  <div>
                    <span className="font-bold text-lg">${item.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${item.deposit} deposit
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
