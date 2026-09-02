"use client";

import React, { useState } from "react";
import { ParkDestinationDoc } from "@/lib/types/firestore";
import { saveParkInFirestore } from "@/lib/firestore-service";
import { Trees, Plus, MapPin, Calendar, Sparkles, Edit3, X, Check, Search, Info } from "lucide-react";

interface ParksManagerProps {
  destinations: ParkDestinationDoc[];
}

const DEFAULT_PARK_IMAGE = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000";

export default function ParksManager({ destinations }: ParksManagerProps) {
  const [parksList, setParksList] = useState<ParkDestinationDoc[]>(destinations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingPark, setEditingPark] = useState<ParkDestinationDoc | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for creating new park
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newImage, setNewImage] = useState(DEFAULT_PARK_IMAGE);
  const [newPrimarySpecies, setNewPrimarySpecies] = useState("Asian Elephant, Sri Lankan Leopard, Sloth Bear");
  const [newBestSeason, setNewBestSeason] = useState("February - July (Dry Season)");
  const [newKeyFact, setNewKeyFact] = useState("Highest wildlife concentration & coastal lagoons");
  const [newDistance, setNewDistance] = useState("290 km from Colombo");

  const filteredParks = parksList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.primarySpecies.some((sp) => sp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreatePark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSaving(true);
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = slug || `park-${Date.now()}`;

    const newParkDoc: ParkDestinationDoc = {
      id,
      slug,
      name: newName.trim(),
      tagline: newTagline.trim() || "Breathtaking Wildlife Sanctuary",
      image: newImage.trim() || DEFAULT_PARK_IMAGE,
      primarySpecies: newPrimarySpecies.split(",").map((s) => s.trim()).filter(Boolean),
      bestSeason: newBestSeason.trim() || "Year-round",
      keyFact: newKeyFact.trim() || "Protected biodiversity hotspot",
      distanceFromColombo: newDistance.trim() || "Approx 250 km from Colombo",
    };

    setParksList((prev) => [newParkDoc, ...prev]);
    await saveParkInFirestore(newParkDoc);
    setIsSaving(false);
    setIsAdding(false);

    // Reset Form
    setNewName("");
    setNewTagline("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPark) return;

    setIsSaving(true);
    setParksList((prev) => prev.map((p) => (p.id === editingPark.id ? editingPark : p)));
    await saveParkInFirestore(editingPark);
    setIsSaving(false);
    setEditingPark(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trees className="w-5 h-5 text-amber-400" />
            <span>Safari National Parks & Sanctuaries</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage Sri Lanka wildlife destinations, species sightings, and add new national parks.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search parks or species..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Safari Park</span>
          </button>
        </div>
      </div>

      {/* Row-Wise Parks Table */}
      <div className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-4 px-5">National Park</th>
                <th className="py-4 px-4">Distance / Location</th>
                <th className="py-4 px-4">Best Season</th>
                <th className="py-4 px-4">Primary Species Sightings</th>
                <th className="py-4 px-4">Key Park Highlight</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredParks.map((park) => (
                <tr key={park.id} className="hover:bg-slate-800/50 transition-colors group">
                  {/* Name & Cover Image */}
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                        <img
                          src={park.image}
                          alt={park.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                          {park.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{park.tagline}</p>
                      </div>
                    </div>
                  </td>

                  {/* Distance */}
                  <td className="py-4 px-4 text-emerald-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{park.distanceFromColombo}</span>
                    </div>
                  </td>

                  {/* Best Season */}
                  <td className="py-4 px-4 text-amber-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{park.bestSeason}</span>
                    </div>
                  </td>

                  {/* Primary Species */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {park.primarySpecies.map((species, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-semibold text-emerald-300 inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          <span>{species}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Key Fact */}
                  <td className="py-4 px-4 text-slate-300 font-medium max-w-xs">
                    <p className="line-clamp-2 text-[11px] leading-relaxed">{park.keyFact}</p>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setEditingPark(park)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Park</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Park Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New Safari National Park</span>
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePark} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Park Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Gal Oya National Park"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Sri Lanka's Only Sanctuary for Boat Safaris & Swimming Elephants"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Distance from Colombo</label>
                  <input
                    type="text"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 315 km (5.5 hrs)"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Best Season to Visit</label>
                  <input
                    type="text"
                    value={newBestSeason}
                    onChange={(e) => setNewBestSeason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. March - July (Elephants & Birds)"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Primary Species Sightings (comma separated)</label>
                  <input
                    type="text"
                    value={newPrimarySpecies}
                    onChange={(e) => setNewPrimarySpecies(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="Asian Elephant, Marsh Crocodile, White-bellied Sea Eagle"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Key Park Highlight Fact</label>
                  <textarea
                    rows={2}
                    value={newKeyFact}
                    onChange={(e) => setNewKeyFact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-amber-400 focus:outline-none resize-none"
                    placeholder="e.g. Famous for unique boat safaris on Senanayake Samudra reservoir"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save Safari Park</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Park Modal */}
      {editingPark && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit Safari Park: {editingPark.name}</span>
              </h3>
              <button
                onClick={() => setEditingPark(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Park Name</label>
                  <input
                    type="text"
                    required
                    value={editingPark.name}
                    onChange={(e) => setEditingPark({ ...editingPark, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingPark.tagline}
                    onChange={(e) => setEditingPark({ ...editingPark, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Distance from Colombo</label>
                  <input
                    type="text"
                    value={editingPark.distanceFromColombo}
                    onChange={(e) => setEditingPark({ ...editingPark, distanceFromColombo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Best Season</label>
                  <input
                    type="text"
                    value={editingPark.bestSeason}
                    onChange={(e) => setEditingPark({ ...editingPark, bestSeason: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={editingPark.image}
                    onChange={(e) => setEditingPark({ ...editingPark, image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Primary Species (comma separated)</label>
                  <input
                    type="text"
                    value={editingPark.primarySpecies.join(", ")}
                    onChange={(e) =>
                      setEditingPark({
                        ...editingPark,
                        primarySpecies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Key Park Highlight Fact</label>
                  <textarea
                    rows={2}
                    value={editingPark.keyFact}
                    onChange={(e) => setEditingPark({ ...editingPark, keyFact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingPark(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save Changes</span>
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
