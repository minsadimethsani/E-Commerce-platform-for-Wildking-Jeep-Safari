"use client";

import React, { useState } from "react";
import { DatabaseUserRecord } from "@/lib/firestore-service";
import { Users, Search, ShieldCheck, Mail, Phone, Calendar, Sparkles, X, Eye, Ticket, ArrowRight } from "lucide-react";

interface CustomersManagerProps {
  customers: DatabaseUserRecord[];
}

export default function CustomersManager({ customers }: CustomersManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<DatabaseUserRecord | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "vip" && c.membershipStatus?.toLowerCase().includes("vip")) ||
      (filterStatus === "active_bookings" && c.bookings && c.bookings.length > 0);

    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.membershipStatus?.toLowerCase().includes("vip")).length;
  const totalBookingsCount = customers.reduce((acc, c) => acc + (c.bookings ? c.bookings.length : 0), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Metrics Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Registered Guests</span>
            <span className="text-2xl font-black text-white">{totalCustomers} Members</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">VIP Tier Members</span>
            <span className="text-2xl font-black text-amber-400">{vipCount} Accounts</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Total Guest Safaris</span>
            <span className="text-2xl font-black text-emerald-300">{totalBookingsCount} Expeditions</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Ticket className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" /> Customer Account Profiles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View registered expedition members, contact details, membership tiers, and safari booking history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search member name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
          >
            <option value="all">All Members ({customers.length})</option>
            <option value="vip">VIP Members</option>
            <option value="active_bookings">With Active Safaris</option>
          </select>
        </div>
      </div>

      {/* Customer Accounts Table */}
      <div className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950/80 text-emerald-300 font-bold uppercase tracking-wider border-b border-emerald-800/40">
                <th className="py-3.5 px-4">Member Info</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Membership Status</th>
                <th className="py-3.5 px-4">Safaris Booked</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No customer accounts found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.uid} className="hover:bg-slate-800/50 transition-colors">
                    {/* Member Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shrink-0">
                          {cust.name ? cust.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{cust.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">UID: {cust.uid.slice(0, 14)}...</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>{cust.email}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{cust.phone}</span>
                        </p>
                      </div>
                    </td>

                    {/* Membership Badge */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{cust.membershipStatus || "Verified VIP"}</span>
                      </span>
                    </td>

                    {/* Safaris Booked */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                        {cust.bookings ? cust.bookings.length : 0} Safaris
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(cust.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0b1320] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-400">{selectedCustomer.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">WhatsApp Contact</span>
                <span className="text-white font-bold">{selectedCustomer.phone}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Account Status</span>
                <span className="text-amber-400 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {selectedCustomer.membershipStatus || "VIP Member"}
                </span>
              </div>
            </div>

            {/* Booking History Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>Expedition Bookings ({selectedCustomer.bookings ? selectedCustomer.bookings.length : 0})</span>
              </h4>

              {!selectedCustomer.bookings || selectedCustomer.bookings.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 text-xs italic">
                  No safari expeditions booked yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedCustomer.bookings.map((b, idx) => (
                    <div key={b.id || idx} className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-800/40 text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {b.id}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {b.status || "Confirmed"}
                        </span>
                      </div>
                      <p className="font-bold text-white text-xs">{b.packageName}</p>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>📅 {b.date}</span>
                        <span>👥 {b.guests} Guests</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3 border-t border-slate-800">
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={`mailto:${selectedCustomer.email}?subject=Wildking Safari Expedition Concierge`}
                className="py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Send VIP Email</span>
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
