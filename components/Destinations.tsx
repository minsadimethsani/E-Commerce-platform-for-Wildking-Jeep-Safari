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
          <h2 className="text-3xl sm:text-5xl font-black font-serif text-white uppercase tracking-tight">
            Explore <span className="text-amber-400">National Parks</span>
          </h2>
        </div>

        {/* Destinations Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARK_DESTINATIONS.map((park) => (
            <div
              key={park.id}
              onClick={() => onSelectPark(park.id)}
              className="group cursor-pointer flex flex-col bg-transparent border-0 rounded-none shadow-none transition-all duration-300"
            >
              {/* Clean Image Container with rounded-2xl & overflow-hidden */}
              <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={park.image}
                  alt={park.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out filter brightness-[0.95] contrast-[1.02]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl" />
              </div>

              {/* Park Name ONLY directly underneath the image */}
              <div className="pt-3.5">
                <h3 className="text-base sm:text-lg font-black text-white font-serif uppercase tracking-wider group-hover:text-amber-400 transition-colors leading-snug">
                  {park.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

