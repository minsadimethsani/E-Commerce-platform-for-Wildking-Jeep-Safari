'use client';

import React, { useState, useEffect } from 'react';
import { SAFARI_PACKAGES, SafariPackage } from '../data/packages';
import { getPackagesFromFirestore } from '../lib/firestore-service';
import { SafariPackageDoc } from '../lib/types/firestore';
import { Clock, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface FeaturedPackagesProps {
  currency?: string;
  onSelectPackage: (pkg: SafariPackage) => void;
  activeFilterPark?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80';

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  onSelectPackage,
  activeFilterPark = 'all',
}) => {
  const { formatPrice } = useCurrency();
  const [selectedParkTab, setSelectedParkTab] = useState<string>(activeFilterPark);
  const [allPackages, setAllPackages] = useState<SafariPackageDoc[]>(SAFARI_PACKAGES as SafariPackageDoc[]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const firestorePkgs = await getPackagesFromFirestore();
        if (firestorePkgs && firestorePkgs.length > 0) {
          setAllPackages(firestorePkgs);
        }
      } catch (err) {
        console.error("Error fetching packages in FeaturedPackages:", err);
      }
    };
    fetchPackages();
  }, []);

  const filteredPackages = allPackages.filter((pkg) => {
    if (selectedParkTab === 'all') return true;
    const pkgPark = (pkg.park || '').toLowerCase();
    const tabLower = selectedParkTab.toLowerCase();
    return pkgPark === tabLower || (pkg.parkName && pkg.parkName.toLowerCase().includes(tabLower));
  });

  return (
    <section id="safaris" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050b14] relative overflow-hidden font-sans">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Section Header with Title & Park Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight uppercase">
              Featured Safari Packages
            </h2>
          </div>

          {/* Park Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#08101d] p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: 'All Parks' },
              { id: 'yala', label: 'Yala' },
              { id: 'udawalawe', label: 'Udawalawe' },
              { id: 'wilpattu', label: 'Wilpattu' },
              { id: 'minneriya', label: 'Minneriya' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedParkTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedParkTab === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col justify-between w-full bg-[#08101d] border border-slate-800 rounded-none overflow-hidden shadow-xl hover:border-amber-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
            >
              {/* Media Cover Image - Clean without text/badge overlays */}
              <a href={`/safari?id=${pkg.id}`} className="relative h-44 sm:h-48 w-full rounded-none overflow-hidden bg-slate-950 block group">
                <img
                  src={pkg.image || FALLBACK_IMAGE}
                  alt={pkg.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.95] contrast-[1.02]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
              </a>

              {/* Card Body - Package Title, Description, Duration/Time Period, Price & Book Now CTA */}
              <div className="p-4 bg-[#08101d] flex flex-col justify-between space-y-3 flex-1">
                <div className="space-y-2">
                  {/* Package Title */}
                  <a href={`/safari?id=${pkg.id}`} className="block group-hover:text-amber-400 transition-colors">
                    <h3 className="text-xs font-black text-white font-serif uppercase tracking-wider line-clamp-2 min-h-[2.25rem]">
                      {pkg.title}
                    </h3>
                  </a>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed line-clamp-2 min-h-[2rem]">
                    {pkg.description || pkg.tagline}
                  </p>

                  {/* Time Period / Duration */}
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{pkg.duration ? pkg.duration.split('(')[0].trim() : 'Expedition'}</span>
                  </div>
                </div>

                {/* Price & Book Now CTA */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">From</span>
                    <div className="text-sm sm:text-base font-black text-amber-400 font-sans">
                      {formatPrice(pkg.priceLkr)}
                    </div>
                  </div>

                  <a
                    href={`/safari?id=${pkg.id}`}
                    className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3 stroke-[3]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Packages Footer CTA */}
        <div className="pt-4 flex justify-center">
          <a
            href="/tours"
            className="px-8 py-3.5 bg-[#08101d] hover:bg-slate-900 text-white hover:text-amber-400 border border-slate-800 hover:border-amber-500/50 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore All Packages</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

