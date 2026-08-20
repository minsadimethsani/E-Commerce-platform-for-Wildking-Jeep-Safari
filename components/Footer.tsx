'use client';

import React, { useState } from 'react';
import { Compass, Phone, Mail, MapPin, Send, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) setSubscribed(true);
  };

  return (
    <footer id="contact" className="bg-[#040906] text-zinc-300 pt-20 pb-12 border-t border-emerald-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-emerald-900/50">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Compass className="w-6 h-6 text-emerald-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-white font-serif">
                  WILDKING <span className="text-amber-400 text-xs font-sans uppercase">SAFARI</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase">
                  Sri Lanka Expeditions
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light max-w-sm">
              Sri Lanka’s leading luxury safari operator specializing in private 4x4 Land Cruiser wildlife expeditions across Yala, Udawalawe, Wilpattu & Minneriya.
            </p>

            {/* WhatsApp Concierge Direct CTA */}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-amber-300 hover:bg-emerald-900/80 transition-colors shadow-lg"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>24/7 WhatsApp Hotline (+94 77 123 4567)</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 font-sans">
              Safari Expeditions
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-light">
              <li>
                <a href="#safaris" className="hover:text-amber-300 transition-colors">
                  Yala Leopard Dawn Patrol
                </a>
              </li>
              <li>
                <a href="#safaris" className="hover:text-amber-300 transition-colors">
                  Udawalawe Elephant Sanctuary
                </a>
              </li>
              <li>
                <a href="#safaris" className="hover:text-amber-300 transition-colors">
                  Wilpattu Deep Wilderness VIP
                </a>
              </li>
              <li>
                <a href="#safaris" className="hover:text-amber-300 transition-colors">
                  Minneriya Great Gathering
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-amber-300 transition-colors">
                  Custom 4x4 Fleet Specs
                </a>
              </li>
            </ul>
          </div>

          {/* Park Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 font-sans">
              Visitor Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-light">
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Park Entrance Rules & Fees
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Best Wildlife Season Calendar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  What to Wear on Safari
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Photography Lens Rental Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Eco-Conservation Commitment
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 font-sans">
              Wildlife Dispatch
            </h4>
            <p className="text-xs text-zinc-400 font-light mb-3">
              Subscribe for seasonal wildlife migration alerts & exclusive safari promo codes.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                ✓ Subscribed to Wildlife Alerts!
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-[#09150e] border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-light">
          <div>
            © {new Date().getFullYear()} Wildking Safari (Pvt) Ltd. All rights reserved. Registered Sri Lanka Tourism Development Authority (SLTDA).
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>🔒 256-bit SSL Encrypted Booking</span>
            <span>•</span>
            <span>Visa • Mastercard • Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
