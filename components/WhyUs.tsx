'use client';

import React from 'react';
import { Compass, Award, ShieldCheck, HeartHandshake, Utensils, Zap } from 'lucide-react';

export const WhyUs: React.FC = () => {
  return (
    <section id="why-us" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060c08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            <Award className="w-3.5 h-3.5" />
            The Wildking Difference
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            Why Travelers Choose Wildking
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 font-light">
            We don’t just offer jeep rides; we craft high-end wildlife tracking expeditions with unmatched safety, comfort, and environmental stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Item 1 */}
          <div className="bg-[#0c1811] p-8 rounded-3xl border border-emerald-900/50 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif mb-2">Master Wildlife Trackers</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              Led by veteran naturalists with over 10+ years of big cat behavioral experience in Yala and Wilpattu national parks.
            </p>
          </div>

          {/* Item 2 */}
          <div className="bg-[#0c1811] p-8 rounded-3xl border border-emerald-900/50 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif mb-2">100% Private 4x4 Jeeps</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              No cramped shared seating with strangers. Every booking includes a private modified Toyota Land Cruiser or Defender.
            </p>
          </div>

          {/* Item 3 */}
          <div className="bg-[#0c1811] p-8 rounded-3xl border border-emerald-900/50 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
              <Utensils className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif mb-2">Gourmet Bush Breakfast</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              Enjoy fresh tropical fruit platters, organic Sri Lankan sandwiches, ice-cold coconut water, and artisanal espresso in the wild.
            </p>
          </div>

          {/* Item 4 */}
          <div className="bg-[#0c1811] p-8 rounded-3xl border border-emerald-900/50 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
              <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif mb-2">Eco-Conservation First</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              We adhere strictly to park speed limits, zero plastic policies, and contribute 5% of proceeds directly to wildlife habitat protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
