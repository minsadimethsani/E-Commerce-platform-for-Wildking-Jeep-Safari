'use client';

import React, { useState, useEffect } from 'react';
import { REVIEWS, ReviewItem } from '../data/packages';
import { getReviewsFromFirestore } from '../lib/firestore-service';
import { ReviewDoc } from '../lib/types/firestore';
import { Star, Quote, Award, Camera, ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=800&q=80';
const TIMER_INTERVAL = 5000; // 5 seconds constant time slide change

export const Testimonials: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<(ReviewItem | ReviewDoc)[]>(REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const firestoreRevs = await getReviewsFromFirestore();
        if (firestoreRevs && firestoreRevs.length > 0) {
          setReviewsList(firestoreRevs);
        }
      } catch (err) {
        console.error("Error fetching reviews for Testimonials component:", err);
      }
    };
    fetchReviews();
  }, []);

  // Automatic constant-time slideshow timer (5 seconds)
  useEffect(() => {
    if (isHovered || reviewsList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
    }, TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered, reviewsList.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const currentReview = reviewsList[currentIndex] || REVIEWS[0];

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050b14] relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Guest Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif uppercase tracking-tight">
              Real Safari Sightings & Stories
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 font-light max-w-xl">
              Over 1,500+ five-star reviews from international travelers, wildlife photographers, and safari enthusiasts.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#08101d] p-4 rounded-2xl border border-emerald-800/40 shrink-0">
            <div className="text-center border-r border-emerald-800/50 pr-4">
              <div className="text-3xl font-black text-amber-400 font-sans">4.98</div>
              <div className="flex text-amber-400 my-0.5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Overall Rating</div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">TripAdvisor Traveler's Choice</div>
              <div className="text-xs text-emerald-300 font-semibold">Certified Top 1% Worldwide</div>
            </div>
          </div>
        </div>

        {/* Slideshow Container (Auto-play with constant interval timer) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-[#08101d] border border-emerald-800/40 rounded-none overflow-hidden shadow-2xl transition-all duration-500 group"
        >
          {/* Animated Constant-Time Progress Bar at Top */}
          <div className="w-full bg-slate-900 h-1 relative overflow-hidden">
            <div
              key={currentIndex}
              className={`h-full bg-gradient-to-r from-amber-500 to-amber-300 ${
                isHovered ? 'animate-none' : ''
              }`}
              style={{
                animation: isHovered ? 'none' : `progressAnimation ${TIMER_INTERVAL}ms linear infinite`,
              }}
            />
          </div>

          {/* Slide Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center min-h-[420px]">
            {/* Left Column: Sighting Photo Showcase */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 w-full overflow-hidden border border-emerald-800/50 bg-slate-950 group/photo">
              <img
                key={currentReview.id + '-photo'}
                src={currentReview.sightingPhoto || FALLBACK_PHOTO}
                alt={currentReview.sightingTag || 'Safari Sighting'}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = FALLBACK_PHOTO;
                }}
                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {currentReview.sightingTag && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-amber-300 bg-black/70 backdrop-blur-md px-3.5 py-2 border border-white/10">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>{currentReview.sightingTag}</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/80 px-2 py-0.5 border border-emerald-800">
                    Verified Encounter
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Review Quote & Profile */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Header Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(currentReview.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                    <span className="ml-2 text-xs font-bold text-white uppercase tracking-wider">
                      {currentReview.rating || 5}.0 Verified Review
                    </span>
                  </div>

                  <Quote className="w-8 h-8 text-amber-500/30" />
                </div>

                {/* Main Quote Text */}
                <blockquote className="text-base sm:text-xl font-light text-slate-200 leading-relaxed italic font-serif">
                  "{currentReview.comment}"
                </blockquote>
              </div>

              {/* Reviewer Profile & Package Info */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={currentReview.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentReview.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white font-serif">{currentReview.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{currentReview.location}</span>
                      {currentReview.date && <span>• {currentReview.date}</span>}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300 self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentReview.packageBooked}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slideshow Control Bar (Arrows & Pagination Dots) */}
          <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-4">
            {/* Slide Count Indicator */}
            <div className="text-xs text-slate-400 font-bold tracking-wider">
              Story <span className="text-amber-400">{currentIndex + 1}</span> of {reviewsList.length}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {reviewsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-amber-400'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Manual Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Story"
                className="w-9 h-9 border border-amber-500/40 text-amber-400 bg-[#08101d] hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Story"
                className="w-9 h-9 border border-amber-500/40 text-amber-400 bg-[#08101d] hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Animation Keyframes CSS */}
      <style jsx>{`
        @keyframes progressAnimation {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
