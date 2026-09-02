"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin, isAdminAuthenticated, DEFAULT_ADMIN_CREDENTIALS } from "@/lib/admin-auth";
import { Compass, Key, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
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
        router.push("/admin");
      } else {
        setError(res.error || "Authentication failed.");
      }
    }, 400);
  };

  const handleFillDemoCredentials = () => {
    setEmail(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-xl shadow-amber-500/20 mb-1">
            <Compass className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Wildking <span className="text-amber-400">Admin</span>
          </h1>
          <p className="text-xs text-emerald-300 font-semibold tracking-wide uppercase">
            Executive Portal & Operations Control
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-emerald-800/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Default Admin Quick-Fill Banner */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Default Admin Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
            <div className="text-slate-300 font-mono text-[11px] space-y-0.5">
              <p><span className="text-slate-400">Username:</span> {DEFAULT_ADMIN_CREDENTIALS.email}</p>
              <p><span className="text-slate-400">Password:</span> {DEFAULT_ADMIN_CREDENTIALS.password}</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold animate-shake flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                Username / Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mmethsani@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                Admin Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all mt-2"
            >
              {isLoading ? "Authenticating..." : "Sign In to Admin Portal →"}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link
              href="/"
              className="text-xs font-bold text-slate-400 hover:text-emerald-300 transition-colors"
            >
              ← Return to Main Wildking Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
