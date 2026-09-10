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
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName, validatePhone, validateConfirmPassword } from '../lib/validation';

export type { UserProfile };

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onLogin?: (user: UserProfile) => void;
  onLogout?: () => void;
  onOpenBooking?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const { user: authUser, login, register, logout } = useAuth();
  const user = authUser;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [profileTab, setProfileTab] = useState<'overview' | 'bookings'>('overview');

  // Login form state & errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginBannerError, setLoginBannerError] = useState<string | null>(null);

  // Register form state & errors
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regBannerError, setRegBannerError] = useState<string | null>(null);

  // Registration success popup & loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegSuccess, setShowRegSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setShowRegSuccess(false);
    onClose();
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    setLoginBannerError(null);

    const errors: Record<string, string> = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;

    const passErr = validatePassword(password, 6);
    if (passErr) errors.password = passErr;

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setLoginBannerError(res.error || 'Invalid credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrors({});
    setRegBannerError(null);

    const errors: Record<string, string> = {};
    const nameErr = validateName(regName);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(regEmail);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validatePhone(regPhone);
    if (phoneErr) errors.phone = phoneErr;

    const passErr = validatePassword(regPassword, 6);
    if (passErr) errors.password = passErr;

    const confirmErr = validateConfirmPassword(regPassword, regConfirmPassword);
    if (confirmErr) errors.confirmPassword = confirmErr;

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(regName, regEmail, regPhone, regPassword);
      if (!res.success) {
        setRegBannerError(res.error || 'Failed to register account.');
      } else {
        setRegisteredName(regName);
        setShowRegSuccess(true);
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegConfirmPassword('');
      }
    } catch (err) {
      setRegBannerError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoginErrors({});
    setLoginBannerError(null);
    await login('alexander.w@wildking-safari.com', 'SafariPass123#');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Dark Frosted Glass Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={handleCloseModal} 
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
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6">
          {user ? (
            /* Logged In Member Profile Layout */
            <div className="space-y-6">
              
              {/* Profile Card Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif">{user.name}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <p className="text-[11px] text-amber-400/90 mt-0.5">{user.phone}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
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
                  My Safaris ({user.bookings ? user.bookings.length : 0})
                </button>
              </div>

              {profileTab === 'overview' ? (
                /* Overview Tab */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1 font-medium">Expeditions Booked</span>
                      <span className="text-xl font-extrabold text-amber-400">{user.bookings ? user.bookings.length : 0} Tours</span>
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
                  {(!user.bookings || user.bookings.length === 0) ? (
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

                        <h5 className="font-bold text-white text-sm font-serif line-clamp-1">
                          {booking.packageName}
                        </h5>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              {booking.date}
                            </span>
                            <span>{booking.guests} Guests</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Authentication Tab Switcher (Sign In vs Register) */
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setLoginErrors({});
                    setLoginBannerError(null);
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Member Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setRegErrors({});
                    setRegBannerError(null);
                    setRegConfirmPassword('');
                  }}
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
                  {loginBannerError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{loginBannerError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="guest@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          loginErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{loginErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          loginErrors.password ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {loginErrors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{loginErrors.password}</p>
                    )}
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
                  {regBannerError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{regBannerError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (regErrors.name) setRegErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          regErrors.name ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {regErrors.name && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{regErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (regErrors.email) setRegErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          regErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {regErrors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{regErrors.email}</p>
                    )}
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
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          if (regErrors.phone) setRegErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          regErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {regErrors.phone && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{regErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        placeholder="Create strong password (min 6 chars)"
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (regErrors.password) setRegErrors((prev) => ({ ...prev, password: '' }));
                          if (regErrors.confirmPassword) setRegErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          regErrors.password ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {regErrors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{regErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        placeholder="Re-enter your password"
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (regErrors.confirmPassword) setRegErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                          regErrors.confirmPassword ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {regErrors.confirmPassword && (
                      <p className="text-[11px] text-rose-400 mt-1 font-semibold">{regErrors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-golden-glow w-full py-3 rounded-xl font-extrabold uppercase text-xs tracking-wider text-slate-950 shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account & Continue</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Account Created Success Popup Modal */}
      {showRegSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0b1320] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-emerald-950/60 transform animate-in zoom-in-95 duration-200 text-white">
            
            <button
              onClick={() => setShowRegSuccess(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Badge */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-slate-950 stroke-[2.5]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide font-serif mb-2">
              Account Created!
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Welcome to Wildking Safari, <span className="font-bold text-amber-400">{registeredName || user?.name}</span>! Your expedition account has been created successfully.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Account Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active VIP Member
                </span>
              </div>
              {user?.email && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Email</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[200px]">{user.email}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-semibold text-slate-200">{user.phone}</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-6 flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Priority Land Cruiser booking & naturalist concierge unlocked!</span>
            </div>

            <button
              onClick={() => setShowRegSuccess(false)}
              className="btn-golden-glow w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-wider text-slate-950 shadow-xl transition-all hover:scale-[1.02]"
            >
              Explore Member Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
