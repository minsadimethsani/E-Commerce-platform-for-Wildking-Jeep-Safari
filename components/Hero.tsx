'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Clock,
  Sparkles,
  MapPin,
  ShieldCheck,
  Compass,
  Star,
  ChevronRight,
  Sun,
  Sunset,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface HeroProps {
  onSearch?: (filter: { park: string; date: string; timeSlot: string; guests: number }) => void;
  onOpenBookingWithDetails?: (details: {
    packageName: string;
    startDate: string;
    duration: string;
    guests: number;
    totalPrice: number;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenBookingWithDetails }) => {
  // Current date baseline: Aug 20, 2026
  const currentDateStr = '2026-08-20';

  // Interactive state inside booking card
  const [selectedTour, setSelectedTour] = useState<'Sunset Safari' | 'Dawn Game Drive' | 'Full Day Overland'>('Sunset Safari');
  const [safariStartDate, setSafariStartDate] = useState(currentDateStr);
  const [durationNights, setDurationNights] = useState<number>(2); // Default 2 Nights
  const [guestCount, setGuestCount] = useState<number>(2); // Default 2 people (2-4 limit)
  const [selectedPark, setSelectedPark] = useState('Yala National Park');
  const [guestLimitWarning, setGuestLimitWarning] = useState<string | null>(null);

  // Pricing calculation base: $1,250 / person for Sunset Safari
  const basePricePerPerson = selectedTour === 'Sunset Safari' ? 1250 : selectedTour === 'Dawn Game Drive' ? 980 : 1850;
  const totalPrice = basePricePerPerson * guestCount;

  const formatDateDisplay = (dateString: string) => {
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return `${months[m] || 'Aug'} ${d}`;
      }
      return 'Aug 20';
    } catch {
      return 'Aug 20';
    }
  };

  const getEndDateStr = (startDateString: string, nights: number) => {
    try {
      const parts = startDateString.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        d.setDate(d.getDate() + nights);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
      }
      return 'Aug 22';
    } catch {
      return 'Aug 22';
    }
  };

  const handleGuestChange = (delta: number) => {
    const newCount = guestCount + delta;
    if (newCount < 2) {
      setGuestLimitWarning('Minimum 2 guests required for private 4x4 expedition.');
      setTimeout(() => setGuestLimitWarning(null), 3500);
      return;
    }
    if (newCount > 4) {
      setGuestLimitWarning('Maximum 4 guests limit per luxury safari jeep for optimal viewing.');
      setTimeout(() => setGuestLimitWarning(null), 3500);
      return;
    }
    setGuestLimitWarning(null);
    setGuestCount(newCount);
  };

  const handleBookSafariClick = () => {
    if (onOpenBookingWithDetails) {
      onOpenBookingWithDetails({
        packageName: selectedTour,
        startDate: safariStartDate,
        duration: `${durationNights} Nights`,
        guests: guestCount,
        totalPrice
      });
    } else if (onSearch) {
      onSearch({
        park: selectedPark,
        date: safariStartDate,
        timeSlot: 'Sunset Golden Hour',
        guests: guestCount
      });
    }
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center justify-center bg-[#050b14] text-white">

      {/* 1. Background Image: Dramatic Scene of Luxury Off-Road Jeep on Elevated Viewpoint at Sunset */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/hero-sunset-jeep.jpg"
          alt="Luxury Off-Road Jeep at Sunset viewpoint over Savanna"
          className="w-full h-full object-cover object-center transform scale-105 animate-pulse-slow filter brightness-90 contrast-105"
        />

        {/* Color Palette Gradient Overlays: Deep Earth Tones, Golden Sunset Warm Oranges, Deep Blue Dusk */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050b14]/95 via-[#050b14]/80 to-[#050b14]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-amber-950/20 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/90 via-transparent to-[#050b14]" />

        {/* 2. Vintage Topographic Map Texture Overlay */}
        <div className="absolute inset-0 bg-topo-pattern opacity-40 pointer-events-none mix-blend-overlay" />

        {/* 3. Subtle Wildlife Iconography & Watermarks (Elephant Head & Roaring Lion Motif) */}
        <div className="absolute top-1/4 left-10 opacity-10 pointer-events-none select-none hidden lg:block">
          {/* Subtle Elephant Head Motif */}
          <svg width="340" height="340" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 20 C60 20, 20 50, 20 90 C20 120, 40 140, 55 160 C65 175, 70 190, 75 195 C78 198, 85 198, 88 195 C92 190, 95 170, 100 170 C105 170, 108 190, 112 195 C115 198, 122 198, 125 195 C130 190, 135 175, 145 160 C160 140, 180 120, 180 90 C180 50, 140 20, 100 20 Z"
              stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,6"
            />
            <circle cx="70" cy="75" r="4" fill="#f59e0b" />
            <circle cx="130" cy="75" r="4" fill="#f59e0b" />
            <path d="M40 90 C 20 110, 10 135, 35 145 C 50 150, 65 130, 60 110" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M160 90 C 180 110, 190 135, 165 145 C 150 150, 135 130, 140 110" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="absolute bottom-12 right-1/3 opacity-10 pointer-events-none select-none hidden lg:block">
          {/* Subtle Roaring Lion Motif */}
          <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 30 C70 30, 45 55, 45 85 C45 110, 60 130, 80 140 C85 155, 80 175, 75 185 C90 180, 100 165, 105 150 C110 165, 120 180, 135 185 C130 175, 125 155, 130 140 C150 130, 165 110, 165 85 C165 55, 140 30, 100 30 Z"
              stroke="#ea580c" strokeWidth="1.5"
            />
            <path d="M70 70 L90 85 L70 95 Z" fill="#ea580c" opacity="0.5" />
            <path d="M130 70 L110 85 L130 95 Z" fill="#ea580c" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Main Two-Column Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* FAR LEFT COLUMN: Hero Narrative, Headline, Badges, Trust Metrics */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left pr-0 lg:pr-4">

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif uppercase tracking-tight text-white leading-[1.1] drop-shadow-2xl">
                UNTAMED <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">SAVANNA</span> IN CUSTOM 4x4 LUXURY
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl drop-shadow-md">
                Elevate your wilderness journey atop panoramic savanna viewpoints. Traverse private wildlife corridors with certified master naturalists in custom-modified, whisper-quiet Land Cruisers.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sunset className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Sunset Vantage</h4>
                  <p className="text-[11px] text-slate-400">Golden Hour Sightings</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">4x4 Fleet</h4>
                  <p className="text-[11px] text-slate-400">Stadium Elevated Seats</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Private Guide</h4>
                  <p className="text-[11px] text-slate-400">100% Sightings Track</p>
                </div>
              </div>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-amber-500/40 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Explorer guest" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-amber-500/40 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Explorer guest" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-amber-500/40 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Explorer guest" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                    <span className="font-extrabold text-white ml-1">4.98 / 5</span>
                  </div>
                  <span className="text-[11px] text-slate-400">1,240+ Verified Expedition Guests</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Yala, Udawalawe & Wilpattu Corridors</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE COLUMN: Hero Card arranged exactly like reference image (Minimized size & Square corners) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[320px] sm:max-w-[340px] rounded-none p-4 sm:p-5 backdrop-blur-xl bg-[#141210]/85 border border-white/10 shadow-2xl space-y-3">
              
              {/* Card Top Header: Title & Bison/Compass Icon Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-white leading-snug tracking-tight font-sans">
                    Savanna<br />Sunset Safari
                  </h3>
                </div>
                
                {/* Top-Right Circular Badge Icon */}
                <button
                  type="button"
                  onClick={() => {
                    const tours: ('Sunset Safari' | 'Dawn Game Drive' | 'Full Day Overland')[] = ['Sunset Safari', 'Dawn Game Drive', 'Full Day Overland'];
                    const nextIdx = (tours.indexOf(selectedTour) + 1) % tours.length;
                    setSelectedTour(tours[nextIdx]);
                  }}
                  className="w-7 h-7 rounded-none bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Switch Safari Experience"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-200" />
                </button>
              </div>

              {/* Date Selectors Row: Aug 20 | Aug 22 */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {/* Start Date Dropdown Pill */}
                <div className="relative flex items-center justify-between px-2.5 py-1.5 rounded-none bg-black/40 border border-white/5 text-white group cursor-pointer hover:bg-black/60 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-white">{formatDateDisplay(safariStartDate)}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-stone-400 rotate-90" />
                  <input
                    type="date"
                    value={safariStartDate}
                    min={currentDateStr}
                    onChange={(e) => setSafariStartDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>

                {/* End Date Dropdown Pill */}
                <div 
                  onClick={() => setDurationNights(durationNights === 2 ? 3 : durationNights === 3 ? 5 : 2)}
                  className="relative flex items-center justify-between px-2.5 py-1.5 rounded-none bg-black/40 border border-white/5 text-white cursor-pointer hover:bg-black/60 transition-colors"
                  title="Click to toggle stay duration"
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-white">{getEndDateStr(safariStartDate, durationNights)}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-stone-400 rotate-90" />
                </div>
              </div>

              {/* Safari Start & Duration Combined Box */}
              <div className="grid grid-cols-2 p-2.5 rounded-none bg-black/40 border border-white/5 divide-x divide-stone-800">
                <div className="pr-2">
                  <div className="text-[10px] text-stone-400 font-normal">Safari Start</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{formatDateDisplay(safariStartDate)}</div>
                </div>
                <div className="pl-2">
                  <div className="text-[10px] text-stone-400 font-normal">Duration</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{durationNights} Nights</div>
                </div>
              </div>

              {/* Price & People Capacity Row */}
              <div className="flex items-baseline justify-between pt-0.5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl sm:text-2xl font-medium text-white">${basePricePerPerson.toLocaleString()}</span>
                  <span className="text-xs text-stone-400 font-normal">/person</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleGuestChange(guestCount >= 4 ? -2 : 1)}
                  className="text-xs text-stone-300 font-normal hover:text-white transition-colors cursor-pointer"
                  title="Click to adjust guest group size"
                >
                  2-4 people
                </button>
              </div>

              {/* Action Button: Book Safari */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={handleBookSafariClick}
                  className="w-full py-2.5 px-3 rounded-none bg-white hover:bg-stone-100 text-black font-semibold text-xs transition-colors shadow-lg text-center cursor-pointer"
                >
                  Book Safari
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};


