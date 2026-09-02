'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SAFARI_PACKAGES, SafariPackage } from '../data/packages';
import { getPackagesFromFirestore } from '../lib/firestore-service';
import { SafariPackageDoc } from '../lib/types/firestore';
import { Star, Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedPackagesProps {
  currency: 'USD' | 'EUR' | 'LKR';
  onSelectPackage: (pkg: SafariPackage) => void;
  activeFilterPark?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80';

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  currency,
  onSelectPackage,
  activeFilterPark = 'all',
}) => {
  const [selectedParkTab, setSelectedParkTab] = useState<string>(activeFilterPark);
  const [allPackages, setAllPackages] = useState<SafariPackageDoc[]>(SAFARI_PACKAGES as SafariPackageDoc[]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carousel scroll navigation states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredPackages, selectedParkTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const formatPrice = (pkg: SafariPackageDoc) => {
    if (currency === 'EUR') return `€${pkg.priceEur}`;
    if (currency === 'LKR') return `Rs. ${pkg.priceLkr.toLocaleString()}`;
    return `$${pkg.priceUsd}`;
  };

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

        {/* Carousel Container with Parallel Side Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow - Parallel in front of first visible card */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous Safari Packages"
            className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-2xl ${
              canScrollLeft
                ? 'bg-[#08101d]/90 border border-amber-500/50 text-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 hover:scale-110 shadow-amber-500/20 cursor-pointer active:scale-95'
                : 'bg-slate-900/30 border border-slate-800 text-slate-600 opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Right Arrow - Parallel at end of last visible card */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next Safari Packages"
            className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-2xl ${
              canScrollRight
                ? 'bg-[#08101d]/90 border border-amber-500/50 text-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 hover:scale-110 shadow-amber-500/20 cursor-pointer active:scale-95'
                : 'bg-slate-900/30 border border-slate-800 text-slate-600 opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Horizontally Scrollable Cards Slider */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col justify-between shrink-0 w-[290px] sm:w-[340px] md:w-[360px] lg:w-[380px] snap-start transition-all duration-300"
              >
                {/* Media Cover Image */}
                <div className="relative h-56 w-full rounded-none overflow-hidden shadow-xl bg-slate-900 group-hover:shadow-amber-500/10 transition-shadow duration-300">
                  <img
                    src={pkg.image || FALLBACK_IMAGE}
                    alt={pkg.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-95"
                  />
                </div>

                {/* Card Details */}
                <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Location Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{pkg.parkName}</span>
                    </div>

                    {/* Rating & Duration */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="ml-1 text-white text-xs font-bold">{pkg.rating}</span>
                        <span className="ml-1 text-slate-400 font-normal">({pkg.reviewsCount})</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <a
                      href={`/safari?id=${pkg.id}`}
                      className="block text-base font-bold text-white font-serif group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug pt-0.5"
                    >
                      {pkg.title}
                    </a>
                  </div>

                  {/* Pricing & View Details Action Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                        From
                      </span>
                      <div className="text-xl font-extrabold text-amber-400 font-sans">
                        {formatPrice(pkg)}
                      </div>
                    </div>

                    <a
                      href={`/safari?id=${pkg.id}`}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-none flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all shrink-0 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </a>
                  </div>
                </div>

              </div>
            ))}

            {/* End Card: View More Packages with Arrow Caption */}
            <a
              href="/tours"
              className="group/endcard flex flex-col items-center justify-center shrink-0 w-[240px] sm:w-[280px] snap-start rounded-none bg-gradient-to-b from-[#091322] to-[#060d17] border border-amber-500/30 hover:border-amber-400 p-8 text-center space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-2xl cursor-pointer my-0.5"
            >
              <div className="w-16 h-16 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover/endcard:bg-amber-400 group-hover/endcard:text-slate-950 group-hover/endcard:scale-110 transition-all duration-300 shadow-lg">
                <ArrowRight className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black font-serif text-white uppercase group-hover/endcard:text-amber-400 transition-colors">
                  View More Packages
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Explore our full catalogue of custom 4x4 safaris
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
