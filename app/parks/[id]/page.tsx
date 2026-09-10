'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { BookingModal } from '../../../components/BookingModal';
import { AccountModal, UserProfile } from '../../../components/AccountModal';
import { PARK_DESTINATIONS, SAFARI_PACKAGES, JEEP_FLEET, SafariPackage } from '../../../data/packages';
import { getPackagesFromFirestore } from '../../../lib/firestore-service';
import { SafariPackageDoc } from '../../../lib/types/firestore';
import { useCurrency } from '../../../context/CurrencyContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trees,
  Sparkles,
  ChevronRight,
  Award,
  Info,
  Check,
  Layers,
  Car,
  Footprints,
  Navigation
} from 'lucide-react';

export default function ParkDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const parkId = rawId ? rawId.toLowerCase() : '';

  // Find matching park by ID or Slug
  const currentPark = PARK_DESTINATIONS.find(
    (p) => p.id.toLowerCase() === parkId || p.slug.toLowerCase() === parkId
  ) || PARK_DESTINATIONS[0];

  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);

  // Account Modal state
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // All Safari Packages state (populated from Firestore with local fallback)
  const [allPackages, setAllPackages] = useState<SafariPackageDoc[]>(SAFARI_PACKAGES as SafariPackageDoc[]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const firestorePkgs = await getPackagesFromFirestore();
        if (firestorePkgs && firestorePkgs.length > 0) {
          setAllPackages(firestorePkgs);
        }
      } catch (err) {
        console.error("Error fetching packages for park detail page:", err);
      }
    };
    fetchPackages();
  }, []);

  // Filter safari packages specifically for this park
  const parkPackages = allPackages.filter((pkg) => {
    const pkgPark = (pkg.park || '').toLowerCase();
    const parkIdLower = currentPark.id.toLowerCase();
    const parkSlugLower = currentPark.slug ? currentPark.slug.toLowerCase() : '';
    const parkNameClean = currentPark.name.toLowerCase().replace(' national park', '').trim();

    if (pkgPark === parkIdLower || pkgPark === parkSlugLower) return true;
    if (pkg.parkName && pkg.parkName.toLowerCase().includes(parkNameClean)) return true;
    if (pkg.id === 'sunset-safari-signature' && (parkIdLower === 'yala' || parkIdLower === 'udawalawe')) {
      return true;
    }
    return false;
  });

  const handleOpenBooking = (pkg?: SafariPackageDoc) => {
    setSelectedPackage((pkg as SafariPackage) || (parkPackages[0] as SafariPackage) || (SAFARI_PACKAGES[0] as SafariPackage));
    setIsBookingOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#050b14] text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Top Sanctuary Quick Switcher Bar */}
      <section className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 bg-[#08101e] border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto py-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 shrink-0 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Explore Sanctuaries:
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {PARK_DESTINATIONS.map((park) => (
              <a
                key={park.id}
                href={`/parks/${park.id}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  currentPark.id === park.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <span>{park.name.replace(' National Park', '')}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Park Detail Content */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#050b14]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href="/destinations" className="hover:text-amber-400 transition-colors">Destinations</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-300 font-bold">{currentPark.name}</span>
          </div>

          {/* Park Hero Card */}
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-[#08101d] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              
              {/* Left Side Image & Badges */}
              <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px] overflow-hidden group">
                <img
                  src={currentPark.image}
                  alt={currentPark.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.92] contrast-[1.05] saturate-[1.08] group-hover:brightness-105 group-hover:contrast-[1.1] group-hover:saturate-[1.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08101d] via-black/30 to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-[#08101d] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />

                {/* Floating Pills */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentPark.distanceFromColombo}</span>
                  </div>
                  {currentPark.areaKm2 && (
                    <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentPark.areaKm2} Reserve</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side Park Title & Overview */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-extrabold uppercase tracking-widest text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    {currentPark.keyFact}
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight leading-tight">
                    {currentPark.name}
                  </h1>

                  <p className="text-base text-amber-200/90 font-medium">
                    {currentPark.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    {currentPark.description}
                  </p>

                  {/* Best Season Card */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Optimal Safari Season
                    </div>
                    <div className="text-xs font-bold text-white">
                      {currentPark.bestSeason}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      const elem = document.getElementById('park-packages');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <span>View Safari Tours</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-slate-400 font-medium">
                    {parkPackages.length} Expeditions Available
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Key Sanctuary Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Established Year</span>
              <div className="text-lg font-black text-amber-400 font-serif">{currentPark.establishedYear || '1938'}</div>
              <span className="text-[11px] text-slate-400 block">Protected National Park</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Area</span>
              <div className="text-lg font-black text-amber-400 font-serif">{currentPark.areaKm2 || '300+ km²'}</div>
              <span className="text-[11px] text-slate-400 block">Wilderness Habitat</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Gate Hours</span>
              <div className="text-lg font-black text-amber-400 font-serif">{currentPark.operatingHours || '6 AM – 6 PM'}</div>
              <span className="text-[11px] text-slate-400 block">Daily Safari Shifts</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Primary Species</span>
              <div className="text-lg font-black text-emerald-400 font-serif">{currentPark.primarySpecies.length}+ Species</div>
              <span className="text-[11px] text-slate-400 block">Big Game & Birds</span>
            </div>
          </div>

          {/* Park Key Highlights & Gates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Highlights List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <Trees className="w-4 h-4" />
                  <span>PARK ATTRACTIONS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
                  Sanctuary Highlights & Features
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(currentPark.highlights || [
                  'Exclusive game drives with certified wildlife master trackers',
                  'Pristine natural waterholes and riverbank observation points',
                  'High probability of rare wildlife sightings',
                  'Spectacular photography opportunities at golden hour'
                ]).map((highlight, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#08101d] border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-xs text-slate-200 font-medium leading-relaxed">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Entrance Gates & Access */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#08101d] border border-amber-500/20 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  ENTRANCE & ACCESS GATES
                </span>
                <h3 className="text-lg font-bold text-white font-serif">
                  Park Entrance Gates
                </h3>
              </div>

              <div className="space-y-2.5">
                {(currentPark.gates || ['Main National Park Entrance Gate']).map((gate, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{gate}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Active Gate
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-400 font-light border-t border-slate-800">
                <p>
                  * All Wildking private safaris include pre-cleared Department of Wildlife Conservation (DWC) entrance permits for seamless fast-track gate access.
                </p>
              </div>
            </div>

          </div>

          {/* Wildlife Species Guide Section */}
          <div className="space-y-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <Footprints className="w-4 h-4" />
                <span>WILDLIFE PROFILE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
                Featured Species in {currentPark.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(currentPark.wildlifeGuide || [
                {
                  name: currentPark.primarySpecies[0] || 'Asian Elephant',
                  description: 'The defining big game species of this park, frequently seen near water sources.',
                  sightingSpot: 'Main Waterholes & Grasslands'
                },
                {
                  name: currentPark.primarySpecies[1] || 'Sri Lankan Leopard',
                  description: 'Apex predator roaming scrubland tracks during early dawn patrol drives.',
                  sightingSpot: 'Rock Outcrops & Scrub Forests'
                },
                {
                  name: currentPark.primarySpecies[2] || 'Water Buffalo',
                  description: 'Large aquatic mammals wallowing in mud flats and shallow marshlands.',
                  sightingSpot: 'Wetland Corridors'
                }
              ]).map((animal, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#08101d] border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="text-base font-bold text-white font-serif">{animal.name}</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {animal.description}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Prime Spotting: {animal.sightingSpot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Safari Packages Section */}
          <div id="park-packages" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <Compass className="w-4 h-4" />
                  <span>AVAILABLE EXPEDITIONS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
                  Safari Packages for {currentPark.name}
                </h2>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="text-amber-400 font-bold">{parkPackages.length}</span> Expeditions
              </div>
            </div>

            {parkPackages.length === 0 ? (
              <div className="p-12 text-center bg-[#08101d] border border-slate-800 rounded-3xl space-y-4">
                <Compass className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">Custom Safari Packages Available</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Contact our master safari concierge to book a custom 4x4 Land Cruiser expedition to {currentPark.name}.
                </p>
                <button
                  onClick={() => handleOpenBooking()}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase"
                >
                  Request Custom Safari
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {parkPackages.map((pkg) => (
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

                      {/* Price & Action Button */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">From</span>
                          <div className="text-base sm:text-lg font-black text-amber-400 font-sans">
                            {formatPrice(pkg.priceLkr)}
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenBooking(pkg)}
                          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Fleet Showcase for Park */}
          <div className="space-y-6 pt-8 border-t border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <Car className="w-4 h-4" />
                <span>SAFARI VEHICLES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
                Recommended 4x4 Fleet for {currentPark.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {JEEP_FLEET.map((jeep) => (
                <div key={jeep.id} className="p-5 rounded-2xl bg-[#08101d] border border-slate-800 space-y-3">
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img src={jeep.image} alt={jeep.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-serif">{jeep.name}</h4>
                  <p className="text-xs text-slate-400 font-light">{jeep.tagline}</p>
                  <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 pt-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{jeep.capacity}</span>
                  </div>
                </div>
              ))}
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
