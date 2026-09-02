'use client';

import React from 'react';
import { PARK_DESTINATIONS } from '../data/packages';

interface DestinationsProps {
  onSelectPark: (parkId: string) => void;
}

export const Destinations: React.FC<DestinationsProps> = ({ onSelectPark }) => {
  return (
    <section id="destinations" className="py-16 lg:py-24 bg-[#050b14] text-white font-sans">
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
              className="group relative bg-[#09121f] border border-emerald-900/60 rounded-none overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
            >
              {/* Background Image & Park Name */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
                <img
                  src={park.image}
                  alt={park.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09121f] via-black/40 to-transparent" />

                {/* Only Keep Park Name */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
                    {park.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
