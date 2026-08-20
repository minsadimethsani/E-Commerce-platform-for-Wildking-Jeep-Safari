'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, ChevronDown, Sparkles, User, MapPin, ArrowRight, Trees } from 'lucide-react';
import { UserProfile } from './AccountModal';
import { PARK_DESTINATIONS } from '../data/packages';

interface NavbarProps {
  currency: 'USD' | 'EUR' | 'LKR';
  onCurrencyChange: (curr: 'USD' | 'EUR' | 'LKR') => void;
  onOpenBooking: () => void;
  user: UserProfile | null;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  onOpenBooking,
  user,
  onOpenAccount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileParksOpen, setIsMobileParksOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'glass-nav-dark py-3.5 border-b border-amber-500/20 shadow-2xl'
          : 'bg-gradient-to-b from-[#050b14]/90 via-[#050b14]/60 to-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo - Left */}
          <a href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090f1d] rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-amber-400 stroke-[2.2] transform group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-widest font-serif text-white uppercase drop-shadow-md">
                  WILDKING
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links - Ordered: Home, Safari Parks (Mega Menu), Destinations, Tours, Contact Us */}
          <nav className="hidden lg:flex items-center gap-7">
            <a
              href="/"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </a>

            {/* Safari Parks Mega Menu Trigger */}
            <div
              className="relative py-1"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 py-1"
              >
                <span>Safari Parks</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <a
              href="/#destinations"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Destinations
            </a>
            <a
              href="/tours"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Tours
            </a>
            <a
              href="/contact"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Contact Us
            </a>
          </nav>

          {/* Right Action Bar (Currency, User Account & "Book Now" Button) */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* User Account Icon Button */}
            <button
              onClick={onOpenAccount}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                user
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-900/80 border-amber-500/30 text-slate-200 hover:bg-slate-800 hover:text-amber-400'
              }`}
              title={user ? `Account: ${user.name}` : 'Sign In / Account'}
            >
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-amber-400" />
                {user && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>
              <span className="hidden xl:inline max-w-[100px] truncate">
                {user ? user.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>{currency === 'USD' ? 'USD ($)' : currency === 'EUR' ? 'EUR (€)' : 'LKR (Rs)'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0b1320] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                  <button
                    onClick={() => {
                      onCurrencyChange('USD');
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-amber-500/10 transition-colors ${currency === 'USD' ? 'text-amber-400 font-bold bg-amber-500/15' : 'text-slate-300'
                      }`}
                  >
                    <span>USD ($)</span>
                    <span className="text-[10px] text-slate-400">US Dollar</span>
                  </button>
                  <button
                    onClick={() => {
                      onCurrencyChange('EUR');
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-amber-500/10 transition-colors ${currency === 'EUR' ? 'text-amber-400 font-bold bg-amber-500/15' : 'text-slate-300'
                      }`}
                  >
                    <span>EUR (€)</span>
                    <span className="text-[10px] text-slate-400">Euro</span>
                  </button>
                  <button
                    onClick={() => {
                      onCurrencyChange('LKR');
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-amber-500/10 transition-colors ${currency === 'LKR' ? 'text-amber-400 font-bold bg-amber-500/15' : 'text-slate-300'
                      }`}
                  >
                    <span>LKR (Rs)</span>
                    <span className="text-[10px] text-slate-400">Sri Lanka</span>
                  </button>
                </div>
              )}
            </div>

            {/* Top-Right "Book Now" Button */}
            <button
              onClick={onOpenBooking}
              className="btn-golden-glow relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 rounded-full transition-all duration-300 group overflow-hidden"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-slate-950 fill-slate-950 group-hover:rotate-12 transition-transform" />
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2.5">
            <button
              onClick={onOpenAccount}
              className={`p-2 rounded-xl border transition-all ${
                user
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900/80 border-amber-500/30 text-amber-400'
              }`}
              title="Account"
            >
              <User className="w-5 h-5 text-amber-400" />
            </button>
            <button
              onClick={() => onCurrencyChange(currency === 'USD' ? 'EUR' : currency === 'EUR' ? 'LKR' : 'USD')}
              className="px-2.5 py-1.5 text-[11px] font-bold text-amber-400 rounded-lg bg-slate-900/80 border border-amber-500/30"
            >
              {currency}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-amber-400 rounded-xl bg-slate-900/80 border border-amber-500/20"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Safari Parks Mega Menu Dropdown Container */}
      {isMegaMenuOpen && (
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          className="absolute top-full left-0 right-0 w-full bg-[#08101d]/95 backdrop-blur-2xl border-b border-amber-500/30 shadow-2xl py-8 px-4 sm:px-6 lg:px-8 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-0.5">
                  NATIONAL SAFARI PARKS CORRIDOR
                </span>
                <h4 className="text-lg font-bold text-white font-serif">
                  Sri Lanka Wildlife Sanctuaries & Corridors
                </h4>
              </div>
              <a
                href="/#destinations"
                onClick={() => setIsMegaMenuOpen(false)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>View All Parks & Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 4 Column Parks Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PARK_DESTINATIONS.map((park) => (
                <a
                  key={park.id}
                  href={`/tours?park=${park.id}`}
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="group/park p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="relative h-32 w-full rounded-xl overflow-hidden">
                    <img
                      src={park.image}
                      alt={park.name}
                      className="w-full h-full object-cover group-hover/park:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-md">
                      {park.id === 'yala' ? '98.5% Leopard Sighting' : park.id === 'udawalawe' ? '100+ Elephant Herd' : park.id === 'wilpattu' ? 'Ancient Willus' : '300+ Elephant Gathering'}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-white group-hover/park:text-amber-400 transition-colors flex items-center justify-between">
                      <span>{park.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/park:text-amber-400 group-hover/park:translate-x-0.5 transition-all" />
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-light">
                      {park.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-amber-300">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {park.id.toUpperCase()} SECTOR
                    </span>
                    <span className="text-emerald-400">Explore Safaris</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  {PARK_DESTINATIONS.map((park) => (
                    <a
                      key={park.id}
                      href={`/tours?park=${park.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xs font-semibold text-amber-300 hover:text-amber-400 py-1"
                    >
                      • {park.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/#destinations"
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
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAccount();
              }}
              className="text-sm font-bold uppercase tracking-wider text-amber-400 text-left flex items-center gap-2 pt-2 border-t border-slate-800"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>{user ? `Account (${user.name})` : 'Sign In / Account'}</span>
            </button>
          </nav>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn-golden-glow w-full py-3 font-extrabold uppercase text-xs tracking-wider text-slate-950 rounded-xl text-center shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

