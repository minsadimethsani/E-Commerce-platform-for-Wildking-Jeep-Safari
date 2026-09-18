"use client";

import React, { useState } from "react";
import { InquiryDoc, ReviewDoc } from "@/lib/types/firestore";
import InquiriesManager from "./InquiriesManager";
import ReviewsManager from "./ReviewsManager";
import { MessageSquare, Star, Sparkles, Filter } from "lucide-react";

interface InquiriesReviewsManagerProps {
  inquiries: InquiryDoc[];
  reviews: ReviewDoc[];
  onUpdateStatus: (inquiryId: string, status: InquiryDoc["status"]) => Promise<void>;
  initialSubTab?: "inquiries" | "reviews";
}

export default function InquiriesReviewsManager({
  inquiries,
  reviews,
  onUpdateStatus,
  initialSubTab = "inquiries",
}: InquiriesReviewsManagerProps) {
  const [subTab, setSubTab] = useState<"inquiries" | "reviews">(initialSubTab);

  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card with Integrated Section Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>GUEST COMMUNICATIONS & TESTIMONIALS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
            Inquiries & Customer Reviews
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Manage incoming safari booking inquiries, custom itinerary requests, and verified guest reviews.
          </p>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setSubTab("inquiries")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "inquiries"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Guest Inquiries</span>
            {newInquiriesCount > 0 && (
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                subTab === "inquiries" ? "bg-slate-950 text-amber-400" : "bg-amber-500 text-slate-950"
              }`}>
                {newInquiriesCount} New
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab("reviews")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "reviews"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === "inquiries" ? (
        <InquiriesManager inquiries={inquiries} onUpdateStatus={onUpdateStatus} />
      ) : (
        <ReviewsManager reviews={reviews} />
      )}
    </div>
  );
}
