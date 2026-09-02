"use client";

import React from "react";
import { JeepVehicleDoc } from "@/lib/types/firestore";
import { Truck } from "lucide-react";

interface FleetManagerProps {
  fleet: JeepVehicleDoc[];
}

export default function FleetManager({ fleet }: FleetManagerProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" /> Wildking 4x4 Jeep Fleet
          </h2>
          <p className="text-xs text-slate-400 mt-1">Heavy-duty Land Cruisers & Defender vehicles built for national park safaris.</p>
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {fleet.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative h-48 w-full bg-slate-950">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover opacity-85"
              />
              <span className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow">
                {vehicle.capacity}
              </span>
            </div>

            <div className="p-4 space-y-3 flex-grow">
              <h3 className="font-extrabold text-white text-base leading-tight">{vehicle.name}</h3>
              <p className="text-xs text-amber-300 font-semibold">{vehicle.tagline}</p>
              <p className="text-[11px] text-slate-400 font-medium">Model: {vehicle.model}</p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <p className="text-[10px] font-bold text-emerald-400 uppercase">Key Vehicle Specs</p>
                <p><span className="text-slate-400">Suspension:</span> {vehicle.specs?.suspension}</p>
                <p><span className="text-slate-400">Seating:</span> {vehicle.specs?.seating}</p>
                <p><span className="text-slate-400">Charging:</span> {vehicle.specs?.charging}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Features</p>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                  {vehicle.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-right">
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold rounded-full uppercase">
                Active & Inspection Passed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
