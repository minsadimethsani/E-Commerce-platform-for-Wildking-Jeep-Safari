'use client';

import React from 'react';
import { PARK_DESTINATIONS, ParkDestination } from '../data/packages';
import { MapPin, Calendar, Compass, ArrowUpRight } from 'lucide-react';

interface DestinationsProps {
  onSelectPark: (parkId: string) => void;
}

export const Destinations: React.FC<DestinationsProps> = ({ onSelectPark }) => {
  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#08130d] relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/50 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">
              <Compass className="w-3.5 h-3.5" />
              Sri Lanka Wildlife Sanctuaries
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif">
              Explore National Parks
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 font-light max-w-xl">
              From the coastal thorn forests of Yala to the pristine ancient lakes of Wilpattu, discover Sri Lanka’s biodiverse sanctuaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {PARK_DESTINATIONS.map((park) => (
            <div
              key={park.id}
              onClick={() => onSelectPark(park.id)}
              className="group relative rounded-none overflow-hidden bg-[#0c1811] border border-emerald-900/50 hover:border-amber-500/50 transition-all duration-500 cursor-pointer shadow-2xl h-[420px] flex flex-col justify-end p-5 sm:p-6"
            >
              {/* Background Image */}
              <img
                src={park.image}
                alt={park.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110a] via-[#06110a]/70 to-transparent" />

              {/* Top Distance Pill */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-none bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-amber-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-[120px]">{park.distanceFromColombo}</span>
              </div>

              {/* Top Action Arrow */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-none bg-amber-400/90 text-emerald-950 flex items-center justify-center group-hover:bg-amber-300 group-hover:scale-110 transition-all shadow-lg">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>

              {/* Park Info Content */}
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block line-clamp-1">
                  {park.keyFact}
                </span>
                <h3 className="text-xl font-bold text-white font-serif group-hover:text-amber-300 transition-colors line-clamp-1">
                  {park.name}
                </h3>
                <p className="text-xs text-zinc-300 font-light line-clamp-2">
                  {park.tagline}
                </p>

                {/* Primary Species Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {park.primarySpecies.slice(0, 3).map((sp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-none bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-medium text-emerald-200"
                    >
                      🐾 {sp}
                    </span>
                  ))}
                </div>

                {/* Best Season */}
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 pt-2 border-t border-emerald-900/60">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{park.bestSeason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
