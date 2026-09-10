'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BookingModal } from '../../components/BookingModal';
import { AccountModal, UserProfile } from '../../components/AccountModal';
import { SAFARI_PACKAGES, SafariPackage } from '../../data/packages';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  Clock,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  Compass,
  Sparkles,
  SlidersHorizontal,
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react';

function ToursContent() {
  const searchParams = useSearchParams();
  const parkUrlParam = searchParams ? searchParams.get('park') : null;
  const searchUrlParam = searchParams ? searchParams.get('search') : null;

  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  
  // Auth Account state
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPark, setSelectedPark] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  // Synchronize state with URL search parameters
  useEffect(() => {
    if (parkUrlParam) {
      setSelectedPark(parkUrlParam.toLowerCase());
    }
    if (searchUrlParam) {
      setSearchQuery(searchUrlParam);
    }
  }, [parkUrlParam, searchUrlParam]);

  const handleOpenBooking = (pkg?: SafariPackage) => {
    setSelectedPackage(pkg || SAFARI_PACKAGES[0]);
    setIsBookingOpen(true);
  };

  // Filter & Sort logic
  const filteredTours = SAFARI_PACKAGES.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.parkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPark = selectedPark === 'all' || pkg.park.toLowerCase() === selectedPark.toLowerCase();
    const matchesTimeSlot =
      selectedTimeSlot === 'all' ||
      (selectedTimeSlot === 'dawn' && pkg.timeSlot.includes('Dawn')) ||
      (selectedTimeSlot === 'dusk' && pkg.timeSlot.includes('Dusk')) ||
      (selectedTimeSlot === 'fullday' && pkg.timeSlot.includes('Full-Day'));

    return matchesSearch && matchesPark && matchesTimeSlot;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceUsd - b.priceUsd;
    if (sortBy === 'price-high') return b.priceUsd - a.priceUsd;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // recommended
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#050b14] text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 overflow-hidden flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-sunset-jeep.jpg"
            alt="Safari Packages Hero"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          {/* Gradient Overlays for dark theme consistency & text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/70 to-[#050b14]/80" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black font-serif tracking-tight text-white drop-shadow-md">
            Safari Packages
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            Choose from private dawn game drives, sunset savanna expeditions, and full-day deep wilderness penetrations across Yala, Udawalawe, Wilpattu & Minneriya.
          </p>
        </div>
      </section>

      {/* Catalog Search & Filters Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#070d18] border-b border-slate-800/80 sticky top-[72px] z-30 backdrop-blur-xl bg-[#070d18]/90">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input Box */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search tours, parks, or wildlife..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Park Selector Tabs */}
            <div className="md:col-span-5 flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              {[
                { id: 'all', label: 'All Parks' },
                { id: 'yala', label: 'Yala' },
                { id: 'udawalawe', label: 'Udawalawe' },
                { id: 'wilpattu', label: 'Wilpattu' },
                { id: 'minneriya', label: 'Minneriya' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPark(p.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedPark === p.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sort By Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Time Slot Secondary Filter */}
          <div className="flex items-center gap-3 text-xs pt-1 border-t border-slate-800/60">
            <span className="text-slate-400 font-medium">Time Slot:</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'All Slots' },
                { id: 'dawn', label: 'Dawn Patrol (5:30 AM)' },
                { id: 'dusk', label: 'Dusk Safari (2:30 PM)' },
                { id: 'fullday', label: 'Full-Day VIP' }
              ].map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot.id)}
                  className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                    selectedTimeSlot === slot.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid Section (4-Column Layout with Square Corners) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050b14] flex-1">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-300 font-sans">
              Showing <span className="text-amber-400">{filteredTours.length}</span> Expedition Packages
            </h2>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto animate-spin" />
              <h3 className="text-lg font-bold text-slate-300">No safari packages found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or clearing filters to view all available expeditions.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPark('all');
                  setSelectedTimeSlot('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {filteredTours.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group bg-[#08101d] border border-slate-800 rounded-none overflow-hidden hover:border-amber-500/60 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Image Header - Clean without text/badge overlays */}
                  <a href={`/safari?id=${pkg.id}`} className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950 block group">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.95] contrast-[1.02]"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </a>

                  {/* Card Body - Package Title, Description, Duration/Time Period, Price & Book Now CTA */}
                  <div className="p-5 bg-[#08101d] flex flex-col justify-between space-y-3.5 flex-1">
                    <div className="space-y-2">
                      {/* Package Title */}
                      <a href={`/safari?id=${pkg.id}`} className="block group-hover:text-amber-400 transition-colors">
                        <h3 className="text-sm font-black text-white font-serif uppercase tracking-wider line-clamp-2 min-h-[2.5rem]">
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
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">From</span>
                        <div className="text-base sm:text-lg font-black text-amber-400 font-sans">
                          {formatPrice(pkg.priceLkr)}
                        </div>
                      </div>

                      <a
                        href={`/safari?id=${pkg.id}`}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Quick Booking Modal Dialog */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedPackage={selectedPackage}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* User Account Authentication & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />
    </main>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050b14] text-white flex items-center justify-center">
        <Compass className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}
