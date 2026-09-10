'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BookingModal } from '../../components/BookingModal';
import { AccountModal, UserProfile } from '../../components/AccountModal';
import { PARK_DESTINATIONS, SAFARI_PACKAGES, SafariPackage, ParkDestination } from '../../data/packages';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Trees,
  Sparkles,
  ChevronRight,
  Search,
  Award,
  Info,
  Check
} from 'lucide-react';

export default function DestinationsPage() {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);

  // Auth Account state
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Filter state
  const [activeParkId, setActiveParkId] = useState<string>('all');

  const handleOpenBooking = (pkg?: SafariPackage) => {
    setSelectedPackage(pkg || SAFARI_PACKAGES[0]);
    setIsBookingOpen(true);
  };

  const filteredParks = activeParkId === 'all'
    ? PARK_DESTINATIONS
    : PARK_DESTINATIONS.filter((park) => park.id === activeParkId);

  const getPackagesForPark = (parkId: string) => {
    return SAFARI_PACKAGES.filter((pkg) => pkg.park === parkId);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#050b14] text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Hero Banner */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091120] via-[#070e1a] to-[#050b14] border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>SRI LANKA WILDLIFE SANCTUARIES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-serif uppercase tracking-tight text-white">
            EXPLORE NATIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">PARKS</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            From Yala’s coastal leopard territories to Udawalawe’s giant elephant corridors and Wilpattu’s ancient lakes, discover Sri Lanka’s premier wildlife sanctuaries.
          </p>
        </div>
      </section>

      {/* Park Filter Bar */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-[#070d18] border-b border-slate-800 sticky top-[72px] z-30 backdrop-blur-xl bg-[#070d18]/90">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Filter Sanctuary:
            </span>
            <button
              onClick={() => setActiveParkId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeParkId === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              All Sanctuaries
            </button>
            {PARK_DESTINATIONS.map((park) => (
              <button
                key={park.id}
                onClick={() => setActiveParkId(park.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeParkId === park.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {park.name.replace(' National Park', '')}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-amber-400 font-bold">{filteredParks.length}</span> Destinations
          </div>
        </div>
      </section>

      {/* Main Parks Detail Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050b14] space-y-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {filteredParks.map((park, index) => {
            const parkPackages = getPackagesForPark(park.id);

            return (
              <div
                key={park.id}
                id={park.id}
                className="bg-[#08101d] border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-amber-500/40"
              >
                {/* Park Hero Card Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left Column: Image Showcase */}
                  <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[420px] overflow-hidden group">
                    <img
                      src={park.image}
                      alt={park.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.92] contrast-[1.05] saturate-[1.08] group-hover:brightness-105 group-hover:contrast-[1.1] group-hover:saturate-[1.15]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08101d] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-[#08101d] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />

                    {/* Top Pill Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{park.distanceFromColombo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Park Overview & Key Info */}
                  <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-widest text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        {park.keyFact}
                      </div>

                      <h2 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
                        {park.name}
                      </h2>

                      <p className="text-sm text-slate-300 font-light leading-relaxed">
                        {park.tagline}
                      </p>

                      {/* Best Season Box */}
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Optimal Safari Season
                        </div>
                        <div className="text-xs font-bold text-white">
                          {park.bestSeason}
                        </div>
                      </div>

                      {/* Primary Wildlife Species Tags */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                          Primary Species Sightings
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {park.primarySpecies.map((species, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-xs font-semibold text-emerald-300 inline-flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>{species}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Park Quick Action Button */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/parks/${park.id}`}
                          className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-md shadow-amber-400/20"
                        >
                          <span>Park Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`/tours?park=${park.id}`}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>View Tours</span>
                        </a>
                      </div>

                      <span className="text-xs text-slate-400 font-medium">
                        {parkPackages.length} Available Expeditions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Associated Safari Packages Cards for this Park */}
                {parkPackages.length > 0 && (
                  <div className="p-6 sm:p-8 border-t border-amber-500/20 bg-[#060c16]">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white font-serif uppercase tracking-wide flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-400" />
                        Featured Expeditions in {park.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {parkPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="group bg-[#091322] border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                        >
                          {/* Image Header - Clean without text/badge overlays */}
                          <a href={`/safari?id=${pkg.id}`} className="relative h-48 w-full overflow-hidden bg-slate-950 block group">
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.95] contrast-[1.02]"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                          </a>

                          {/* Card Body - ONLY Package Title, Description, Duration/Time Period, Price & Book Now CTA */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              {/* Title */}
                              <a
                                href={`/safari?id=${pkg.id}`}
                                className="block text-base font-bold text-white font-serif hover:text-amber-400 transition-colors line-clamp-2"
                              >
                                {pkg.title}
                              </a>

                              {/* Description */}
                              <p className="text-xs text-slate-400 font-light line-clamp-2">
                                {pkg.tagline || pkg.description}
                              </p>

                              {/* Time Period / Duration */}
                              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium pt-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{pkg.duration ? pkg.duration.split('(')[0].trim() : 'Expedition'}</span>
                              </div>
                            </div>

                            {/* Price & Book Now CTA */}
                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                                  From
                                </span>
                                <div className="text-lg font-extrabold text-amber-400 font-sans">
                                  {formatPrice(pkg.priceLkr)}
                                </div>
                              </div>

                              <button
                                onClick={() => handleOpenBooking(pkg)}
                                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1 shadow-md shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
                              >
                                <span>Book Now</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Visitor Guidelines & Preparation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#040912] border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>PREPARATION & ETIQUETTE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif uppercase tracking-tight">
              Essential Visitor Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-white">What to Wear</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Neutral, khaki, or earth-tone lightweight clothing is recommended. Early morning game drives in open Land Cruisers can be chilly, so bring a light jacket or scarf.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-white">Camera & Optics</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Telephoto lenses (200mm–600mm) are ideal for leopard and bird photography. Every Wildking jeep comes equipped with high-zoom Nikon binoculars and beanbag camera supports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-white">Eco-Code & Safety</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                We strictly abide by Department of Wildlife Conservation rules. No plastic dumping, no loud noises, and maintaining respectful safety distances from wild elephant herds.
              </p>
            </div>
          </div>
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
