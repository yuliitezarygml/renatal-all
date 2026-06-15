"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft, Star, Calendar, ShieldCheck, Check, X } from "lucide-react";

export default function ItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRenting, setIsRenting] = useState(false);

  const handleRentNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);

    setIsRenting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * item.pricePerDay;

    try {
      const res = await fetch(`${apiUrl}/rentals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          itemId: item.id,
          startDate,
          endDate,
          totalPrice
        })
      });

      if (res.ok) {
        alert("Rental requested successfully!");
        router.push("/profile");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create rental");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsRenting(false);
    }
  };

  useEffect(() => {
    async function fetchItem() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      try {
        const res = await fetch(`${apiUrl}/items/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          // Ensure all links in description have target="_blank" and fix missing http://
          if (data.description) {
            data.description = data.description.replace(/href="([^"]+)"/g, (match: string, p1: string) => {
              if (!p1.startsWith('http://') && !p1.startsWith('https://') && !p1.startsWith('mailto:')) {
                p1 = 'https://' + p1;
              }
              return `href="${p1}" target="_blank" rel="noopener noreferrer"`;
            });
          }
          setItem(data);
        }
      } catch (error) {
        console.error("Failed to fetch item:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [params.id]);

  if (!loading && !item) {
    notFound();
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const getImageUrl = (url: string) => {
    return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${url}`;
  };

  const currentImage = (item.photoUrls && item.photoUrls.length > 0) 
    ? getImageUrl(item.photoUrls[selectedPhotoIndex])
    : "https://images.unsplash.com/photo-1504280650214-41d1e4eb41ce?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 relative">
      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video px-4 flex items-center justify-center">
            {item.photoUrls && item.photoUrls.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : item.photoUrls!.length - 1));
                }}
                className="absolute left-4 md:left-10 text-white hover:scale-110 transition-transform p-3 rounded-full bg-white/10 hover:bg-white/20"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            
            <div className="relative w-full h-[70vh]">
              <Image 
                src={currentImage}
                alt={item.name}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            {item.photoUrls && item.photoUrls.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev < item.photoUrls!.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 md:right-10 text-white hover:scale-110 transition-transform p-3 rounded-full bg-white/10 hover:bg-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-8 h-8"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            )}
          </div>

          {/* Thumbnails in Lightbox */}
          {item.photoUrls && item.photoUrls.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 px-4 overflow-x-auto">
              {item.photoUrls.map((url: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all ${selectedPhotoIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                >
                  <Image 
                    src={getImageUrl(url)}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Link href="/catalog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative aspect-square md:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-muted group cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image 
              src={currentImage} 
              alt={item.name} 
              fill 
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Carousel Arrows */}
            {item.photoUrls && item.photoUrls.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : item.photoUrls!.length - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur shadow-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev < item.photoUrls!.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur shadow-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </>
            )}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-background/90 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-wider">
                {typeof item.category === 'object' ? item.category?.name : item.category || 'Gear'}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to expand
            </div>
          </div>
          
          {/* Thumbnails */}
          {item.photoUrls && item.photoUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {item.photoUrls.map((url: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all ${selectedPhotoIndex === idx ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                >
                  <Image 
                    src={getImageUrl(url)}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{item.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-semibold">{item.averageRating ? item.averageRating.toFixed(1) : "New"}</span>
              <span className="text-muted-foreground ml-1">({item.reviewCount || 0} reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="text-green-600 font-medium flex items-center">
              <Check className="w-4 h-4 mr-1" /> Available Now
            </div>
          </div>

          <div 
            className="prose prose-slate max-w-none text-lg text-muted-foreground leading-relaxed mb-8 prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline-offset-4"
            dangerouslySetInnerHTML={{ __html: item.description }} 
          />

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
              <div className="p-4 rounded-xl border border-input bg-background hover:border-primary transition-colors flex flex-col justify-center">
                <label className="text-xs text-muted-foreground uppercase font-semibold mb-1 block">Pick up</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="font-medium bg-transparent border-none outline-none focus:ring-0 w-full text-foreground cursor-pointer" 
                />
              </div>
              <div className="p-4 rounded-xl border border-input bg-background hover:border-primary transition-colors flex flex-col justify-center">
                <label className="text-xs text-muted-foreground uppercase font-semibold mb-1 block">Return</label>
                <input 
                  type="date" 
                  min={startDate || new Date().toISOString().split("T")[0]}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="font-medium bg-transparent border-none outline-none focus:ring-0 w-full text-foreground cursor-pointer" 
                />
              </div>
            </div>
            
            {startDate && endDate && (
              <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">Total for {Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))} days</div>
                  <div className="text-xs text-muted-foreground">Excludes ${item.deposit} refundable deposit</div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))) * item.pricePerDay}
                </div>
              </div>
            )}
            
            <div className="p-4 rounded-xl bg-accent/50 flex gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                Your deposit is fully refundable upon return of the item in its original condition. 
                Damage protection is available at checkout.
              </p>
            </div>
          </div>

          <button 
            onClick={handleRentNow}
            disabled={isRenting || !startDate || !endDate}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRenting ? "Processing..." : "Rent Now"}
          </button>

        </div>
      </div>
    </div>
  );
}
