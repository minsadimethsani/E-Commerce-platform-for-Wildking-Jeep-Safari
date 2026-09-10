'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onSearch?: (filter: { park: string; date: string; timeSlot: string; guests: number }) => void;
  onOpenBookingWithDetails?: (details: {
    packageName: string;
    startDate: string;
    duration: string;
    guests: number;
    totalPrice: number;
  }) => void;
  onOpenBooking?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative min-h-screen w-full pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-center items-center overflow-hidden bg-[#050b14] text-white">
      {/* Dynamic White Thin Rounded Corner Border Frame for Hero Section */}
      <div 
        className="pointer-events-none absolute inset-2 sm:inset-4 z-20 rounded-2xl sm:rounded-3xl overflow-hidden animate-dynamic-white-border"
        aria-hidden="true"
      >
        <svg className="w-full h-full">
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="16"
            ry="16"
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="1.5"
            pathLength="100"
            className="animate-white-border-circuit"
          />
        </svg>
      </div>

      {/* Hero Background Video Reel */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
        >
          <source src="/videos/hero-safari-reel.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlays for High Video Visibility & Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050b14]/90 via-[#050b14]/65 to-[#050b14]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-[#050b14]/60 opacity-90" />

        {/* Vintage Topographic Map Texture Overlay */}
        <div className="absolute inset-0 bg-topo-pattern opacity-20 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
        <div className="space-y-6 sm:space-y-8 flex flex-col items-start max-w-4xl">

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-serif uppercase tracking-tight text-white leading-[1.1] drop-shadow-2xl animate-slide-up-heading">
              <span className="whitespace-nowrap">Conquer the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">Wild</span></span><br />on four wheels
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl drop-shadow-md animate-slide-up-description">
              Discover breathtaking landscapes and encounter untamed wildlife with verified local safari drivers
            </p>
          </div>

          {/* Hero CTA Action Button */}
          <div className="pt-2 animate-slide-up-cta">
            <a
              href="/tours"
              className="btn-golden-glow inline-flex items-center justify-center gap-2.5 px-9 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-950 rounded-full transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </a>
          </div>
        </div>
      </div>

    </section>
  );
};
