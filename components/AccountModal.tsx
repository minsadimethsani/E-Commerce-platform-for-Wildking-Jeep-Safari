'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  LogOut,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  bookings: {
    id: string;
    packageName: string;
    date: string;
    guests: number;
    totalPrice: number;
    status: 'Confirmed' | 'Completed' | 'Pending';
  }[];
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenBooking?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onOpenBooking
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [profileTab, setProfileTab] = useState<'overview' | 'bookings'>('overview');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Create or login user
    onLogin({
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: '+94 77 987 6543',
      bookings: [
        {
          id: 'WK-2026-894',
          packageName: 'Signature Sunset Safari - Yala Sector',
          date: '2026-08-20',
          guests: 2,
          totalPrice: 2500,
          status: 'Confirmed'
        }
      ]
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regName) return;

    onLogin({
      name: regName,
      email: regEmail,
      phone: regPhone || '+94 77 123 4567',
      bookings: []
    });
  };

  const handleDemoSignIn = () => {
    onLogin({
      name: 'Alexander Wright',
      email: 'alexander.w@wildking-safari.com',
      phone: '+1 (555) 234-5678',
      bookings: [
        {
          id: 'WK-2026-102',
          packageName: 'Yala Leopard Dawn Patrol & Sunset Expedition',
          date: '2026-08-22',
          guests: 2,
          totalPrice: 2500,
          status: 'Confirmed'
        },
        {
          id: 'WK-2025-481',
          packageName: 'Udawalawe Elephant Sanctuary VIP Safari',
          date: '2025-11-14',
          guests: 4,
          totalPrice: 3920,
          status: 'Completed'
        }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Dark Frosted Glass Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Main Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#0b1320] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-white">
        
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070e18]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                {user ? 'Expedition Member Portal' : 'Wildking Account'}
              </h3>
              <p className="text-[11px] text-amber-400/80">
                {user ? `Logged in as ${user.name}` : 'Manage your luxury 4x4 safari bookings'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6">
          {user ? (
            /* ================= LOGGED IN USER PROFILE ================= */
            <div className="space-y-6">
              {/* User Profile Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg border-2 border-amber-400">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      {user.name}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        VIP Member
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <p className="text-[11px] text-amber-400/90 mt-0.5">{user.phone}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Navigation Tabs (Overview vs Bookings) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setProfileTab('overview')}
                  className={`py-2 rounded-lg transition-all ${
                    profileTab === 'overview'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Account Overview
                </button>
                <button
                  onClick={() => setProfileTab('bookings')}
                  className={`py-2 rounded-lg transition-all ${
                    profileTab === 'bookings'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Safaris ({user.bookings.length})
                </button>
              </div>

              {profileTab === 'overview' ? (
                /* Overview Tab */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1 font-medium">Expeditions Booked</span>
                      <span className="text-xl font-extrabold text-amber-400">{user.bookings.length} Tours</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1 font-medium">Membership Status</span>
                      <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Guaranteed
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Member Concierge Benefits</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Enjoy complimentary hotel transfers in Yala & Udawalawe, priority Land Cruiser seating reservations, and 24/7 direct WhatsApp naturalist support.
                    </p>
                  </div>

                  {onOpenBooking && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking();
                      }}
                      className="btn-golden-glow w-full py-3 rounded-xl font-bold uppercase text-xs tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Book A New Safari</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  )}
                </div>
              ) : (
                /* Bookings Tab */
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {user.bookings.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No safari expeditions booked yet.
                    </div>
                  ) : (
                    user.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            {booking.id}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <h5 className="font-bold text-sm text-white">{booking.packageName}</h5>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-800/60">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>Date: {booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Ticket className="w-3.5 h-3.5 text-amber-400" />
                            <span>Guests: {booking.guests} People</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-400">Total Paid</span>
                          <span className="font-extrabold text-amber-300 text-sm">${booking.totalPrice} USD</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ================= NOT LOGGED IN (SIGN IN / REGISTER) ================= */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {activeTab === 'login' ? (
                /* Sign In Form */
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="guest@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-golden-glow w-full py-3 rounded-xl font-extrabold uppercase text-xs tracking-wider text-slate-950 shadow-lg"
                  >
                    Sign In
                  </button>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block mb-2">Want to try instant demo login?</span>
                    <button
                      type="button"
                      onClick={handleDemoSignIn}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>One-Click Demo VIP Account</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+94 77 123 4567"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="Create strong password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-golden-glow w-full py-3 rounded-xl font-extrabold uppercase text-xs tracking-wider text-slate-950 shadow-lg mt-2"
                  >
                    Create Account & Continue
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
