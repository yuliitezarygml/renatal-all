"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User, Calendar, MapPin, Loader2, Package, Star, Settings } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rentals" | "settings">("rentals");
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setAvatar(data.avatar || "");
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, phone, avatar })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        const mergedUser = { ...user, ...updatedUser };
        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
        window.dispatchEvent(new Event("user-updated"));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', e.target.files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      if (data.photoUrls && data.photoUrls.length > 0) {
        const newAvatar = data.photoUrls[0];
        setAvatar(newAvatar);
        
        // Auto-save the new avatar
        const token = localStorage.getItem("token");
        await fetch("/api/auth/me", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ name, phone, avatar: newAvatar })
        });
        
        const updatedUser = { ...user, avatar: newAvatar };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-updated"));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <label className="relative block w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 cursor-pointer overflow-hidden group border-2 border-transparent hover:border-primary transition-all">
              {avatar ? (
                <Image 
                  src={avatar.startsWith('http') ? avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${avatar}`} 
                  alt="Avatar" 
                  fill 
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <User className="w-10 h-10" />
              )}
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-medium backdrop-blur-sm transition-all">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
            </label>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.phone && <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>}
            
            <div className="w-full mt-6 flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("rentals")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "rentals" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Package className="w-4 h-4" />
                My Rentals
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "settings" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 py-2 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "rentals" && (
            <>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Rentals</h1>
                <p className="text-muted-foreground mt-1">View and manage your active and past rentals.</p>
              </div>

              {user.rentals && user.rentals.length > 0 ? (
                <div className="space-y-4">
                  {user.rentals.map((rental: any) => (
                    <div key={rental.id} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                      <div className="relative w-full sm:w-32 h-32 rounded-lg bg-muted overflow-hidden shrink-0">
                        <Image 
                          src={(rental.item.photoUrls && rental.item.photoUrls.length > 0) ? (rental.item.photoUrls[0].startsWith('http') ? rental.item.photoUrls[0] : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${rental.item.photoUrls[0]}`) : "https://images.unsplash.com/photo-1504280650214-41d1e4eb41ce?q=80&w=2000&auto=format&fit=crop"} 
                          alt={rental.item.name} 
                          fill 
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            <Link href={`/items/${rental.item.id}`} className="hover:text-primary transition-colors">
                              {rental.item.name}
                            </Link>
                          </h3>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            rental.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                            rental.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                            rental.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {rental.status}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>{new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Package className="w-4 h-4 shrink-0" />
                            <span>{rental.deliveryType}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate">{rental.deliveryAddress || "Pickup at store"}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 flex justify-between items-center border-t border-border/40">
                          <span className="font-bold text-lg">${rental.totalPrice}</span>
                          {rental.status === 'COMPLETED' && (
                            <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              Leave a Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/20 border border-border/50 border-dashed rounded-xl">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No rentals yet</h3>
                  <p className="text-muted-foreground mt-1 mb-6">You haven&apos;t rented any equipment yet.</p>
                  <Link href="/catalog" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Browse Catalog
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === "settings" && (
            <>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground mt-1">Update your personal information.</p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={user.email} 
                      disabled
                      className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="mt-6 flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
