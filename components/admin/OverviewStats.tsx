"use client";

import React, { useState } from "react";
import { BookingDoc, InquiryDoc } from "@/lib/types/firestore";
import { AdminTab } from "./AdminSidebar";
import {
  Compass,
  Database,
  RefreshCw,
  DollarSign,
  CheckCircle,
  Mail,
  Truck,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface OverviewStatsProps {
  bookings: BookingDoc[];
  inquiries: InquiryDoc[];
  onTriggerSeed: () => Promise<void>;
  isSeeding: boolean;
  setActiveTab: (tab: AdminTab) => void;
}

export default function OverviewStats({
  bookings,
  inquiries,
  onTriggerSeed,
  isSeeding,
  setActiveTab,
}: OverviewStatsProps) {
  const [seedStatusMessage, setSeedStatusMessage] = useState<string | null>(null);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmountUsd || 0), 0);
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const handleSeedClick = async () => {
    setSeedStatusMessage(null);
    try {
      await onTriggerSeed();
      setSeedStatusMessage("Firestore database successfully populated with packages, fleet & reviews!");
    } catch (err: any) {
      setSeedStatusMessage(`Seeding failed: ${err.message || err}`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Quick Sync */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 p-6 rounded-2xl border border-emerald-700/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" />
            <span>Executive Safari Dashboard</span>
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1">
            Real-time reservation metrics, guest inquiries, and Firestore database management.
          </p>
        </div>

        <button
          onClick={handleSeedClick}
          disabled={isSeeding}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
        >
          {isSeeding ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Seeding Database...</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>Sync / Seed Firestore Data</span>
            </>
          )}
        </button>
      </div>

      {seedStatusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-100 text-sm font-semibold animate-fade-in">
          {seedStatusMessage}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-black text-white mt-1">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">From {bookings.length} overall safari bookings</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Confirmed Safaris</p>
              <h3 className="text-3xl font-black text-white mt-1">{confirmedBookings}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl">
              <CheckCircle className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">{pendingBookings} pending approval</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Active Inquiries</p>
              <h3 className="text-3xl font-black text-white mt-1">{inquiries.length}</h3>
            </div>
            <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl">
              <Mail className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">{newInquiries} new unread requests</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Jeep Fleet Ready</p>
              <h3 className="text-3xl font-black text-white mt-1">3</h3>
            </div>
            <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-xl">
              <Truck className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Land Cruisers & Defenders active</p>
        </div>
      </div>

      {/* Activity Streams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Stream */}
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Recent Bookings
            </h3>
            <button
              onClick={() => setActiveTab("bookings")}
              className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              View All ({bookings.length}) →
            </button>
          </div>

          {bookings.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-4">No safari bookings recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((b, idx) => (
                <div
                  key={b.id || idx}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-emerald-200">{b.customerInfo.fullName}</p>
                    <p className="text-xs text-slate-400">
                      {b.packageTitle} • <span className="text-amber-300">{b.expeditionDate}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-white">${b.totalAmountUsd}</p>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        b.status === "confirmed" || b.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : b.status === "pending"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries Stream */}
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" /> Guest Inquiries
            </h3>
            <button
              onClick={() => setActiveTab("inquiries")}
              className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              View All ({inquiries.length}) →
            </button>
          </div>

          {inquiries.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-4">No guest inquiries submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 4).map((inq, idx) => (
                <div
                  key={inq.id || idx}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-white">{inq.name}</p>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        inq.status === "new"
                          ? "bg-amber-500/20 text-amber-300"
                          : inq.status === "in_progress"
                          ? "bg-teal-500/20 text-teal-300"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{inq.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{inq.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
