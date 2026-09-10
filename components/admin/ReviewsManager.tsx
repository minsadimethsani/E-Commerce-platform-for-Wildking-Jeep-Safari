"use client";

import React from "react";
import { ReviewDoc } from "@/lib/types/firestore";
import { useToast } from "@/context/ToastContext";
import { Star, Sparkles } from "lucide-react";

interface ReviewsManagerProps {
  reviews: ReviewDoc[];
}

export default function ReviewsManager({ reviews }: ReviewsManagerProps) {
  const { showSuccess } = useToast();

  const handleFeatureReview = (guestName: string) => {
    showSuccess("Review Featured", `Guest testimonial by ${guestName} pinned to home page.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Customer Reviews & Sighting Testimonials
          </h2>
          <p className="text-xs text-slate-400 mt-1">Guest feedback, wildlife encounter stories, and verified ratings.</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm">{rev.name}</h3>
                    <p className="text-[10px] text-emerald-300 font-semibold">{rev.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                </div>
              </div>

              {rev.packageBooked && (
                <span className="inline-block mb-2 text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  Booked: {rev.packageBooked}
                </span>
              )}

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                <p className="italic">"{rev.comment}"</p>
              </div>

              {rev.sightingTag && (
                <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verified Sighting: {rev.sightingTag}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">Approved & Published</span>
              <button
                onClick={() => handleFeatureReview(rev.name)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold transition-colors cursor-pointer"
              >
                Feature on Homepage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
