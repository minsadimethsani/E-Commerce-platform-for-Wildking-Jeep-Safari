'use client';

import React from 'react';
import { PARK_DESTINATIONS, ParkDestination } from '../data/packages';
import { MapPin, Calendar, Compass, ArrowUpRight, Sparkles } from 'lucide-react';

interface DestinationsProps {
  onSelectPark: (parkId: string) => void;
}

export const Destinations: React.FC<DestinationsProps> = ({ onSelectPark }) => {
  return (
    <section id="destinations" className="py-16 lg:py-24 bg-[#050b14] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white uppercase tracking-tight">
            Explore <span className="text-amber-400">National Parks</span>
          </h2>
        </div>

        {/* Destinations Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARK_DESTINATIONS.map((park) => (
            <div
              key={park.id}
              onClick={() => onSelectPark(park.id)}
              className="group relative bg-[#09121f] border border-emerald-900/60 rounded-none overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Background Image */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <img
                  src={park.image}
                  alt={park.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09121f] via-[#09121f]/40 to-transparent" />

                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-wider shadow">
                  {park.distanceFromColombo}
                </span>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 text-amber-400 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3 flex-grow">
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
                  {park.name}
                </h3>
                <p className="text-xs text-slate-300 font-light line-clamp-2">
                  {park.tagline}
                </p>

                {/* Primary Species Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {park.primarySpecies.slice(0, 3).map((sp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-none bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-medium text-emerald-200 inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{sp}</span>
                    </span>
                  ))}
                </div>

                {/* Best Season */}
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 pt-2 border-t border-emerald-900/60 mt-3">
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
