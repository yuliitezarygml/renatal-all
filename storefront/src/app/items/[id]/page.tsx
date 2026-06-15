import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Star, Calendar, ShieldCheck, Check } from "lucide-react";
import { ITEMS } from "@/data/items";

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = ITEMS.find((i) => i.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link href="/catalog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-muted">
            <Image 
              src={item.imageUrl} 
              alt={item.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted opacity-60 hover:opacity-100 transition-opacity cursor-pointer border border-transparent hover:border-primary">
                <Image 
                  src={item.imageUrl} 
                  alt={`${item.title} angle ${i + 1}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium w-max mb-4">
            {item.category}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{item.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-semibold">{item.rating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">(128 reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="text-green-600 font-medium flex items-center">
              <Check className="w-4 h-4 mr-1" /> Available Now
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {item.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8 p-6 rounded-2xl bg-card border border-border/50">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Rental Rate</div>
              <div className="text-3xl font-bold">${item.pricePerDay}<span className="text-base font-normal text-muted-foreground">/day</span></div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Security Deposit</div>
              <div className="text-3xl font-bold">${item.deposit}</div>
            </div>
          </div>

          <div className="space-y-6 mb-8 flex-1">
            <h3 className="font-semibold text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Select Rental Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-input bg-background cursor-pointer hover:border-primary transition-colors">
                <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Pick up</div>
                <div className="font-medium">Select date</div>
              </div>
              <div className="p-4 rounded-xl border border-input bg-background cursor-pointer hover:border-primary transition-colors">
                <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Return</div>
                <div className="font-medium">Select date</div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-accent/50 flex gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                Your deposit is fully refundable upon return of the item in its original condition. 
                Damage protection is available at checkout.
              </p>
            </div>
          </div>

          <button className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
}
