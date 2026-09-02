"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SafariPackageDoc, ParkType, TimeSlotType } from "@/lib/types/firestore";
import { savePackageInFirestore } from "@/lib/firestore-service";
import { Plus, Clock, Users, MapPin, Sparkles, X, Check, Compass, ChevronRight } from "lucide-react";

interface PackagesManagerProps {
  packages: SafariPackageDoc[];
}

const PARK_NAME_MAP: Record<ParkType, string> = {
  yala: "Yala National Park",
  udawalawe: "Udawalawe National Park",
  wilpattu: "Wilpattu National Park",
  minneriya: "Minneriya National Park",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000";

export default function PackagesManager({ packages }: PackagesManagerProps) {
  const router = useRouter();
  const [pkgList, setPkgList] = useState<SafariPackageDoc[]>(packages);
  const [isAdding, setIsAdding] = useState(false);

  // Form state for creating a new package
  const [newTitle, setNewTitle] = useState("");
  const [newPark, setNewPark] = useState<ParkType>("yala");
  const [newTagline, setNewTagline] = useState("");
  const [newDuration, setNewDuration] = useState("Half-Day (5 Hours)");
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlotType>("Dawn Patrol (5:30 AM)");
  const [newPriceUsd, setNewPriceUsd] = useState<number>(180);
  const [newPriceEur, setNewPriceEur] = useState<number>(165);
  const [newPriceLkr, setNewPriceLkr] = useState<number>(54000);
  const [newMaxGuests, setNewMaxGuests] = useState<number>(6);
  const [newSightingsRate, setNewSightingsRate] = useState("95% Sighting Rate");
  const [newBadge, setNewBadge] = useState("New Expedition");
  const [newImage, setNewImage] = useState(DEFAULT_IMAGE);
  const [newDescription, setNewDescription] = useState("");
  const [newHighlights, setNewHighlights] = useState("Luxury 4x4 Jeep with Elevated Seating, Expert Wildlife Tracker, Refreshments & Cold Drinks");
  const [newInclusions, setNewInclusions] = useState("Hotel Pick & Drop, National Park Permits, Binoculars & Telescope");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSaving(true);
    const newId = `pkg-${Date.now()}`;
    const newPackage: SafariPackageDoc = {
      id: newId,
      title: newTitle.trim(),
      park: newPark,
      parkName: PARK_NAME_MAP[newPark] || "Sri Lanka National Park",
      tagline: newTagline.trim() || "Exclusive Wilderness Safari",
      duration: newDuration,
      timeSlot: newTimeSlot,
      priceUsd: Number(newPriceUsd) || 0,
      priceEur: Number(newPriceEur) || 0,
      priceLkr: Number(newPriceLkr) || 0,
      rating: 5.0,
      reviewsCount: 1,
      sightingsRate: newSightingsRate.trim() || "95% Sighting Rate",
      badge: newBadge.trim() || undefined,
      image: newImage.trim() || DEFAULT_IMAGE,
      description: newDescription.trim() || "Unforgettable luxury 4x4 safari expedition with master wildlife trackers.",
      highlights: newHighlights.split(",").map((s) => s.trim()).filter(Boolean),
      inclusions: newInclusions.split(",").map((s) => s.trim()).filter(Boolean),
      maxGuests: Number(newMaxGuests) || 6,
    };

    setPkgList((prev) => [newPackage, ...prev]);
    await savePackageInFirestore(newPackage);
    setIsSaving(false);
    setIsAdding(false);

    // Redirect to the newly created single package page
    router.push(`/admin/packages/${newPackage.id}`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Safari Tour Packages</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage pricing, inclusions, time slots, and click any row to edit package details.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Row-Wise Table View */}
      <div className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-4 px-5">Package Name</th>
                <th className="py-4 px-4">National Park</th>
                <th className="py-4 px-4">Duration & Slot</th>
                <th className="py-4 px-4">Capacity</th>
                <th className="py-4 px-4">Rates (USD / EUR)</th>
                <th className="py-4 px-4">Highlight</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {pkgList.map((pkg) => (
                <tr
                  key={pkg.id}
                  onClick={() => router.push(`/admin/packages/${pkg.id}`)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Package Title & Cover */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                          {pkg.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                          {pkg.tagline || pkg.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* National Park */}
                  <td className="py-3.5 px-4 font-medium text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pkg.parkName}</span>
                    </div>
                  </td>

                  {/* Duration & Time Slot */}
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Clock className="w-3 h-3 text-amber-400" /> {pkg.duration}
                      </p>
                      <p className="text-[10px] text-slate-400">{pkg.timeSlot}</p>
                    </div>
                  </td>

                  {/* Max Guests */}
                  <td className="py-3.5 px-4 font-semibold text-slate-300">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-teal-400" />
                      <span>Max {pkg.maxGuests} Guests</span>
                    </div>
                  </td>

                  {/* Pricing Rates */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-black text-amber-400 text-sm">${pkg.priceUsd} USD</p>
                      <p className="text-[10px] text-slate-400 font-semibold">€{pkg.priceEur} EUR</p>
                    </div>
                  </td>

                  {/* Badge Highlight */}
                  <td className="py-3.5 px-4">
                    {pkg.badge ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {pkg.badge}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold">{pkg.sightingsRate}</span>
                    )}
                  </td>

                  {/* Redirect Arrow Action */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-all text-xs">
                      <span>View & Edit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Package Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New Safari Package</span>
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Wilpattu Private Leopard & Bear Expedition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">National Park</label>
                  <select
                    value={newPark}
                    onChange={(e) => setNewPark(e.target.value as ParkType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-amber-400 focus:outline-none"
                  >
                    <option value="yala">Yala National Park</option>
                    <option value="udawalawe">Udawalawe National Park</option>
                    <option value="wilpattu">Wilpattu National Park</option>
                    <option value="minneriya">Minneriya National Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value as TimeSlotType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Dawn Patrol (5:30 AM)">Dawn Patrol (5:30 AM)</option>
                    <option value="Dusk Safari (2:30 PM)">Dusk Safari (2:30 PM)</option>
                    <option value="Full-Day VIP (5:30 AM - 6:00 PM)">Full-Day VIP (5:30 AM - 6:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Half-Day (5 Hours)"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newMaxGuests}
                    onChange={(e) => setNewMaxGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Price (USD $)</label>
                  <input
                    type="number"
                    required
                    value={newPriceUsd}
                    onChange={(e) => setNewPriceUsd(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Price (EUR €)</label>
                  <input
                    type="number"
                    required
                    value={newPriceEur}
                    onChange={(e) => setNewPriceEur(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Badge Highlight</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Signature VIP"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Sightings Rate</label>
                  <input
                    type="text"
                    value={newSightingsRate}
                    onChange={(e) => setNewSightingsRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 98% Sightings Rate"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none resize-none"
                    placeholder="Brief description of this safari experience..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save & Open Package</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
