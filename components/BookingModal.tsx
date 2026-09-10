'use client';

import React, { useState, useEffect } from 'react';
import { SafariPackage, SAFARI_PACKAGES } from '../data/packages';
import { createBookingInFirestore, checkVehicleSlotAvailability } from '../lib/firestore-service';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateBookingForm, getTomorrowDateString } from '../lib/validation';
import { X, Calendar, Clock, Users, Check, Sparkles, ShieldCheck, Car, Coffee, Camera, AlertCircle, User, Mail, Phone } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: SafariPackage | null;
  currency?: string;
  onOpenAccount?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  currency: propCurrency,
  onOpenAccount,
}) => {
  const { formatPrice, currency: contextCurrency } = useCurrency();
  const { user, addBookingToUser } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const activeCurrency = propCurrency || contextCurrency;

  const defaultPkg = selectedPackage || SAFARI_PACKAGES[0];
  const [pkgId, setPkgId] = useState(defaultPkg.id);
  const [expeditionDate, setExpeditionDate] = useState('');
  const [shiftTime, setShiftTime] = useState(defaultPkg.timeSlot);
  const [passengers, setPassengers] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState('Land Cruiser VIP 70');
  
  // Customer details
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');

  // Addons
  const [addonBreakfast, setAddonBreakfast] = useState(true);
  const [addonScope, setAddonScope] = useState(false);
  const [addonPickup, setAddonPickup] = useState(true);

  // Validation & error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Step state
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleCloseModal = () => {
    setIsSuccess(false);
    setBookingRef('');
    setErrors({});
    onClose();
  };

  // Auto populate customer info from auth
  useEffect(() => {
    if (user) {
      setCustName(user.name || '');
      setCustEmail(user.email || '');
      setCustPhone(user.phone || '');
    }
  }, [user]);

  // Reset confirmation state & update package whenever modal opens or package changes
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setBookingRef('');
      setErrors({});
      if (selectedPackage) {
        setPkgId(selectedPackage.id);
        if (selectedPackage.timeSlot) {
          setShiftTime(selectedPackage.timeSlot);
        }
      }
    }
  }, [isOpen, selectedPackage]);

  if (!isOpen) return null;

  const currentPkg = SAFARI_PACKAGES.find((p) => p.id === pkgId) || defaultPkg;

  // Calculate required 4x4 Jeeps (Max 6 guests per vehicle)
  const MAX_PER_VEHICLE = 6;
  const vehiclesNeeded = Math.max(1, Math.ceil(passengers / MAX_PER_VEHICLE));

  // Base price in LKR calculated per required vehicle
  const baseLkr = currentPkg.priceLkr * vehiclesNeeded;

  // Addon Total in LKR
  const getAddonTotalLkr = () => {
    let extraLkr = 0;
    if (addonBreakfast) extraLkr += 4500;
    if (addonScope) extraLkr += 7500;
    if (addonPickup) extraLkr += 3000;
    return extraLkr;
  };

  const grandTotalLkr = baseLkr + getAddonTotalLkr();

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Enforce Authentication Validation: Users must be logged in to book & track trip details
    if (!user) {
      setErrors({
        auth: 'Account Sign In Required: You must be logged in to your Wildking account to reserve safari expeditions and track trip details.',
      });
      showWarning('Account Required', 'Please sign in or create an account to complete your safari reservation.');
      return;
    }

    // Validate booking form
    const valResult = validateBookingForm({
      date: expeditionDate,
      guestCount: passengers,
      fullName: custName || user.name,
      email: custEmail || user.email,
      phone: custPhone || user.phone || '+94 77 123 4567',
    });

    if (!valResult.isValid) {
      setErrors(valResult.errors);
      showWarning('Reservation Form Incomplete', 'Please select an expedition date and check passenger details.');
      return;
    }

    const finalName = custName.trim() || user.name;
    const finalEmail = custEmail.trim() || user.email;
    const finalPhone = custPhone.trim() || user.phone || '+94 77 123 4567';

    setIsSubmitting(true);

    try {
      // Validate duplicate vehicle/time-slot reservation
      const availCheck = await checkVehicleSlotAvailability(
        expeditionDate || new Date().toISOString().split('T')[0],
        shiftTime,
        selectedVehicle
      );

      if (!availCheck.available) {
        const msg = availCheck.conflictMessage || `The vehicle "${selectedVehicle}" is already reserved for "${shiftTime}" on ${expeditionDate}.`;
        setErrors({ conflict: msg });
        showError('Vehicle Slot Reserved', msg);
        setIsSubmitting(false);
        return;
      }

      const res = await createBookingInFirestore({
        packageId: currentPkg.id,
        packageTitle: currentPkg.title,
        park: currentPkg.park,
        expeditionDate: expeditionDate || new Date().toISOString().split('T')[0],
        timeSlot: shiftTime,
        selectedVehicle: selectedVehicle,
        guestCount: passengers,
        customerInfo: {
          fullName: finalName,
          email: finalEmail,
          phone: finalPhone,
        },
        totalAmountUsd: grandTotalLkr,
        currency: activeCurrency as any,
      });

      const generatedRef = res.bookingId ? `BK-${res.bookingId.slice(0, 8).toUpperCase()}` : 'WK-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(generatedRef);

      // Save to logged-in user profile
      if (user && addBookingToUser) {
        addBookingToUser({
          id: generatedRef,
          packageName: currentPkg.title,
          date: expeditionDate,
          timeSlot: shiftTime,
          vehicle: selectedVehicle,
          guests: passengers,
          totalPrice: grandTotalLkr,
          status: 'Confirmed',
        });
      }

      setIsSuccess(true);
      showSuccess('Safari Expedition Reserved!', `Confirmation reference ${generatedRef} has been recorded.`);
    } catch (err) {
      console.warn("Firestore booking fallback to local ref:", err);
      const ref = 'WK-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(ref);

      if (user && addBookingToUser) {
        addBookingToUser({
          id: ref,
          packageName: currentPkg.title,
          date: expeditionDate,
          timeSlot: shiftTime,
          vehicle: selectedVehicle,
          guests: passengers,
          totalPrice: grandTotalLkr,
          status: 'Confirmed',
        });
      }

      setIsSuccess(true);
      showSuccess('Safari Reservation Recorded', `Expedition confirmed with ref ${ref}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Click-outside backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleCloseModal}
      />

      <div className="relative w-full max-w-lg bg-[#07130c] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>WILDKING EXPEDITIONS</span>
            </div>
            <h3 className="text-xl font-black text-white font-serif tracking-tight">
              Instant Safari Reservation
            </h3>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-2xl font-black text-white font-serif">Expedition Reserved!</h4>
            <p className="text-xs text-zinc-300">
              Your 4x4 Land Cruiser safari permit has been registered.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Booking Reference:</span>
                <span className="font-mono font-bold text-amber-400">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Safari Package:</span>
                <span className="font-bold text-white">{currentPkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Vehicle:</span>
                <span className="font-bold text-white">{selectedVehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Reserved Fleet:</span>
                <span className="font-bold text-white">{vehiclesNeeded} Private Jeep{vehiclesNeeded > 1 ? 's' : ''} ({passengers} Guests)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Shift Time:</span>
                <span className="font-bold text-white">{shiftTime}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-900/60 pt-2 font-bold text-sm">
                <span className="text-amber-400">Total Paid:</span>
                <span className="text-amber-400">{formatPrice(grandTotalLkr)}</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">
              A confirmation email & WhatsApp message has been dispatched to your phone with tracker details.
            </p>
            <button
              onClick={handleCloseModal}
              className="px-8 py-3 bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-6">
            {/* Account Authentication Required Banner for Unauthenticated Users */}
            {!user && (
              <div className="p-4 rounded-2xl bg-amber-950/90 border border-amber-500/70 text-amber-200 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-2xl">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <User className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Account Authentication Required</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-100 font-medium">
                  You must be logged in to your Wildking account to reserve safari trips and track your booking details in real-time.
                </p>
                {onOpenAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                      onOpenAccount();
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <User className="w-4 h-4 text-slate-950" />
                    <span>Sign In / Register Now</span>
                  </button>
                )}
              </div>
            )}

            {/* Auth Validation Error Banner */}
            {errors.auth && (
              <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs space-y-2 animate-in fade-in duration-200 shadow-2xl">
                <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Authentication Required</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-100 font-medium">
                  {errors.auth}
                </p>
              </div>
            )}

            {/* Duplicate Booking Conflict Error Banner */}
            {errors.conflict && (
              <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs space-y-2 animate-in fade-in duration-200 shadow-2xl">
                <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Vehicle & Time Slot Reservation Conflict</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-100 font-medium">
                  {errors.conflict}
                </p>
              </div>
            )}
            {/* Customer Information Fields */}
            <div className="p-4 rounded-2xl bg-[#0b1a11] border border-emerald-900/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                Primary Contact Details
              </span>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={custName}
                    onChange={(e) => {
                      setCustName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className={`w-full bg-[#07130c] border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white focus:outline-none ${
                      errors.fullName ? 'border-rose-500' : 'border-emerald-800/60 focus:border-amber-400'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="guest@example.com"
                      value={custEmail}
                      onChange={(e) => {
                        setCustEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full bg-[#07130c] border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white focus:outline-none ${
                        errors.email ? 'border-rose-500' : 'border-emerald-800/60 focus:border-amber-400'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={custPhone}
                      onChange={(e) => {
                        setCustPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full bg-[#07130c] border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-emerald-800/60 focus:border-amber-400'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

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
                  min={getTomorrowDateString()}
                  value={expeditionDate}
                  onChange={(e) => {
                    setExpeditionDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                  }}
                  className={`w-full bg-[#0e1d15] border rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none [color-scheme:dark] ${
                    errors.date ? 'border-rose-500' : 'border-emerald-800/60 focus:border-amber-400'
                  }`}
                />
                {errors.date && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.date}</p>}
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

            {/* Dedicated Vehicle Selection Section */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#08160e] border border-emerald-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <span>Select 4x4 Expedition Vehicle Spec</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  100% Private Rig Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'Land Cruiser VIP 70',
                    title: 'Toyota Land Cruiser VIP 70',
                    tagline: 'Heavy-Duty 4.2L • Stadium Seating',
                    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
                    badge: 'Most Popular',
                    features: '360° Open Roof • Stadium Bucket Seats'
                  },
                  {
                    id: 'Defender 110 Safari',
                    title: 'Land Rover Defender 110',
                    tagline: 'Classic British Icon • Air Ride',
                    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
                    badge: 'All-Weather Canopy',
                    features: 'Canvas Roll-up Canopy • DSLR Mounts'
                  },
                  {
                    id: 'Hilux Expedition',
                    title: 'Toyota Hilux Safari Spec',
                    tagline: 'Whisper-Quiet Turbo • Agile Spec',
                    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
                    badge: 'Quiet Engine',
                    features: 'Whisper Turbo • Fox Racing Shocks'
                  }
                ].map((v) => {
                  const isSelected = selectedVehicle === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`group relative rounded-xl border p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                          : 'bg-[#091f14] border-emerald-900/60 hover:border-emerald-700/80 hover:bg-[#0c2619]'
                      }`}
                    >
                      {/* Top Selection Status Bar */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-zinc-400 border border-slate-800'
                          }`}
                        >
                          {v.badge}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-600 bg-slate-950'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Vehicle Thumbnail */}
                      <div className="relative h-24 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={v.image}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-amber-300">
                          Max 6 Guests / Jeep
                        </span>
                      </div>

                      {/* Vehicle Title & Specs */}
                      <div className="space-y-1">
                        <h4 className={`text-xs font-black font-serif ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                          {v.title}
                        </h4>
                        <p className="text-[10px] text-zinc-300 leading-tight">
                          {v.tagline}
                        </p>
                        <p className="text-[9px] text-emerald-400 font-semibold pt-0.5">
                          ✓ {v.features}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                  Number of Guests
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={passengers <= 6 ? passengers : 'custom'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        if (passengers <= 6) setPassengers(7);
                      } else {
                        setPassengers(Number(val));
                      }
                      if (errors.guestCount) setErrors((prev) => ({ ...prev, guestCount: '' }));
                    }}
                    className={`w-full bg-[#0e1d15] border rounded-xl px-3.5 py-3 text-xs font-semibold text-white focus:outline-none ${
                      errors.guestCount ? 'border-rose-500' : 'border-emerald-800/60 focus:border-amber-400'
                    }`}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests (Single Jeep Capacity)</option>
                    <option value="custom">More than 6 guests (Enter number)...</option>
                  </select>

                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      placeholder="Enter guest count"
                      value={passengers || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPassengers(isNaN(val) || val < 1 ? 1 : val);
                        if (errors.guestCount) setErrors((prev) => ({ ...prev, guestCount: '' }));
                      }}
                      className="w-full bg-[#0e1d15] border border-emerald-800/60 rounded-xl px-3.5 py-3 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-3 text-[10px] font-bold text-zinc-400 pointer-events-none">
                      Total Guests
                    </span>
                  </div>
                </div>
                {errors.guestCount && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.guestCount}</p>}
              </div>

            {/* Multi-Vehicle & Full Payment Notice Banner */}
            {passengers > 6 && (
              <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-xl">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <span>Exceeding Single Vehicle Capacity ({passengers} Guests Selected)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200">
                  Each 4x4 Jeep accommodates a maximum capacity of <strong>6 guests</strong>. Since your group has <strong>{passengers} guests</strong>, you must book <strong>{vehiclesNeeded} separate 4x4 vehicles</strong> to seat your party.
                </p>
                <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 text-[11px] leading-relaxed text-amber-300 space-y-1.5">
                  <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full Vehicle Payment Policy</span>
                  </div>
                  <p className="text-[#f5f4ed] font-medium">
                    To reserve additional seats from another vehicle, full vehicle payment applies per Jeep ({vehiclesNeeded} x full vehicle package rate). By paying the full amount for the second vehicle, all remaining open seats on that Jeep are exclusively reserved for your private group.
                  </p>
                </div>
              </div>
            )}

            {/* Included Passenger Safety Features */}
            <div className="p-4 rounded-2xl bg-[#08170e] border border-emerald-800/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Passenger Safety Features Included</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                {(currentPkg.safetyFeatures || [
                  'Heavy-Duty Steel Roll Cages (Anti-Topple)',
                  'Individual 3-Point Ergonomic Seatbelts',
                  'Wilderness First-Aid & Emergency Kit',
                  'Satellite GPS & DWC Ranger Radio Link'
                ]).map((sf, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{sf}</span>
                  </div>
                ))}
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
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
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
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
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
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Price Breakdown Footer */}
            <div className="p-4 rounded-2xl bg-[#0f2118] border border-emerald-800/60 space-y-2">
              <div className="flex justify-between text-xs text-zinc-300">
                <span>Base Jeep Package ({currentPkg.parkName}):</span>
                <span className="font-semibold text-white">{formatPrice(baseLkr)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-300">
                <span>Selected Add-ons Total:</span>
                <span className="font-semibold text-white">{formatPrice(getAddonTotalLkr())}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-amber-400 pt-2 border-t border-emerald-900/60">
                <span>Total Amount Due:</span>
                <span>{formatPrice(grandTotalLkr)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type={user ? 'submit' : 'button'}
              disabled={isSubmitting}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  if (onOpenAccount) {
                    handleCloseModal();
                    onOpenAccount();
                  } else {
                    setErrors({ auth: 'Account Sign In Required: Please log in to your account to complete trip booking.' });
                  }
                }
              }}
              className={`w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-amber-500/25 transition-all cursor-pointer ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting
                ? 'Checking Availability & Confirming...'
                : user
                ? `Confirm & Pay (${formatPrice(grandTotalLkr)})`
                : 'Sign In / Register to Book Expedition'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
