'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BookingModal } from '../../components/BookingModal';
import { AccountModal, UserProfile } from '../../components/AccountModal';
import { SAFARI_PACKAGES, SafariPackage, REVIEWS } from '../../data/packages';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { getTomorrowDateString } from '../../lib/validation';
import {
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  Car,
  Coffee,
  Camera,
  ChevronRight,
  Award,
  Info,
  Check
} from 'lucide-react';

function SafariDetailContent() {
  const searchParams = useSearchParams();
  const safariIdParam = searchParams ? searchParams.get('id') : null;

  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Account Modal state
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Selected Safari Package State
  const initialPkg = SAFARI_PACKAGES.find((p) => p.id === safariIdParam) || SAFARI_PACKAGES[0];
  const [activeSafari, setActiveSafari] = useState<SafariPackage>(initialPkg);

  // Interactive booking box state inside single safari page
  const [bookingDate, setBookingDate] = useState(getTomorrowDateString());
  const [guestCount, setGuestCount] = useState(2);

  useEffect(() => {
    if (safariIdParam) {
      const found = SAFARI_PACKAGES.find((p) => p.id === safariIdParam);
      if (found) setActiveSafari(found);
    }
  }, [safariIdParam]);

  return (
    <main className="min-h-screen flex flex-col bg-[#050b14] text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Top Safari Switcher Bar */}
      <section className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 bg-[#08101e] border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto py-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 shrink-0 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Select Expedition:
          </span>
          
          <div className="flex items-center gap-2 shrink-0">
            {SAFARI_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setActiveSafari(pkg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeSafari.id === pkg.id
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {pkg.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Single Safari Detail Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#050b14]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href="/tours" className="hover:text-amber-400 transition-colors">Tours</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-300 font-bold truncate max-w-xs sm:max-w-md">{activeSafari.title}</span>
          </div>

          {/* Safari Header Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Content Area (Image, Badges, Overview, Itinerary) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Title & Tagline Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {activeSafari.badge && (
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider">
                      {activeSafari.badge}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-amber-300 text-[11px] font-bold">
                    {activeSafari.sightingsRate}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {activeSafari.parkName}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-serif text-white uppercase tracking-tight leading-tight">
                  {activeSafari.title}
                </h1>

                <p className="text-base text-slate-300 font-light leading-relaxed">
                  {activeSafari.tagline}
                </p>

                {/* Rating Bar */}
                <div className="flex items-center gap-4 text-xs pt-1">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span className="text-white text-sm">{activeSafari.rating} / 5.0</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{activeSafari.reviewsCount} Verified Guest Reviews</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> 100% Private Safari Guarantee
                  </span>
                </div>
              </div>

              {/* Main Image Showcase */}
              <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl">
                <img
                  src={activeSafari.image}
                  alt={activeSafari.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-black/30" />
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Duration: {activeSafari.duration}</span>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-400" />
                    <span>Vehicle: Custom 4x4 Land Cruiser 70</span>
                  </div>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Shift Schedule</span>
                  <span className="text-xs font-bold text-amber-300">{activeSafari.timeSlot}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Jeep Capacity</span>
                  <span className="text-xs font-bold text-white">{activeSafari.maxGuests} Guests Max</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Park Permits</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 100% Included
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Naturalist Guide</span>
                  <span className="text-xs font-bold text-amber-300">Senior Master Tracker</span>
                </div>
              </div>

              {/* Safari Overview Description */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wide">
                  Expedition Overview & Experience
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {activeSafari.description} Designed for discerning wildlife enthusiasts, photographers, and families, this private expedition takes you deep into exclusive park corridors in custom-engineered 4x4 overland Land Cruisers.
                </p>
              </div>

              {/* Safari Highlights List */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wide">
                  Key Expedition Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSafari.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-xs text-slate-200 font-medium leading-normal">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Services & Amenities */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wide">
                  What’s Included In Your Private Safari
                </h3>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900/80 border border-emerald-500/30 space-y-3">
                  {activeSafari.inclusions.map((inclusion, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-200">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="font-semibold text-white">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passenger Safety Features & Emergency Equipment */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wide">
                    Passenger Safety & Emergency Standards
                  </h3>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 shadow-xl">
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Your safety is our highest priority. All Wildking safari packages include top-tier off-road passenger safety equipment and emergency protocols engineered for off-road national park expeditions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeSafari.safetyFeatures || [
                      'Heavy-Duty Steel Roll Cages (Anti-Topple Certified)',
                      '3-Point Individual Ergonomic Seatbelts for All Seats',
                      'Certified Wilderness First-Aid & Emergency Kit Onboard',
                      'Satellite GPS Live Tracker & DWC Ranger Emergency Radio',
                      'High-Visibility Dust Protection Goggles & Child Harnesses'
                    ]).map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#06111a] border border-amber-500/20 flex items-center gap-3"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                        </div>
                        <span className="text-xs font-semibold text-slate-100">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hour-by-Hour Expedition Schedule Timeline */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wide">
                  Sample Expedition Timeline
                </h3>
                <div className="space-y-4 border-l-2 border-amber-500/30 pl-6 ml-2">
                  <div className="relative space-y-1">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 border-4 border-slate-950" />
                    <span className="text-[11px] font-extrabold uppercase text-amber-400">05:00 AM / 02:00 PM</span>
                    <h5 className="text-sm font-bold text-white">Private Hotel Pickup & Transfer</h5>
                    <p className="text-xs text-slate-400 font-light">
                      Your master driver arrives at your hotel in a custom 4x4 Land Cruiser with chilled water and binoculars.
                    </p>
                  </div>

                  <div className="relative space-y-1">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 border-4 border-slate-950" />
                    <span className="text-[11px] font-extrabold uppercase text-amber-400">05:30 AM / 02:30 PM</span>
                    <h5 className="text-sm font-bold text-white">VIP Fast-Track Park Entry</h5>
                    <p className="text-xs text-slate-400 font-light">
                      Skip standard entrance queues with pre-cleared VIP wildlife permits and enter active game zones.
                    </p>
                  </div>

                  <div className="relative space-y-1">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 border-4 border-slate-950" />
                    <span className="text-[11px] font-extrabold uppercase text-amber-400">08:00 AM / 05:00 PM</span>
                    <h5 className="text-sm font-bold text-white">Waterhole Spotting & Bush Breakfast</h5>
                    <p className="text-xs text-slate-400 font-light">
                      Pause at panoramic river viewpoints to observe wild elephants, big cat territories, and avian herds.
                    </p>
                  </div>

                  <div className="relative space-y-1">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 border-4 border-slate-950" />
                    <span className="text-[11px] font-extrabold uppercase text-amber-400">10:00 AM / 06:30 PM</span>
                    <h5 className="text-sm font-bold text-white">Return Transfer & Memory Drop-off</h5>
                    <p className="text-xs text-slate-400 font-light">
                      Exit the sanctuary and enjoy a comfortable smooth transfer back to your hotel or resort.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sticky Booking Sidebar */}
            <div className="lg:col-span-4 w-full sticky top-28 space-y-6">
              <div className="p-6 rounded-3xl bg-[#091220] border border-amber-500/40 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      ALL-INCLUSIVE JEEP PRICE
                    </span>
                    <div className="text-3xl font-black text-amber-400">
                      {formatPrice(activeSafari.priceLkr)}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    Instant Confirmation
                  </span>
                </div>

                {/* Form Controls */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Select Expedition Date
                    </label>
                    <input
                      type="date"
                      min={getTomorrowDateString()}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Guests (Max 6 per Jeep)
                    </label>
                    <div className="space-y-2">
                      <select
                        value={guestCount <= 6 ? guestCount : 'custom'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'custom') {
                            if (guestCount <= 6) setGuestCount(7);
                          } else {
                            setGuestCount(Number(val));
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-400 text-xs"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={5}>5 Guests</option>
                        <option value={6}>6 Guests (Single Jeep Capacity)</option>
                        <option value="custom">More than 6 guests (Enter number)...</option>
                      </select>

                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min={1}
                          max={99}
                          placeholder="Enter guest count"
                          value={guestCount || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setGuestCount(isNaN(val) || val < 1 ? 1 : val);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute right-3 text-[10px] font-bold text-slate-400 pointer-events-none">
                          Total Guests
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exceeding Single Vehicle Capacity Notice */}
                {guestCount > 6 && (
                  <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <Info className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{Math.ceil(guestCount / 6)} Vehicles Required</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-200">
                      Single Jeep max capacity is <strong>6 guests</strong>. For <strong>{guestCount} guests</strong>, <strong>{Math.ceil(guestCount / 6)} 4x4 Jeeps</strong> will be reserved.
                    </p>
                    <p className="text-[10px] leading-relaxed text-amber-300 font-medium border-t border-amber-500/30 pt-1.5">
                      💡 <strong>Full Vehicle Payment Policy:</strong> To book extra seats from another vehicle, full package rate applies per additional Jeep. All remaining seats on the second Jeep will be exclusively reserved for your party.
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Estimated Total ({Math.ceil(guestCount / 6)} Jeep{Math.ceil(guestCount / 6) > 1 ? 's' : ''}):</span>
                    <span className="text-lg font-black text-amber-300">{formatPrice(activeSafari.priceLkr * Math.ceil(guestCount / 6))}</span>
                  </div>

                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="btn-golden-glow w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-950 shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>Reserve This Safari</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>

                  <div className="text-[10px] text-slate-400 text-center space-y-1 pt-1">
                    <p className="flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> Free Cancellation up to 48h
                    </p>
                    <p className="flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400" /> No hidden fees or park permit surcharges
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 text-center">
                <span className="text-amber-400 font-bold block uppercase tracking-wider text-[11px]">
                  Need Custom Itinerary Advice?
                </span>
                <p className="text-slate-400 font-light">
                  Speak directly with our Chief Naturalist on WhatsApp for real-time park recommendations.
                </p>
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-900/80 transition-colors"
                >
                  <span>Chat on WhatsApp (+94 77 123 4567)</span>
                </a>
              </div>
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
        selectedPackage={activeSafari}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* User Account Authentication & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />
    </main>
  );
}

export default function SafariDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050b14] text-white flex items-center justify-center">
        <Compass className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    }>
      <SafariDetailContent />
    </Suspense>
  );
}
