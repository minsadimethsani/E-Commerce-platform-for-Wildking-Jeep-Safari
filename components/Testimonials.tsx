'use client';

import React from 'react';
import { REVIEWS } from '../data/packages';
import { Star, Quote, Award, Camera } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060e0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              <Award className="w-3.5 h-3.5" />
              Verified Guest Experiences
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif">
              Real Safari Sightings & Stories
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 font-light max-w-xl">
              Over 1,500+ five-star reviews from international travelers, wildlife photographers, and families.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0d1b13] p-4 rounded-2xl border border-emerald-800/50">
            <div className="text-center border-r border-emerald-800/50 pr-4">
              <div className="text-3xl font-extrabold text-amber-400 font-sans">4.98</div>
              <div className="flex text-amber-400 my-0.5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Overall Rating</div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">TripAdvisor Traveler's Choice</div>
              <div className="text-xs text-emerald-300">Certified Top 1% Worldwide</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0b1711] border border-emerald-900/60 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-emerald-800" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed italic mb-6 font-light">
                  "{rev.comment}"
                </p>

                {/* Sighting Photo Tag if present */}
                {rev.sightingPhoto && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-emerald-800/40 relative group h-40">
                    <img
                      src={rev.sightingPhoto}
                      alt={rev.sightingTag || 'Safari Sighting'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{rev.sightingTag}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewer Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-emerald-900/50">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">{rev.name}</div>
                  <div className="text-[11px] text-zinc-400">
                    {rev.location} • <span className="text-emerald-400 font-medium">{rev.packageBooked}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
