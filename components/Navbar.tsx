'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, ChevronDown, Sparkles, User, MapPin, ArrowRight, Trees, Search } from 'lucide-react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tours?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'glass-nav-dark py-3.5 border-b border-amber-500/20 shadow-2xl'
          : 'bg-gradient-to-b from-[#050b14]/90 via-[#050b14]/60 to-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pull-down">
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

            {/* Safari Parks Mega Menu Trigger & Small Width Dropdown */}
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

              {/* Compact Small Width Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-[520px] bg-[#08101d]/95 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                          NATIONAL SAFARI PARKS
                        </span>
                        <h4 className="text-sm font-bold text-white font-serif">
                          Wildlife Sanctuaries & Corridors
                        </h4>
                      </div>
                      <a
                        href="/destinations"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <span>View All Parks</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>

                    {/* 2-Column Compact Grid of Parks */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {PARK_DESTINATIONS.map((park) => (
                        <a
                          key={park.id}
                          href={`/parks/${park.id}`}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="group/park p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex items-center gap-3"
                        >
                          <div className="relative h-14 w-16 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={park.image}
                              alt={park.name}
                              className="w-full h-full object-cover group-hover/park:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="overflow-hidden">
                            <h5 className="text-xs font-bold text-white group-hover/park:text-amber-400 transition-colors truncate">
                              {park.name}
                            </h5>
                            <p className="text-[10px] text-amber-300 font-semibold truncate mt-0.5">
                              {park.id === 'yala' ? '98.5% Leopard Rate' : park.id === 'udawalawe' ? '100+ Elephants' : park.id === 'wilpattu' ? 'Ancient Willus' : 'Elephant Gathering'}
                            </p>
                            <span className="text-[9px] text-slate-400 block truncate">
                              {park.tagline}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/destinations"
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

          {/* Right Action Bar (Search Lens, User Icon Only & "Book Now" Button) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Search Lens Icon Button with Dropdown Bar */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-400 hover:bg-slate-800 hover:text-amber-300 transition-all shadow-sm flex items-center justify-center"
                title="Search Safaris & Parks"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-amber-400" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0b1320] border border-amber-500/40 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <Search className="w-4 h-4 text-amber-400 absolute left-3" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search safaris, parks, wildlife..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* User Account Icon Button (Icon Only - No Text) */}
            <button
              onClick={onOpenAccount}
              className={`p-2 rounded-xl border text-xs font-bold transition-all shadow-sm flex items-center justify-center relative ${
                user
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-900/80 border-amber-500/30 text-slate-200 hover:bg-slate-800 hover:text-amber-400'
              }`}
              title={user ? `Account: ${user.name}` : 'Sign In / Account'}
              aria-label="User Account"
            >
              <div className="relative flex items-center justify-center">
                <User className="w-4 h-4 text-amber-400" />
                {user && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>
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
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-400"
              title="Search"
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>

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
                      href={`/parks/${park.id}`}
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
        </div>
      )}
    </header>
  );
};

