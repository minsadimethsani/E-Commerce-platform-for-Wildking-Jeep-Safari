"use client";

import React, { useState } from "react";
import { BookingDoc } from "@/lib/types/firestore";

interface BookingsManagerProps {
  bookings: BookingDoc[];
  onUpdateStatus: (bookingId: string, newStatus: BookingDoc["status"]) => Promise<void>;
}

export default function BookingsManager({ bookings, onUpdateStatus }: BookingsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingDoc | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.packageTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.park?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (bookingId: string, status: BookingDoc["status"]) => {
    setUpdatingId(bookingId);
    try {
      await onUpdateStatus(bookingId, status);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (err) {
      alert("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📅</span> Safari Bookings & Reservations
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage guest itineraries, pickup locations, and payment status.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search guest name, email, park..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-64"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 focus:outline-none focus:border-amber-400 font-semibold"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950/80 text-emerald-300 font-bold uppercase tracking-wider border-b border-emerald-800/40">
                <th className="py-3.5 px-4">Guest Info</th>
                <th className="py-3.5 px-4">Package & Park</th>
                <th className="py-3.5 px-4">Date & Slot</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => (
                  <tr key={b.id || idx} className="hover:bg-slate-800/50 transition-colors">
                    {/* Guest Info */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{b.customerInfo?.fullName || "Guest"}</p>
                      <p className="text-[11px] text-slate-400">{b.customerInfo?.email}</p>
                      <p className="text-[10px] text-emerald-400/80">{b.customerInfo?.phone}</p>
                    </td>

                    {/* Package & Park */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-emerald-100 max-w-[200px] truncate">{b.packageTitle}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                        {b.park}
                      </span>
                    </td>

                    {/* Date & Slot */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-amber-300">{b.expeditionDate}</p>
                      <p className="text-[11px] text-slate-400">{b.timeSlot}</p>
                    </td>

                    {/* Guests */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {b.guestCount} {b.guestCount === 1 ? "Guest" : "Guests"}
                    </td>

                    {/* Total Price */}
                    <td className="py-3.5 px-4">
                      <p className="font-black text-amber-400">${b.totalAmountUsd}</p>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">{b.paymentStatus || "paid"}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full uppercase ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : b.status === "completed"
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                            : b.status === "pending"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-600/50"
                      >
                        View Details
                      </button>

                      {b.id && (
                        <select
                          disabled={updatingId === b.id}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id!, e.target.value as BookingDoc["status"])}
                          className="px-2 py-1 text-[11px] rounded bg-slate-950 border border-slate-700 text-amber-300 focus:outline-none font-bold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Booking Details</h3>
                <p className="text-[11px] text-amber-400 font-semibold">{selectedBooking.packageTitle}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Guest Name</p>
                  <p className="font-bold text-white text-sm">{selectedBooking.customerInfo?.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Email</p>
                  <p className="font-bold text-emerald-300">{selectedBooking.customerInfo?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Phone</p>
                  <p className="font-semibold text-slate-200">{selectedBooking.customerInfo?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Country</p>
                  <p className="font-semibold text-slate-200">{selectedBooking.customerInfo?.country || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Expedition Date</p>
                  <p className="font-bold text-amber-300">{selectedBooking.expeditionDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Time Slot</p>
                  <p className="font-semibold text-slate-200">{selectedBooking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Guest Count</p>
                  <p className="font-semibold text-slate-200">{selectedBooking.guestCount} Guests</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Amount</p>
                  <p className="font-black text-amber-400 text-sm">${selectedBooking.totalAmountUsd}</p>
                </div>
              </div>

              {selectedBooking.pickupDetails && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Hotel Pickup Location</p>
                  <p className="font-semibold text-emerald-200">
                    {selectedBooking.pickupDetails.hotelName || selectedBooking.pickupDetails.address || "Assigned Park Gates"}
                  </p>
                </div>
              )}

              {selectedBooking.specialRequests && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Special Requests</p>
                  <p className="italic text-slate-300">"{selectedBooking.specialRequests}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
