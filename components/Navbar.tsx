'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Compass,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  User,
  MapPin,
  ArrowRight,
  Trees,
  Search,
  Settings,
  LogOut,
  ShieldCheck,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile } from './AccountModal';
import { PARK_DESTINATIONS } from '../data/packages';
import { getDestinationsFromFirestore } from '../lib/firestore-service';
import { ParkDestinationDoc } from '../lib/types/firestore';
import { useCurrency, CurrencyCode, CURRENCY_CONFIGS } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface NavbarProps {
  currency?: CurrencyCode;
  onCurrencyChange?: (curr: CurrencyCode) => void;
  onOpenBooking: () => void;
  user: UserProfile | null;
  onOpenAccount: (tab?: 'overview' | 'bookings' | 'settings') => void;
  animated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency: propCurrency,
  onCurrencyChange,
  onOpenBooking,
  user,
  onOpenAccount,
  animated = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = animated || pathname === '/';
  const { user: authUser, logout: authLogout } = useAuth();
  const { showInfo } = useToast();
  const currentUser = user || authUser;

  const { currency: contextCurrency, setCurrency: setContextCurrency } = useCurrency();
  const activeCurrency = propCurrency || contextCurrency;
  const [animationComplete, setAnimationComplete] = useState(!isLandingPage);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileUserDropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    authLogout();
    showInfo('Signed Out', 'You have been successfully logged out of your member portal.');
  };

  const handleOpenAccountWithTab = (tab: 'overview' | 'bookings' | 'settings' = 'overview') => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (currentUser) {
      onOpenAccount(tab);
    } else {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      router.push('/login' + (currentPath ? `?redirect=${encodeURIComponent(currentPath)}` : ''));
    }
  };

  const handleAccountClick = () => {
    if (currentUser) {
      setIsUserMenuOpen((prev) => !prev);
    } else {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      router.push('/login' + (currentPath ? `?redirect=${encodeURIComponent(currentPath)}` : ''));
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileParksOpen, setIsMobileParksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [destinationsList, setDestinationsList] = useState<ParkDestinationDoc[]>(PARK_DESTINATIONS as ParkDestinationDoc[]);

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const data = await getDestinationsFromFirestore();
        if (data && data.length > 0) {
          setDestinationsList(data);
        }
      } catch (e) {
        console.error("Error fetching navbar destinations:", e);
      }
    };
    fetchDests();
    window.addEventListener("wildking_data_updated", fetchDests);
    return () => window.removeEventListener("wildking_data_updated", fetchDests);
  }, []);

  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      if (scrolled) {
        setAnimationComplete(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside and Escape key to close dropdowns, search popouts and user mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(target)) {
        setIsCurrencyDropdownOpen(false);
      }

      const inDesktopSearch = searchDropdownRef.current?.contains(target);
      const inMobileSearch = mobileSearchDropdownRef.current?.contains(target);
      if (!inDesktopSearch && !inMobileSearch) {
        setIsSearchOpen(false);
      }

      const inUserDropdown = userDropdownRef.current?.contains(target);
      const inMobileUserDropdown = mobileUserDropdownRef.current?.contains(target);
      if (!inUserDropdown && !inMobileUserDropdown) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsCurrencyDropdownOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      window.location.href = `/tours?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSelectCurrency = (code: CurrencyCode) => {
    setContextCurrency(code);
    if (onCurrencyChange) {
      onCurrencyChange(code);
    }
    setIsCurrencyDropdownOpen(false);
  };

  const renderUserMegaMenu = () => {
    if (!isUserMenuOpen) return null;

    return (
      <div className="absolute right-0 top-full mt-2.5 w-[340px] sm:w-[410px] max-w-[calc(100vw-2rem)] bg-[#0b1320] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        {currentUser ? (
          <>
            {/* User Identity Header Banner */}
            <div className="p-4 bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-[#0b1320] border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/40 shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold font-serif text-sm text-white truncate">
                      {currentUser.name || 'Wildking Explorer'}
                    </h4>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  {currentUser.phone && (
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.phone}</p>
                  )}
                </div>
              </div>

              {/* Quick Member Stats Badge */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center">
                <div className="py-1.5 px-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block font-medium">Expeditions</span>
                  <span className="text-xs font-black text-amber-400">
                    {currentUser.bookings ? currentUser.bookings.length : 0} Booked
                  </span>
                </div>
                <div className="py-1.5 px-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block font-medium">Tier Status</span>
                  <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    VIP Explorer
                  </span>
                </div>
              </div>
            </div>

            {/* Mega Menu Two-Column Grid */}
            <div className="p-3.5 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Column 1: Expeditions & Portal */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                    Safari Portal
                  </span>

                  <button
                    onClick={() => handleOpenAccountWithTab('overview')}
                    className="w-full text-left p-2 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center gap-2 group text-xs text-slate-200 hover:text-amber-300 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold leading-tight">Overview</div>
                      <div className="text-[10px] text-slate-400 truncate">Member profile</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenAccountWithTab('bookings')}
                    className="w-full text-left p-2 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center gap-2 group text-xs text-slate-200 hover:text-amber-300 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 shrink-0">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold leading-tight">My Safaris</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          {currentUser.bookings ? currentUser.bookings.length : 0}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">Tours & vouchers</div>
                    </div>
                  </button>
                </div>

                {/* Column 2: Settings & Preferences */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                    Settings & Prefs
                  </span>

                  <button
                    onClick={() => handleOpenAccountWithTab('settings')}
                    className="w-full text-left p-2 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center gap-2 group text-xs text-slate-200 hover:text-amber-300 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 shrink-0">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold leading-tight">Settings</div>
                      <div className="text-[10px] text-slate-400 truncate">Alerts & profile</div>
                    </div>
                  </button>

                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Currency</span>
                      <span className="font-black text-amber-400">{activeCurrency}</span>
                    </div>
                    <div className="flex gap-1">
                      {(['USD', 'EUR', 'GBP', 'AUD', 'LKR'] as CurrencyCode[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => handleSelectCurrency(c)}
                          className={`flex-1 py-0.5 text-[9px] font-bold rounded transition-colors ${
                            activeCurrency === c
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Booking CTA */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenBooking();
                }}
                className="btn-golden-glow w-full py-2.5 px-3 rounded-xl font-extrabold uppercase text-[11px] tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Book A New Safari</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>

            {/* Mega Menu Footer with Sign Out */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500/60" />
                <span>Wildking Portal</span>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 hover:text-red-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Logged Out Welcome Banner */}
            <div className="p-4 bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-[#0b1320] border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-serif text-sm text-white">Wildking Member Club</h4>
                  <p className="text-[11px] text-slate-400">Sign in to manage custom expeditions</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Access your safari bookings, verified driver briefings, customized Land Cruiser seats, and 24/7 naturalist support.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
                    router.push('/login' + (currentPath ? `?redirect=${encodeURIComponent(currentPath)}` : ''));
                  }}
                  className="btn-golden-glow w-full py-2.5 px-3 rounded-xl font-extrabold uppercase text-xs tracking-wider text-slate-950 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-950" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
                    router.push('/login?tab=register' + (currentPath ? `&redirect=${encodeURIComponent(currentPath)}` : ''));
                  }}
                  className="w-full py-2.5 px-3 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Register</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Safari Driver or Admin?</span>
              <a
                href="/admin/login"
                className="text-amber-400 hover:underline font-semibold"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Admin Portal →
              </a>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <header
      onAnimationEnd={() => setAnimationComplete(true)}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isLandingPage && !animationComplete && !isScrolled
          ? 'animate-navbar-pull-down'
          : 'transition-all duration-300'
      } ${
        isScrolled
          ? 'glass-nav-dark py-3.5 border-b border-amber-500/20 shadow-2xl'
          : 'bg-gradient-to-b from-[#050b14]/90 via-[#050b14]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left Brand Identity */}
          <a
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Wildking Jeep Safari Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black font-serif tracking-wider text-white uppercase leading-none group-hover:text-amber-400 transition-colors">
                WILDKING
              </span>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase leading-tight">
                JEEP SAFARI SRI LANKA
              </span>
            </div>
          </a>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="/"
              className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </a>

            {/* Safari Parks Dropdown Mega-Menu */}
            <div
              className="relative py-1"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                <span>Safari Parks</span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-[#0b1320] border border-amber-500/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    {destinationsList.map((park) => (
                      <div
                        key={park.id}
                        className="group/park p-2.5 rounded-xl hover:bg-amber-500/10 transition-colors border border-transparent hover:border-amber-500/20 space-y-1.5"
                      >
                        <a
                          href={`/tours?park=${park.id}`}
                          className="flex items-start gap-3 focus:outline-none"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-900 ring-1 ring-white/10 relative">
                            <img
                              src={park.image}
                              alt={park.name}
                              className="w-full h-full object-cover group-hover/park:scale-110 transition-transform duration-300 filter brightness-95 contrast-105 group-hover/park:brightness-105"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-black text-white font-serif uppercase block group-hover/park:text-amber-400 transition-colors">
                              {park.name}
                            </span>
                            <span className="text-[10px] text-slate-400 line-clamp-1 block">
                              {park.tagline}
                            </span>
                          </div>
                        </a>

                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60">
                          <a
                            href={`/tours?park=${park.id}`}
                            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{park.name.split(' ')[0]} Safaris</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={`/parks/${park.id}`}
                            className="text-slate-400 hover:text-white font-medium hover:underline"
                          >
                            Park Guide
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sri Lanka Wildlife Sanctuaries</span>
                    <a href="/tours" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                      <span>View All Safaris</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/destinations"
              className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Destinations
            </a>
            <a
              href="/tours"
              className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Tours
            </a>
            <a
              href="/contact"
              className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Contact Us
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Desktop Search Popout Container */}
            <div className="relative group flex flex-col items-center" ref={searchDropdownRef}>
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className={`p-2 rounded-xl border transition-all ${
                  isSearchOpen
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/80 border-amber-500/30 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
                }`}
                title="Search"
                aria-label="Search"
                aria-expanded={isSearchOpen}
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>

              {/* Simple text below search icon on hover */}
              {!isSearchOpen && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block text-[11px] font-semibold text-amber-300 whitespace-nowrap pointer-events-none drop-shadow">
                  Search
                </span>
              )}

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0b1320] border border-amber-500/40 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <Search className="w-4 h-4 text-amber-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search safaris, parks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                        aria-label="Clear search query"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* User Account Mega Menu Container */}
            <div className="relative group flex flex-col items-center" ref={userDropdownRef}>
              <button
                onClick={handleAccountClick}
                title={currentUser ? `Account (${currentUser.name})` : 'Sign Up / Log In'}
                aria-label={currentUser ? `Account (${currentUser.name})` : 'Sign Up / Log In'}
                aria-expanded={isUserMenuOpen}
                className={`p-2 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center relative cursor-pointer ${
                  isUserMenuOpen
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40'
                    : currentUser
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                    : 'bg-slate-900/80 border-amber-500/30 text-slate-200 hover:bg-slate-800 hover:border-amber-400'
                }`}
              >
                <div className="relative flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  {currentUser && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
                  )}
                </div>
              </button>

              {/* Simple tooltip below icon on hover when menu is closed */}
              {!isUserMenuOpen && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block text-[11px] font-semibold text-amber-300 whitespace-nowrap pointer-events-none drop-shadow z-50">
                  {currentUser ? (currentUser.name || 'Account') : 'Sign Up / Log In'}
                </span>
              )}

              {renderUserMegaMenu()}
            </div>

            {/* Multi-Currency Dropdown Component */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>{CURRENCY_CONFIGS[activeCurrency]?.label || activeCurrency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0b1320] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                  {Object.values(CURRENCY_CONFIGS).map((cfg) => (
                    <button
                      key={cfg.code}
                      onClick={() => handleSelectCurrency(cfg.code)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-amber-500/10 transition-colors ${
                        activeCurrency === cfg.code ? 'text-amber-400 font-bold bg-amber-500/15' : 'text-slate-300'
                      }`}
                    >
                      <span>{cfg.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{cfg.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="relative md:hidden group flex flex-col items-center" ref={mobileSearchDropdownRef}>
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className={`p-2 rounded-xl border transition-all ${
                  isSearchOpen
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/80 border-amber-500/30 text-amber-400'
                }`}
                title="Search"
                aria-label="Search"
                aria-expanded={isSearchOpen}
              >
                <Search className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>

              {!isSearchOpen && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block text-[11px] font-semibold text-amber-300 whitespace-nowrap pointer-events-none drop-shadow">
                  Search
                </span>
              )}

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-[#0b1320] border border-amber-500/40 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <Search className="w-4 h-4 text-amber-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search safaris, parks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                        aria-label="Clear search query"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>

            <div className="relative md:hidden group flex flex-col items-center" ref={mobileUserDropdownRef}>
              <button
                onClick={handleAccountClick}
                className={`p-2 rounded-xl border transition-all ${
                  isUserMenuOpen
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                    : currentUser
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/80 border-amber-500/30 text-amber-400'
                }`}
                title={currentUser ? `Account (${currentUser.name})` : 'Sign Up / Log In'}
                aria-label={currentUser ? `Account (${currentUser.name})` : 'Sign Up / Log In'}
              >
                <User className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>

              {!isUserMenuOpen && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block text-[11px] font-semibold text-amber-300 whitespace-nowrap pointer-events-none drop-shadow">
                  {currentUser ? (currentUser.name || 'Account') : 'Sign Up / Log In'}
                </span>
              )}

              {renderUserMegaMenu()}
            </div>

            <button
              onClick={() => {
                const nextCurrency: Record<CurrencyCode, CurrencyCode> = {
                  USD: 'EUR',
                  EUR: 'GBP',
                  GBP: 'AUD',
                  AUD: 'LKR',
                  LKR: 'USD',
                };
                handleSelectCurrency(nextCurrency[activeCurrency] || 'USD');
              }}
              className="px-2.5 py-1.5 text-[11px] font-bold text-amber-400 rounded-lg bg-slate-900/80 border border-amber-500/30 md:hidden"
            >
              {activeCurrency}
            </button>

            <button
              onClick={() => {
                setIsSearchOpen(false);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 text-slate-200 hover:text-amber-400 rounded-xl bg-slate-900/80 border border-amber-500/20"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#090f1d] border-b border-amber-500/20 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-amber-400"
            >
              Home
            </a>

            {/* Mobile Safari Parks Accordion */}
            <div className="space-y-2">
              <button
                onClick={() => setIsMobileParksOpen(!isMobileParksOpen)}
                className="w-full text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-amber-400 flex items-center justify-between py-1"
              >
                <span>Safari Parks</span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isMobileParksOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileParksOpen && (
                <div className="pl-3 space-y-2 border-l border-amber-500/30 ml-1 py-1">
                  {destinationsList.map((park) => (
                    <div key={park.id} className="flex items-center justify-between py-1">
                      <a
                        href={`/tours?park=${park.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs font-bold text-amber-300 hover:text-amber-400"
                      >
                        • {park.name} Safaris
                      </a>
                      <a
                        href={`/parks/${park.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[10px] text-slate-400 hover:text-white underline font-normal"
                      >
                        Guide
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/destinations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-amber-400"
            >
              Destinations
            </a>
            <a
              href="/tours"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-amber-400"
            >
              Tours
            </a>
            <a
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-amber-400"
            >
              Contact Us
            </a>
            {/* Mobile Drawer Account Section */}
            {currentUser ? (
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-bold text-white truncate max-w-[150px]">{currentUser.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    VIP Member
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <button
                    onClick={() => handleOpenAccountWithTab('overview')}
                    className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold text-center hover:text-white"
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => handleOpenAccountWithTab('bookings')}
                    className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold text-center hover:text-white"
                  >
                    Safaris ({currentUser.bookings ? currentUser.bookings.length : 0})
                  </button>
                  <button
                    onClick={() => handleOpenAccountWithTab('settings')}
                    className="py-1.5 px-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold text-center flex items-center justify-center gap-1 hover:bg-amber-500/25"
                  >
                    <Settings className="w-3 h-3 text-amber-400" />
                    Settings
                  </button>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="btn-golden-glow flex-1 py-2 rounded-xl text-xs font-bold text-slate-950 uppercase text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/login?tab=register');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300 uppercase text-center"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Currency Selector */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Select Currency:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(CURRENCY_CONFIGS).map((cfg) => (
                  <button
                    key={cfg.code}
                    onClick={() => handleSelectCurrency(cfg.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeCurrency === cfg.code
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cfg.code} ({cfg.symbol.trim()})
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

