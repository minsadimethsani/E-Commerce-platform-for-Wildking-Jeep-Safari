'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BookingModal } from '../../components/BookingModal';
import { AccountModal, UserProfile } from '../../components/AccountModal';
import { SAFARI_PACKAGES, SafariPackage } from '../../data/packages';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Compass,
  Sparkles,
  ShieldCheck,
  Calendar,
  User,
  HelpCircle
} from 'lucide-react';

import { validateContactForm, getTomorrowDateString } from '../../lib/validation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createInquiryInFirestore } from '../../lib/firestore-service';

export default function ContactPage() {
  const { user } = useAuth();
  const { showSuccess, showWarning, showError } = useToast();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  
  // Auth Account state
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parkInterest, setParkInterest] = useState('Yala National Park');
  const [expeditionDate, setExpeditionDate] = useState(getTomorrowDateString());
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const valResult = validateContactForm({
      fullName,
      email,
      phone,
      message,
    });

    if (!valResult.isValid) {
      setFormErrors(valResult.errors);
      showWarning('Form Validation Error', 'Please complete all required fields correctly.');
      return;
    }

    try {
      await createInquiryInFirestore({
        name: fullName,
        email,
        phone,
        preferredPark: parkInterest,
        message,
        status: 'new',
      });

      setIsSubmitted(true);
      showSuccess('Inquiry Submitted!', 'Our naturalist concierge will contact you within 2 hours.');
    } catch (err) {
      showError('Submission Error', 'Could not send inquiry. Please try again or WhatsApp us.');
    }
  };

  const handleOpenBooking = (pkg?: SafariPackage) => {
    setSelectedPackage(pkg || SAFARI_PACKAGES[0]);
    setIsBookingOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#050b14] text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Hero Header Section */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091120] via-[#070e1a] to-[#050b14] border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>24/7 VIP EXPEDITION CONCIERGE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-serif uppercase tracking-tight text-white">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">WILDKING SAFARI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Have questions about custom 4x4 Land Cruiser itineraries, park permits, or private group bookings? Our master naturalist team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Direct Contacts & Interactive Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050b14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white font-serif uppercase tracking-tight mb-2">
                Direct Touchpoints
              </h2>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Connect directly with our expedition headquarters or reach out via instant WhatsApp hotline for real-time park status and safari availability.
              </p>
            </div>

            {/* WhatsApp Hotline Card */}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-950/70 transition-all flex items-start gap-4 group shadow-xl"
            >
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                  INSTANT WHATSAPP HOTLINE
                </span>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  +94 77 123 4567
                </h4>
                <p className="text-xs text-slate-300 font-light">
                  Available 24 Hours • Instant response for urgent safari bookings & park permits.
                </p>
              </div>
            </a>

            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  EXPEDITION EMAIL
                </span>
                <h4 className="text-base font-bold text-white">
                  reservations@wildking-safari.com
                </h4>
                <p className="text-xs text-slate-300 font-light">
                  Bespoke tour itineraries, private charter requests & group discounts.
                </p>
              </div>
            </div>

            {/* Headquarters Location Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  SAFARI BASE HEADQUARTERS
                </span>
                <h4 className="text-sm font-bold text-white">
                  Palatupana Safari Base, Yala Entrance Rd, Tissamaharama, Sri Lanka
                </h4>
                <p className="text-xs text-slate-300 font-light">
                  Primary vehicle staging depot for Yala & Udawalawe expeditions.
                </p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  OPERATING HOURS
                </span>
                <h4 className="text-sm font-bold text-white">
                  Open 24 Hours / 7 Days A Week
                </h4>
                <p className="text-xs text-slate-300 font-light">
                  Dawn Patrols start at 5:00 AM sharp. Evening Concierge desk open till midnight.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact & Booking Inquiry Form */}
          <div className="lg:col-span-7 bg-[#08111e] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>Send An Expedition Inquiry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-tight">
                Plan Your Safari Adventure
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1">
                Fill out the form below and our head naturalist will get back to you within 2 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  Inquiry Received!
                </h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-white">{fullName}</span>. Our expedition coordinator has received your request for <span className="font-bold text-amber-300">{parkInterest}</span> on <span className="font-bold text-amber-300">{expeditionDate}</span> and will contact you shortly via email and WhatsApp.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                        formErrors.fullName ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700/80 focus:border-amber-400'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. eleanor@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                        formErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700/80 focus:border-amber-400'
                      }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +44 7911 123456"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                        formErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700/80 focus:border-amber-400'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Preferred Safari Date
                    </label>
                    <input
                      type="date"
                      min={getTomorrowDateString()}
                      value={expeditionDate}
                      onChange={(e) => setExpeditionDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    Park Corridor Interest
                  </label>
                  <select
                    value={parkInterest}
                    onChange={(e) => setParkInterest(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                  >
                    <option value="Yala National Park">Yala Block 1 & 5 (Leopard Density Sector)</option>
                    <option value="Udawalawe Sanctuary">Udawalawe Elephant Sanctuary Corridor</option>
                    <option value="Wilpattu Jungle Reserve">Wilpattu Sloth Bear & Ancient Lakes</option>
                    <option value="Minneriya Gathering">Minneriya Great Elephant Gathering</option>
                    <option value="Multi-Park Custom Expedition">Multi-Park Tailor-Made VIP Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Your Message / Special Requirements *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your group size, hotel pick-up location, photography gear, or special requests..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (formErrors.message) setFormErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.message ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700/80 focus:border-amber-400'
                    }`}
                  />
                  {formErrors.message && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{formErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="btn-golden-glow w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest text-slate-950 flex items-center justify-center gap-2 shadow-xl"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Send Expedition Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#040810] border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif uppercase tracking-tight">
              Essential Visitor Info
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Are national park permits included?
              </h4>
              <p className="text-slate-400 font-light leading-relaxed">
                Yes! All Wildking safari packages include official Department of Wildlife Conservation entrance permits, vehicle entry tickets, and government taxes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                What is the cancellation policy?
              </h4>
              <p className="text-slate-400 font-light leading-relaxed">
                We offer free full cancellation up to 48 hours prior to your safari start time. Re-scheduling is complimentary anytime due to weather or travel plan changes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                What vehicle is used for safaris?
              </h4>
              <p className="text-slate-400 font-light leading-relaxed">
                All tours feature private modified Toyota Land Cruiser 70-Series or Land Rover Defender 4x4s with elevated stadium leather seating and 360° open viewing roofs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Do you provide hotel pickup?
              </h4>
              <p className="text-slate-400 font-light leading-relaxed">
                Yes, free door-to-door pickup and drop-off is included from all hotels, resorts, and villas in Yala, Tissamaharama, Kirinda, Udawalawe, and Wilpattu areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Quick Booking Modal Dialog */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedPackage={selectedPackage}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* User Account Authentication & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />
    </main>
  );
}
