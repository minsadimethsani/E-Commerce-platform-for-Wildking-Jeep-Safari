'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  LogOut,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Compass,
  Star,
  Award,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateEmail, validatePassword, validateName, validatePhone, validateConfirmPassword } from '../../lib/validation';

const FEATURED_IMAGE = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200";

function UserLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams ? searchParams.get('redirect') || '/safari' : '/safari';
  const { user, login, register, logout: authLogout } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginBannerError, setLoginBannerError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regBannerError, setRegBannerError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      showWarning('Form Validation Error', 'Please check your login credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setLoginBannerError(res.error || 'Invalid credentials.');
        showError('Sign In Failed', res.error || 'Invalid email or password.');
      } else {
        showSuccess('Welcome Back!', `Signed in as ${email}`);
        router.push(redirectTarget);
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
      showWarning('Form Validation Error', 'Please fix errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(regName, regEmail, regPhone, regPassword);
      if (!res.success) {
        setRegBannerError(res.error || 'Failed to register account.');
        showError('Registration Failed', res.error || 'Could not create account.');
      } else {
        showSuccess('Account Created!', `Welcome to Wildking Safari, ${regName}!`);
        router.push(redirectTarget);
      }
    } catch (err) {
      setRegBannerError('Failed to create account.');
      showError('Registration Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSubmitting(true);
    try {
      const res = await login('alexander.w@wildking-safari.com', 'SafariPass123#');
      if (res.success) {
        showSuccess('Demo Account Loaded', 'Welcome back, Alexander!');
        router.push(redirectTarget);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0b1320] text-white flex flex-col md:flex-row overflow-hidden relative font-sans">
      {/* Ambient Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* LEFT COLUMN: Clean Enlarged Visual Image (50% Width, No Overlay Text) */}
      <div className="hidden md:block md:w-1/2 lg:w-1/2 h-screen relative overflow-hidden bg-slate-950 border-r border-slate-800/80 shrink-0">
        {/* Full Viewport High-Res Safari Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${FEATURED_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0b1320]" />
      </div>

      {/* RIGHT COLUMN: Interactive Authentication Portal (50% Width) */}
      <div className="w-full md:w-1/2 lg:w-1/2 h-screen flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-20 overflow-y-auto bg-[#0b1320] relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <User className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
                {user ? 'Expedition Member Portal' : 'Wildking Jeep Safari'}
              </h2>
              <p className="text-xs text-amber-400/90 font-medium">
                {user ? `Logged in as ${user.name}` : 'Sign in to access your safari bookings'}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Center Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">

          {activeTab === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {loginBannerError && (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{loginBannerError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{loginErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{loginErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-golden-glow w-full py-4 rounded-2xl font-black uppercase text-xs tracking-wider text-slate-950 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <div className="text-center pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regBannerError && (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{regBannerError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-amber-400 absolute left-4 top-3" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                  />
                </div>
                {regErrors.name && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{regErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400 absolute left-4 top-3" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                  />
                </div>
                {regErrors.email && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{regErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-400 absolute left-4 top-3" />
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                  />
                </div>
                {regErrors.phone && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{regErrors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-amber-400 absolute left-4 top-3" />
                    <input
                      type="password"
                      placeholder="Min 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-11 pr-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                    />
                  </div>
                  {regErrors.password && (
                    <p className="text-[11px] text-rose-400 mt-1 font-medium">{regErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-amber-400 absolute left-4 top-3" />
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                    />
                  </div>
                  {regErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1 font-medium">{regErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-golden-glow w-full py-4 rounded-2xl font-black uppercase text-xs tracking-wider text-slate-950 shadow-xl flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
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

              <div className="text-center pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-slate-800/60 text-center text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Wildking Jeep Safari Sri Lanka. All Rights Reserved.</p>
        </div>

      </div>
    </main>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060c15] flex items-center justify-center text-amber-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <UserLoginPageContent />
    </Suspense>
  );
}
