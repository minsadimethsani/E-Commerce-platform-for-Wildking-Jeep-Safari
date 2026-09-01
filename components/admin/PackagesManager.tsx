"use client";

import React, { useState } from "react";
import { SafariPackageDoc } from "@/lib/types/firestore";

interface PackagesManagerProps {
  packages: SafariPackageDoc[];
}

export default function PackagesManager({ packages }: PackagesManagerProps) {
  const [pkgList, setPkgList] = useState<SafariPackageDoc[]>(packages);
  const [editingPkg, setEditingPkg] = useState<SafariPackageDoc | null>(null);

  const handleSavePackage = (updated: SafariPackageDoc) => {
    setPkgList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPkg(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🦁</span> Safari Tour Packages
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage pricing, inclusions, time slots, and badge highlights.</p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pkgList.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative h-44 w-full bg-slate-950">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover opacity-80"
              />
              {pkg.badge && (
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow">
                  {pkg.badge}
                </span>
              )}
              <span className="absolute bottom-3 right-3 bg-slate-950/90 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {pkg.parkName}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 flex-grow">
              <h3 className="font-extrabold text-white text-base leading-tight">{pkg.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{pkg.description}</p>

              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-400 pt-1">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">⏱️ {pkg.duration}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300">🕒 {pkg.timeSlot}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-teal-300">👥 Max {pkg.maxGuests} Guests</span>
              </div>

              {/* Price Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Rates</p>
                  <p className="text-lg font-black text-amber-400">${pkg.priceUsd} USD</p>
                </div>
                <div className="text-right text-[11px] font-semibold text-slate-400">
                  <p>€{pkg.priceEur} EUR</p>
                  <p className="text-emerald-400 font-bold">{pkg.sightingsRate}</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => setEditingPkg(pkg)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                ✏️ Edit Package Rates
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs">
            <h3 className="text-base font-bold text-white">Edit Package: {editingPkg.title}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Price (USD)</label>
                <input
                  type="number"
                  value={editingPkg.priceUsd}
                  onChange={(e) => setEditingPkg({ ...editingPkg, priceUsd: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Price (EUR)</label>
                <input
                  type="number"
                  value={editingPkg.priceEur}
                  onChange={(e) => setEditingPkg({ ...editingPkg, priceEur: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Badge Highlight</label>
                <input
                  type="text"
                  value={editingPkg.badge || ""}
                  onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  placeholder="e.g. Most Popular"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setEditingPkg(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePackage(editingPkg)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
