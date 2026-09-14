"use client";

import React, { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Lock,
  Database,
  Save,
  CheckCircle2,
  Bell,
  Shield,
  DollarSign,
  Compass,
  Sliders,
  Sparkles,
  RefreshCw,
  Clock,
  Phone,
  Building,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { getAdminSession, AdminRole } from "@/lib/admin-auth";
import RolesManager from "./RolesManager";

interface SettingsManagerProps {
  currentRole?: AdminRole;
}

export default function SettingsManager({ currentRole: propRole }: SettingsManagerProps) {
  const session = getAdminSession();
  const currentRole = propRole || session?.role || "super_admin";

  const [activeSettingsTab, setActiveSettingsTab] = useState<"general" | "roles" | "notifications" | "pricing">("general");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [siteName, setSiteName] = useState("Wildking Jeep Safari Sri Lanka");
  const [tagline, setTagline] = useState("Premier 4x4 Wildlife Expeditions & National Park Sanctuaries");
  const [hotline, setHotline] = useState("+94 77 123 4567");
  const [contactEmail, setContactEmail] = useState("concierge@wildking-safari.com");
  const [supportEmail, setSupportEmail] = useState("support@wildking-safari.com");
  
  // Notification & Email Settings
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [enableBookingConfirmationEmails, setEnableBookingConfirmationEmails] = useState(true);
  const [enableCustomerNewsletterAlerts, setEnableCustomerNewsletterAlerts] = useState(true);

  // System & Currency Defaults
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultDepositPercentage, setDefaultDepositPercentage] = useState("30");
  const [cancellationPolicyDays, setCancellationPolicyDays] = useState("2");

  // Maintenance Mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>PLATFORM CONFIGURATIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
            System Settings & Security
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Manage site preferences, staff roles & permissions, notification dispatchers, and deposit policies.
          </p>
        </div>

        {activeSettingsTab !== "roles" && (
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Settings successfully saved and applied across the Wildking platform!</span>
        </div>
      )}

      {/* Settings Category Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSettingsTab("general")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSettingsTab === "general"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>General Platform</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab("roles")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSettingsTab === "roles"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Roles & Access</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab("notifications")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSettingsTab === "notifications"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Emails</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab("pricing")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSettingsTab === "pricing"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payment & Security</span>
        </button>
      </div>

      {/* Tab 1: General Platform */}
      {activeSettingsTab === "general" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>General Platform Identity & Contact</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Site Title
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Header Tagline & Motto
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    24/7 Hotline Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={hotline}
                      onChange={(e) => setHotline(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Support Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Embedded Roles & Access Manager */}
      {activeSettingsTab === "roles" && (
        <RolesManager currentRole={currentRole} />
      )}

      {/* Tab 3: Notifications & Email Settings */}
      {activeSettingsTab === "notifications" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Firestore Email Dispatchers & Trigger Notifications</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">Customer Booking Confirmations</div>
                  <div className="text-[11px] text-slate-400">
                    Automatically trigger email confirmation receipts when customers book safaris.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableBookingConfirmationEmails}
                  onChange={(e) => setEnableBookingConfirmationEmails(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">Newsletter Subscription Alerts</div>
                  <div className="text-[11px] text-slate-400">
                    Queue Firestore trigger emails when visitors subscribe to wildlife alerts in footer.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableCustomerNewsletterAlerts}
                  onChange={(e) => setEnableCustomerNewsletterAlerts(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">Admin Operations Alerts</div>
                  <div className="text-[11px] text-slate-400">
                    Notify admin staff emails when new customer inquiries or high-priority bookings arrive.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableEmailAlerts}
                  onChange={(e) => setEnableEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Payment & Security */}
      {activeSettingsTab === "pricing" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>Expedition & Payment Defaults</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Default Base Currency
                  </label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="AUD">AUD ($ - Australian Dollar)</option>
                    <option value="LKR">LKR (Rs - Sri Lankan Rupee)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Required Deposit (%)
                  </label>
                  <input
                    type="number"
                    value={defaultDepositPercentage}
                    onChange={(e) => setDefaultDepositPercentage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Free Cancellation Guarantee Window
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={cancellationPolicyDays}
                    onChange={(e) => setCancellationPolicyDays(e.target.value)}
                    className="w-24 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-slate-400 font-medium">Days prior to safari departure date</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Security & Maintenance Mode</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Active Admin Session</span>
                  <span className="text-amber-400 font-mono font-bold">{session?.email || "mmethsani@gmail.com"}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Role Privilege:</span>
                  <span className="text-emerald-400 font-extrabold uppercase">{currentRole}</span>
                </div>
              </div>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">System Maintenance Mode</div>
                  <div className="text-[11px] text-slate-400">
                    Temporarily pause public customer bookings while performing backend updates.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
