"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin, isAdminAuthenticated, ROLE_LABELS } from "@/lib/admin-auth";
import { useToast } from "@/context/ToastContext";
import {
  Compass,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const FEATURED_IMAGE = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);

      if (res.success) {
        showSuccess("Admin Access Granted", `Welcome back! Role: ${ROLE_LABELS[res.user?.role || 'super_admin']}`);
        router.push("/admin");
      } else {
        const errMsg = res.error || "Authentication failed.";
        setError(errMsg);
        showError("Admin Sign In Failed", errMsg);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b1320] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* LEFT COLUMN: Clean Safari Featured Visual Image (50% Width, Matches User Front Account Modal) */}
      <div className="hidden md:block md:w-1/2 lg:w-1/2 h-screen relative overflow-hidden bg-slate-950 border-r border-slate-800/80 shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${FEATURED_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-[#0b1320]" />
      </div>

      {/* RIGHT COLUMN: Authentication Form (50% Width, Matches User Front Account Modal Layout) */}
      <div className="w-full md:w-1/2 lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-20 overflow-y-auto bg-[#0b1320] relative z-10">
        
        {/* Top Navigation / Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Compass className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wider text-white font-serif">
                  Wildking Jeep Safari
                </h3>
                <p className="text-xs text-amber-400/90 font-medium">
                  Executive Admin Portal
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Main Site</span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="space-y-6 max-w-md mx-auto md:mx-0">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black font-serif text-white uppercase tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-xs text-slate-400 font-light">
                Please enter your authorized administrative credentials to access the management portal.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@wildking-safari.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-golden-glow w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-wider text-slate-950 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-light">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Terminal</span>
          </div>
          <span>© {new Date().getFullYear()} Wildking Safari</span>
        </div>

      </div>
    </div>
  );
}
