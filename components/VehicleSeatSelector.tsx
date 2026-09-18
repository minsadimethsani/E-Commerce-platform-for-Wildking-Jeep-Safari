"use client";

import React, { useState, useEffect } from "react";
import { Check, Lock, User, Shield, Compass, Sparkles } from "lucide-react";

export interface SeatInfo {
  id: string; // e.g. 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'
  label: string;
  position: string;
  row: number;
}

export const SAFARI_SEATS: SeatInfo[] = [
  { id: "S1", label: "Seat S1 - Row 1 Left (Front Safari View)", position: "Row 1 - Left", row: 1 },
  { id: "S2", label: "Seat S2 - Row 1 Right (Front Safari View)", position: "Row 1 - Right", row: 1 },
  { id: "S3", label: "Seat S3 - Row 2 Left (Mid Stadium Tier)", position: "Row 2 - Left", row: 2 },
  { id: "S4", label: "Seat S4 - Row 2 Right (Mid Stadium Tier)", position: "Row 2 - Right", row: 2 },
  { id: "S5", label: "Seat S5 - Row 3 Left (Rear High Panoramic)", position: "Row 3 - Left", row: 3 },
  { id: "S6", label: "Seat S6 - Row 3 Right (Rear High Panoramic)", position: "Row 3 - Right", row: 3 },
];

interface VehicleSeatSelectorProps {
  requiredGuests: number;
  selectedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
  date?: string;
  timeSlot?: string;
}

/**
 * Deterministic helper to simulate occupied seats based on date & timeSlot
 */
export function getSimulatedBookedSeats(date?: string, timeSlot?: string): string[] {
  if (!date && !timeSlot) return ["S2"];
  const str = `${date || "2026-09-18"}-${timeSlot || "morning"}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const occupiedIndex = Math.abs(hash) % 5;
  const possibleOccupied = ["S2", "S4", "S5", "S2", "S3"];
  return [possibleOccupied[occupiedIndex]];
}

export const VehicleSeatSelector: React.FC<VehicleSeatSelectorProps> = ({
  requiredGuests,
  selectedSeats,
  onSeatsChange,
  date,
  timeSlot,
}) => {
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  // Determine booked seats based on date/slot
  useEffect(() => {
    const booked = getSimulatedBookedSeats(date, timeSlot);
    setBookedSeats(booked);
  }, [date, timeSlot]);

  // Handle seat click
  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return; // Locked seat

    if (selectedSeats.includes(seatId)) {
      // Unselect seat
      onSeatsChange(selectedSeats.filter((s) => s !== seatId));
    } else {
      // If maximum required seats reached, replace the first selected seat
      if (selectedSeats.length >= requiredGuests) {
        if (requiredGuests === 1) {
          onSeatsChange([seatId]);
        } else {
          // Keep recent selection and append new seat up to requiredGuests
          const updated = [...selectedSeats.slice(1), seatId];
          onSeatsChange(updated);
        }
      } else {
        onSeatsChange([...selectedSeats, seatId]);
      }
    }
  };

  const isSeatSelected = (seatId: string) => selectedSeats.includes(seatId);
  const isSeatBooked = (seatId: string) => bookedSeats.includes(seatId);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#081220] border border-slate-800 text-white space-y-4 shadow-xl">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span>2D Safari 4x4 Vehicle Seat Selection</span>
          </div>
          <p className="text-[11px] text-slate-400 font-light mt-0.5">
            Tap directly on vehicle seats to select viewing positions for your safari.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black shrink-0">
          <span>
            {selectedSeats.length} of {requiredGuests} Seat{requiredGuests > 1 ? "s" : ""} Selected
          </span>
          {selectedSeats.length === Math.min(requiredGuests, 6) && (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </div>
      </div>

      {/* Seat State Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
          <div className="w-3.5 h-3.5 rounded-md bg-emerald-950 border border-emerald-500/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span>Available Seat</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
          <div className="w-3.5 h-3.5 rounded-md bg-amber-500 border border-amber-400 flex items-center justify-center shadow-sm shadow-amber-500/50">
            <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
          </div>
          <span>Your Selected Seat</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <div className="w-3.5 h-3.5 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center">
            <Lock className="w-2 h-2 text-slate-500" />
          </div>
          <span>Already Booked</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <div className="w-3.5 h-3.5 rounded-md bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
            <User className="w-2.5 h-2.5 text-amber-400" />
          </div>
          <span>Crew Cabin</span>
        </div>
      </div>

      {/* Authentic 2D Safari Vehicle Silhouette Layout */}
      <div className="relative mx-auto w-full max-w-[320px] pt-2 pb-4 flex flex-col items-center select-none">
        
        {/* Front Bull-Bar & Winch Bumper */}
        <div className="w-44 h-3.5 bg-gradient-to-r from-slate-800 via-amber-500 to-slate-800 rounded-t-lg border-t-2 border-amber-400 flex items-center justify-center shadow-lg z-20">
          <div className="w-14 h-1 bg-amber-950/80 rounded-full" />
        </div>

        {/* Front Wheels (Left & Right) */}
        <div className="w-[270px] flex justify-between -my-1.5 z-10">
          <div className="w-4 h-11 bg-slate-950 rounded-l-md border-2 border-slate-700 shadow-md flex items-center justify-center">
            <div className="w-1 h-7 bg-slate-800 rounded-full" />
          </div>
          <div className="w-4 h-11 bg-slate-950 rounded-r-md border-2 border-slate-700 shadow-md flex items-center justify-center">
            <div className="w-1 h-7 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* 2D Safari Vehicle Chassis Body */}
        <div className="w-[250px] bg-slate-950 rounded-[44px] border-2 border-slate-700/90 p-3.5 shadow-2xl relative overflow-hidden -mt-6">
          
          {/* Side Mirrors */}
          <div className="absolute top-12 -left-3 w-3 h-5 bg-slate-800 rounded-l-md border border-slate-600 flex items-center justify-center">
            <div className="w-1 h-3 bg-amber-400/40 rounded-full" />
          </div>
          <div className="absolute top-12 -right-3 w-3 h-5 bg-slate-800 rounded-r-md border border-slate-600 flex items-center justify-center">
            <div className="w-1 h-3 bg-amber-400/40 rounded-full" />
          </div>

          {/* Vehicle Hood & Bonnet Grille */}
          <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-[32px] p-2 border-b border-slate-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                WILDKING 4x4 OVERLAND
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent rounded-full" />
          </div>

          {/* Curved Windshield Line */}
          <div className="my-2 h-2.5 bg-gradient-to-r from-slate-900 via-sky-900/50 to-slate-900 rounded-b-2xl border-b border-sky-400/50 flex items-center justify-center">
            <div className="w-20 h-0.5 bg-amber-400/60 rounded-full" />
          </div>

          {/* Interior Vehicle Passenger Cabin */}
          <div className="p-3 rounded-[26px] bg-[#060c15] border border-slate-800/90 space-y-3 relative shadow-inner">

            {/* Front Cockpit Row (Driver & Naturalist Tracker) */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-2 text-center">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-0.5">
                <div className="relative">
                  <div className="w-5.5 h-5.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <User className="w-3 h-3 text-amber-400" />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-300">Driver</span>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-0.5">
                <div className="w-5.5 h-5.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[9px] font-bold text-slate-300">Naturalist</span>
              </div>
            </div>

            {/* Roll Cage / Stadium Partition Header */}
            <div className="text-[9px] font-black uppercase tracking-widest text-amber-400/90 text-center flex items-center justify-center gap-2 pt-0.5">
              <span className="w-4 h-[1px] bg-amber-500/40" />
              <span>PASSENGER SAFARI SEATS</span>
              <span className="w-4 h-[1px] bg-amber-500/40" />
            </div>

            {/* Tier 1: Front Passenger Seats (S1 & S2) */}
            <div className="space-y-1">
              <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
                <span>Row 1 (Front View)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[SAFARI_SEATS[0], SAFARI_SEATS[1]].map((seat) => {
                  const booked = isSeatBooked(seat.id);
                  const selected = isSeatSelected(seat.id);
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={booked}
                      onClick={() => handleSeatClick(seat.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                        booked
                          ? "bg-slate-950 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed"
                          : selected
                          ? "bg-gradient-to-b from-amber-500/30 to-amber-600/40 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.03]"
                          : "bg-slate-900/90 border-emerald-800/60 text-slate-200 hover:border-emerald-500 hover:bg-emerald-950/40"
                      }`}
                    >
                      <div
                        className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                          booked
                            ? "bg-slate-900 border border-slate-800 text-slate-600"
                            : selected
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/50"
                            : "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                        }`}
                      >
                        {booked ? <Lock className="w-3 h-3 text-slate-500" /> : selected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.id}
                      </div>
                      <span className="text-[9px] font-bold tracking-tight text-center">
                        {seat.position}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tier 2: Mid Passenger Seats (S3 & S4) */}
            <div className="space-y-1">
              <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
                <span>Row 2 (Mid Tier)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[SAFARI_SEATS[2], SAFARI_SEATS[3]].map((seat) => {
                  const booked = isSeatBooked(seat.id);
                  const selected = isSeatSelected(seat.id);
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={booked}
                      onClick={() => handleSeatClick(seat.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                        booked
                          ? "bg-slate-950 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed"
                          : selected
                          ? "bg-gradient-to-b from-amber-500/30 to-amber-600/40 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.03]"
                          : "bg-slate-900/90 border-emerald-800/60 text-slate-200 hover:border-emerald-500 hover:bg-emerald-950/40"
                      }`}
                    >
                      <div
                        className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                          booked
                            ? "bg-slate-900 border border-slate-800 text-slate-600"
                            : selected
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/50"
                            : "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                        }`}
                      >
                        {booked ? <Lock className="w-3 h-3 text-slate-500" /> : selected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.id}
                      </div>
                      <span className="text-[9px] font-bold tracking-tight text-center">
                        {seat.position}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tier 3: High Panoramic Seats (S5 & S6) */}
            <div className="space-y-1">
              <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
                <span>Row 3 (Rear Panoramic)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[SAFARI_SEATS[4], SAFARI_SEATS[5]].map((seat) => {
                  const booked = isSeatBooked(seat.id);
                  const selected = isSeatSelected(seat.id);
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={booked}
                      onClick={() => handleSeatClick(seat.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                        booked
                          ? "bg-slate-950 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed"
                          : selected
                          ? "bg-gradient-to-b from-amber-500/30 to-amber-600/40 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.03]"
                          : "bg-slate-900/90 border-emerald-800/60 text-slate-200 hover:border-emerald-500 hover:bg-emerald-950/40"
                      }`}
                    >
                      <div
                        className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                          booked
                            ? "bg-slate-900 border border-slate-800 text-slate-600"
                            : selected
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/50"
                            : "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                        }`}
                      >
                        {booked ? <Lock className="w-3 h-3 text-slate-500" /> : selected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.id}
                      </div>
                      <span className="text-[9px] font-bold tracking-tight text-center">
                        {seat.position}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Rear Wheels (Left & Right) */}
        <div className="w-[270px] flex justify-between -mt-9 z-10">
          <div className="w-4 h-11 bg-slate-950 rounded-l-md border-2 border-slate-700 shadow-md flex items-center justify-center">
            <div className="w-1 h-7 bg-slate-800 rounded-full" />
          </div>
          <div className="w-4 h-11 bg-slate-950 rounded-r-md border-2 border-slate-700 shadow-md flex items-center justify-center">
            <div className="w-1 h-7 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Tailgate & Rear Mounted Spare Wheel */}
        <div className="flex flex-col items-center -mt-3.5 z-20">
          <div className="w-11 h-11 rounded-full bg-slate-950 border-2 border-slate-600 shadow-xl flex items-center justify-center text-[8.5px] font-black text-amber-400 border-dashed">
            SPARE
          </div>
          <div className="w-36 h-2 bg-slate-800 rounded-b-md border-b border-slate-700" />
        </div>

      </div>

      {/* Selected Seats Details Summary */}
      {selectedSeats.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
          <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Reserved Seating Selection:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedSeats.map((sid) => {
              const seatObj = SAFARI_SEATS.find((s) => s.id === sid);
              return (
                <span
                  key={sid}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-1"
                >
                  <span>{sid}</span>
                  <span className="font-medium opacity-80">({seatObj?.position})</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
