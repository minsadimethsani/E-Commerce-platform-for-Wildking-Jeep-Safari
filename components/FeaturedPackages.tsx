import React, { useState, useEffect, useRef } from 'react';
import { SAFARI_PACKAGES, SafariPackage } from '../data/packages';
import { getPackagesFromFirestore } from '../lib/firestore-service';
import { SafariPackageDoc } from '../lib/types/firestore';
import { Clock, ArrowRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
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
  
  // Carousel Navigation & Scroll State
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [allPackages, selectedParkTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="safaris" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050b14] relative overflow-hidden font-sans">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Section Header with Title & Park Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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

        {/* Carousel Relative Wrapper with Aligned Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow Button aligned with cards row */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous packages"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-5 z-20 w-11 h-11 rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
              canScrollLeft
                ? 'bg-slate-950/90 border-slate-700 text-white hover:border-amber-400 hover:text-amber-400 hover:scale-110'
                : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button aligned with cards row */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next packages"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-5 z-20 w-11 h-11 rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
              canScrollRight
                ? 'bg-slate-950/90 border-slate-700 text-white hover:border-amber-400 hover:text-amber-400 hover:scale-110'
                : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Horizontal Carousel Container */}
          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 pt-1 snap-x snap-mandatory scroll-smooth [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-stretch"
          >
            {filteredPackages.slice(0, 8).map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col justify-between w-[280px] sm:w-[300px] shrink-0 snap-start bg-transparent border-0 rounded-none shadow-none transition-all duration-300"
              >
                {/* Media Cover Image - Top item with rounded corners */}
                <a href={`/safari?id=${pkg.id}`} className="relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-950 block">
                  <img
                    src={pkg.image || FALLBACK_IMAGE}
                    alt={pkg.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.95] contrast-[1.02]"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl" />
                </a>

                {/* Content & Details - Placed directly underneath image without box styling or padding */}
                <div className="pt-3.5 flex flex-col justify-between space-y-3 flex-1">
                  <div className="space-y-1.5">
                    {/* Package Title */}
                    <a href={`/safari?id=${pkg.id}`} className="block group-hover:text-amber-400 transition-colors">
                      <h3 className="text-xs font-black text-white font-serif uppercase tracking-wider leading-snug">
                        {pkg.title}
                      </h3>
                    </a>

                    {/* Time Period / Duration */}
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{pkg.duration ? pkg.duration.split('(')[0].trim() : 'Expedition'}</span>
                    </div>
                  </div>

                  {/* Price & Book CTA - Clean bottom action row without inner horizontal divider line */}
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">From</span>
                      <div className="text-sm sm:text-base font-black text-amber-400 font-sans">
                        {formatPrice(pkg.priceLkr)}
                      </div>
                    </div>

                    <a
                      href={`/safari?id=${pkg.id}`}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer inline-flex items-center gap-1 shrink-0 rounded-xl"
                    >
                      <span>BOOK</span>
                      <ArrowRight className="w-3 h-3 stroke-[3]" />
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* 9th Card: "View All Packages" CTA Card */}
            <a
              href="/packages"
              className="group flex flex-col items-center justify-center text-center w-[280px] sm:w-[300px] shrink-0 snap-start bg-slate-900/50 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-6 space-y-4 shadow-none transition-all duration-300 hover:-translate-y-1 cursor-pointer min-h-[320px]"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center text-amber-400 shadow-lg transition-all duration-300">
                <Compass className="w-8 h-8 stroke-[2] group-hover:rotate-45 transition-transform duration-500" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-amber-400 transition-colors font-serif">
                  View All Packages
                </h3>
                <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">
                  Explore all Sri Lanka safari expeditions and custom itineraries
                </p>
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-black uppercase text-amber-400 tracking-wider pt-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Directory</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </a>
          </div>
        </div>

        {/* Counter Info Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">
            Showing <span className="text-amber-400 font-bold">{Math.min(filteredPackages.length, 8)}</span> of <span className="text-white font-bold">{filteredPackages.length}</span> Featured Expeditions
          </p>
        </div>
      </div>
    </section>
  );
};
