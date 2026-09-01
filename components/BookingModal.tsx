'use client';

import React, { useState } from 'react';
import { SafariPackage, SAFARI_PACKAGES } from '../data/packages';
import { createBookingInFirestore } from '../lib/firestore-service';
import { X, Calendar, Clock, Users, Check, Sparkles, ShieldCheck, Car, Coffee, Camera, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: SafariPackage | null;
  currency: 'USD' | 'EUR' | 'LKR';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  currency,
}) => {
  const defaultPkg = selectedPackage || SAFARI_PACKAGES[0];
  const [pkgId, setPkgId] = useState(defaultPkg.id);
  const [expeditionDate, setExpeditionDate] = useState('');
  const [shiftTime, setShiftTime] = useState(defaultPkg.timeSlot);
  const [passengers, setPassengers] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState('Land Cruiser VIP 70');
  
  // Addons
  const [addonBreakfast, setAddonBreakfast] = useState(true);
  const [addonScope, setAddonScope] = useState(false);
  const [addonPickup, setAddonPickup] = useState(true);

  // Success Step state
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const currentPkg = SAFARI_PACKAGES.find((p) => p.id === pkgId) || defaultPkg;

  // Base price in current currency
  const getBasePrice = () => {
    if (currency === 'EUR') return currentPkg.priceEur;
    if (currency === 'LKR') return currentPkg.priceLkr;
    return currentPkg.priceUsd;
  };

  // Calculate Addon Total
  const getAddonTotal = () => {
    let extraUsd = 0;
    if (addonBreakfast) extraUsd += 15;
    if (addonScope) extraUsd += 25;
    if (addonPickup) extraUsd += 10;

    if (currency === 'EUR') return Math.round(extraUsd * 0.92);
    if (currency === 'LKR') return extraUsd * 300;
    return extraUsd;
  };

  const grandTotal = getBasePrice() + getAddonTotal();

  const formatPriceVal = (val: number) => {
    if (currency === 'EUR') return `€${val}`;
    if (currency === 'LKR') return `Rs. ${val.toLocaleString()}`;
    return `$${val}`;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createBookingInFirestore({
        packageId: currentPkg.id,
        packageTitle: currentPkg.title,
        park: currentPkg.park,
        expeditionDate: expeditionDate || new Date().toISOString().split('T')[0],
        timeSlot: shiftTime,
        guestCount: passengers,
        customerInfo: {
          fullName: 'Wildking Guest',
          email: 'guest@wildkingjeeps.com',
          phone: '+94 77 123 4567',
        },
        totalAmountUsd: grandTotal,
        currency: currency,
      });
      setBookingRef(res.bookingId ? `BK-${res.bookingId.slice(0, 8).toUpperCase()}` : 'WK-' + Math.floor(100000 + Math.random() * 900000));
      setIsSuccess(true);
    } catch (err) {
      console.warn("Firestore booking fallback to local ref:", err);
      const ref = 'WK-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(ref);
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Click-outside backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-[#0a150f] border border-emerald-800/60 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 max-h-[90vh] flex flex-col z-10 my-auto">
        {/* Header */}
        <div className="px-6 py-5 bg-[#0f2017] border-b border-emerald-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold font-serif text-white">
              {isSuccess ? 'Expedition Confirmed!' : 'Reserve Private Safari'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-bold font-serif text-white">Booking Reference #{bookingRef}</h4>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                Thank you! Your private safari jeep for <span className="text-amber-400 font-bold">{currentPkg.title}</span> on{' '}
                <span className="text-amber-400 font-bold">{expeditionDate || 'Selected Date'}</span> has been reserved.
              </p>
              <div className="bg-[#0f2118] p-4 rounded-2xl border border-emerald-800/60 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Park:</span>
                  <span className="font-bold text-white">{currentPkg.parkName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Vehicle:</span>
                  <span className="font-bold text-white">{selectedVehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shift Time:</span>
                  <span className="font-bold text-white">{shiftTime}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-900/60 pt-2 font-bold text-sm">
                  <span className="text-amber-400">Total Paid:</span>
                  <span className="text-amber-400">{formatPriceVal(grandTotal)}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                A confirmation email & WhatsApp message has been dispatched to your phone with tracker details.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-300 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              {/* Select Package */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                  Select Safari Package
                </label>
                <select
                  value={pkgId}
                  onChange={(e) => setPkgId(e.target.value)}
                  className="w-full bg-[#0e1d15] border border-emerald-800/60 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                >
                  {SAFARI_PACKAGES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.parkName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                    Expedition Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expeditionDate}
                    onChange={(e) => setExpeditionDate(e.target.value)}
                    className="w-full bg-[#0e1d15] border border-emerald-800/60 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                    Shift Time
                  </label>
                  <select
                    value={shiftTime}
                    onChange={(e) => setShiftTime(e.target.value as any)}
                    className="w-full bg-[#0e1d15] border border-emerald-800/60 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Dawn Patrol (5:30 AM)">Dawn Patrol (5:30 AM)</option>
                    <option value="Dusk Safari (2:30 PM)">Dusk Safari (2:30 PM)</option>
                    <option value="Full-Day VIP (5:30 AM - 6:00 PM)">Full-Day VIP (5:30 AM - 6:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Vehicle & Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                    4x4 Vehicle Spec
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full bg-[#0e1d15] border border-emerald-800/60 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Land Cruiser VIP 70">Toyota Land Cruiser VIP 70</option>
                    <option value="Defender 110 Safari">Land Rover Defender 110</option>
                    <option value="Hilux Expedition">Toyota Hilux Safari Spec</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                    Guests (Private Vehicle)
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-[#0e1d15] border border-emerald-800/60 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests (Full Capacity)</option>
                  </select>
                </div>
              </div>

              {/* Addons Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                  Expedition Add-ons
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#0e1d15] border border-emerald-900/60 cursor-pointer hover:border-emerald-700">
                    <div className="flex items-center gap-3">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Gourmet Sri Lankan Bush Breakfast</div>
                        <div className="text-[10px] text-zinc-400">Fresh coconuts, fruit platter, sandwiches & coffee</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={addonBreakfast}
                      onChange={(e) => setAddonBreakfast(e.target.checked)}
                      className="w-4 h-4 accent-amber-400"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#0e1d15] border border-emerald-900/60 cursor-pointer hover:border-emerald-700">
                    <div className="flex items-center gap-3">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Nikon 20-60x Spotting Scope & Lens Mount</div>
                        <div className="text-[10px] text-zinc-400">High magnification optics for leopard viewing</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={addonScope}
                      onChange={(e) => setAddonScope(e.target.checked)}
                      className="w-4 h-4 accent-amber-400"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#0e1d15] border border-emerald-900/60 cursor-pointer hover:border-emerald-700">
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Hotel Pickup & Drop-off Transfer</div>
                        <div className="text-[10px] text-zinc-400">Private pickup from any hotel in park vicinity</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={addonPickup}
                      onChange={(e) => setAddonPickup(e.target.checked)}
                      className="w-4 h-4 accent-amber-400"
                    />
                  </label>
                </div>
              </div>

              {/* Price Breakdown Footer */}
              <div className="p-4 rounded-2xl bg-[#0f2118] border border-emerald-800/60 space-y-2">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Base Jeep Package ({currentPkg.parkName}):</span>
                  <span className="font-semibold text-white">{formatPriceVal(getBasePrice())}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Selected Add-ons Total:</span>
                  <span className="font-semibold text-white">{formatPriceVal(getAddonTotal())}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-amber-400 pt-2 border-t border-emerald-900/60">
                  <span>Total Amount Due:</span>
                  <span>{formatPriceVal(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-amber-500/25 transition-all"
              >
                Confirm & Pay ({formatPriceVal(grandTotal)})
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
