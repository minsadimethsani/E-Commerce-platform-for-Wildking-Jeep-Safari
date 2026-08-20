'use client';

import React, { useState } from 'react';
import { JEEP_FLEET, JeepVehicle } from '../data/packages';
import { Shield, Zap, Eye, BatteryCharging, CheckCircle, Car } from 'lucide-react';

export const FleetShowcase: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<JeepVehicle>(JEEP_FLEET[0]);

  return (
    <section id="fleet" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09150e] border-t border-b border-emerald-900/40 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/50 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">
            <Car className="w-3.5 h-3.5" />
            Custom Modified 4x4 Vehicles
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif">
            Meet Your Expedition Fleet
          </h2>
          <p className="text-sm sm:text-base text-zinc-300/80 mt-3 font-light">
            Engineered exclusively for Sri Lanka’s rugged safari terrain with stadium seating, zero-vibration camera mounts, and 360° unobstructed views.
          </p>
        </div>

        {/* Vehicle Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {JEEP_FLEET.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 ${
                selectedVehicle.id === vehicle.id
                  ? 'bg-amber-400 text-emerald-950 shadow-xl shadow-amber-400/20 scale-105'
                  : 'bg-[#0f2118] text-zinc-300 hover:bg-emerald-900/50 border border-emerald-800/40'
              }`}
            >
              <span>{vehicle.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Vehicle Showcase Card */}
        <div className="bg-[#0b1811] border border-emerald-800/60 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          {/* Vehicle Image */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden group h-80 sm:h-96">
            <img
              src={selectedVehicle.image}
              alt={selectedVehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                {selectedVehicle.model}
              </span>
              <h4 className="text-xl font-bold text-white font-serif">{selectedVehicle.tagline}</h4>
            </div>
          </div>

          {/* Vehicle Features & Technical Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Capacity: {selectedVehicle.capacity}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
                {selectedVehicle.name}
              </h3>
            </div>

            {/* Key Features List */}
            <div className="space-y-2.5">
              {selectedVehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-zinc-200">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-900/50">
              <div className="bg-[#07110b] p-3.5 rounded-xl border border-emerald-900/60">
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Off-Road Suspension
                </div>
                <div className="text-xs font-semibold text-white">{selectedVehicle.specs.suspension}</div>
              </div>

              <div className="bg-[#07110b] p-3.5 rounded-xl border border-emerald-900/60">
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  Viewing Angle
                </div>
                <div className="text-xs font-semibold text-white">{selectedVehicle.specs.viewingAngle}</div>
              </div>

              <div className="bg-[#07110b] p-3.5 rounded-xl border border-emerald-900/60">
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                  Power & Charging
                </div>
                <div className="text-xs font-semibold text-white">{selectedVehicle.specs.charging}</div>
              </div>

              <div className="bg-[#07110b] p-3.5 rounded-xl border border-emerald-900/60">
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Onboard Amenities
                </div>
                <div className="text-xs font-semibold text-white">{selectedVehicle.specs.amenities}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
