'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BookingModal } from '../../components/BookingModal';
import { AccountModal, UserProfile } from '../../components/AccountModal';
import { SAFARI_PACKAGES, SafariPackage } from '../../data/packages';
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

export default function ToursPage() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'LKR'>('USD');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  
  // Auth Account state
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPark, setSelectedPark] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  const formatPrice = (pkg: SafariPackage) => {
    if (currency === 'EUR') return `€${pkg.priceEur}`;
    if (currency === 'LKR') return `Rs. ${pkg.priceLkr.toLocaleString()}`;
    return `$${pkg.priceUsd}`;
  };

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

    const matchesPark = selectedPark === 'all' || pkg.park === selectedPark;
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
        currency={currency}
        onCurrencyChange={(curr) => setCurrency(curr)}
        onOpenBooking={() => handleOpenBooking()}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Tours Page Banner */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091120] via-[#070e1a] to-[#050b14] border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>WILDKING EXPEDITION CATALOG</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-serif uppercase tracking-tight text-white">
            LUXURY 4x4 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">SAFARI TOURS</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
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
                  className="group bg-[#0b1711] border border-emerald-900/50 rounded-none overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Image & Overlay */}
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

                      {/* Title */}
                      <h3 className="text-base font-bold text-white font-serif mb-2 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {pkg.title}
                      </h3>
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
                        onClick={() => handleOpenBooking(pkg)}
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
        currency={currency}
      />

      {/* User Account Authentication & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogin={(loggedInUser) => setUser(loggedInUser)}
        onLogout={() => setUser(null)}
        onOpenBooking={() => handleOpenBooking()}
      />
    </main>
  );
}
