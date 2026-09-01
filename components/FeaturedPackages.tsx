'use client';

import React, { useState } from 'react';
import { SAFARI_PACKAGES, SafariPackage } from '../data/packages';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';

interface FeaturedPackagesProps {
  currency: 'USD' | 'EUR' | 'LKR';
  onSelectPackage: (pkg: SafariPackage) => void;
  activeFilterPark?: string;
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  currency,
  onSelectPackage,
  activeFilterPark = 'all',
}) => {
  const [selectedParkTab, setSelectedParkTab] = useState<string>(activeFilterPark);

  const filteredPackages = SAFARI_PACKAGES.filter((pkg) => {
    if (selectedParkTab === 'all') return true;
    return pkg.park === selectedParkTab;
  });

  const formatPrice = (pkg: SafariPackage) => {
    if (currency === 'EUR') return `€${pkg.priceEur}`;
    if (currency === 'LKR') return `Rs. ${pkg.priceLkr.toLocaleString()}`;
    return `$${pkg.priceUsd}`;
  };

  return (
    <section id="safaris" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070e0a] relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
              Featured Safari Packages
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl font-light">
              Choose from private dawn patrols, full-day deep wilderness expeditions, and elephant sanctuary tours.
            </p>
          </div>

          {/* Park Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0d1c14] p-1.5 rounded-xl border border-emerald-800/40">
            <button
              onClick={() => setSelectedParkTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${selectedParkTab === 'all'
                  ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-emerald-900/40'
                }`}
            >
              All Parks
            </button>
            <button
              onClick={() => setSelectedParkTab('yala')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${selectedParkTab === 'yala'
                  ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-emerald-900/40'
                }`}
            >
              Yala
            </button>
            <button
              onClick={() => setSelectedParkTab('udawalawe')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${selectedParkTab === 'udawalawe'
                  ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-emerald-900/40'
                }`}
            >
              Udawalawe
            </button>
            <button
              onClick={() => setSelectedParkTab('wilpattu')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${selectedParkTab === 'wilpattu'
                  ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-emerald-900/40'
                }`}
            >
              Wilpattu
            </button>
            <button
              onClick={() => setSelectedParkTab('minneriya')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${selectedParkTab === 'minneriya'
                  ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-emerald-900/40'
                }`}
            >
              Minneriya
            </button>
          </div>
        </div>

        {/* Packages Cards Grid - 4 Column Layout with Square Corners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-[#0b1711] border border-emerald-900/50 rounded-none overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Image & Badge Overlay */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1711] via-transparent to-black/40" />

                {/* Top Badge */}
                {pkg.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-none bg-amber-400 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                {/* Sightings Guarantee Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-none bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md text-amber-300 text-[10px] font-semibold">
                  {pkg.sightingsRate}
                </div>

                {/* Duration & Park Pill */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-200">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-none border border-white/10 truncate max-w-[55%]">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{pkg.parkName}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-none border border-white/10 shrink-0">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating & Review Count */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="ml-1 text-xs font-bold text-white">{pkg.rating}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">({pkg.reviewsCount})</span>
                  </div>

                  {/* Title - Clickable to Single Safari Detail Page */}
                  <a
                    href={`/safari?id=${pkg.id}`}
                    className="block text-base font-bold text-white font-serif mb-2 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug"
                  >
                    {pkg.title}
                  </a>
                </div>

                {/* Card Footer: Price & Booking Action */}
                <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">
                      From
                    </span>
                    <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-sans">
                      {formatPrice(pkg)}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-[11px] uppercase tracking-wider rounded-none flex items-center gap-1 shadow-md shadow-amber-500/20 hover:scale-105 transition-all shrink-0"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
