"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

type Review = {
  id: number;
  user: { name: string } | string;
  item: { name: string } | string;
  rating: number;
  comment: string;
  createdAt?: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchApi<Review[]>("/reviews");
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-slate-500 mt-1">Read and moderate feedback from users.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => {
            const userName = typeof review.user === 'object' ? review.user.name : review.user || 'Unknown';
            const itemName = typeof review.item === 'object' ? review.item.name : review.item || 'Unknown Item';
            const dateStr = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '';

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6"
              >
                <div className="sm:w-1/4 shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 uppercase">
                      {userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{userName}</p>
                      <p className="text-xs text-slate-500">{dateStr}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-brand-600 truncate">
                    {itemName}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-slate-700">"{review.comment}"</p>
                </div>

                <div className="sm:w-32 shrink-0 flex sm:flex-col justify-end sm:justify-start gap-2">
                  <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MessageSquare className="h-4 w-4" /> Reply
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
