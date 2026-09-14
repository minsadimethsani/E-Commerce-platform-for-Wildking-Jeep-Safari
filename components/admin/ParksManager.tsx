"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ParkDestinationDoc } from "@/lib/types/firestore";
import { saveParkInFirestore, deleteParkFromFirestore } from "@/lib/firestore-service";
import { useToast } from "@/context/ToastContext";
import { Trees, Plus, MapPin, Calendar, Sparkles, Edit3, X, Check, CheckCircle2, Search, Info, Trash2, ExternalLink, Image as ImageIcon, Star } from "lucide-react";

interface ParksManagerProps {
  destinations: ParkDestinationDoc[];
}

const DEFAULT_PARK_IMAGE = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000";

export default function ParksManager({ destinations }: ParksManagerProps) {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [parksList, setParksList] = useState<ParkDestinationDoc[]>(destinations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingPark, setEditingPark] = useState<ParkDestinationDoc | null>(null);
  const [deletingPark, setDeletingPark] = useState<ParkDestinationDoc | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states for creating new park
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newImage, setNewImage] = useState(DEFAULT_PARK_IMAGE);
  const [newImagesList, setNewImagesList] = useState<string[]>([DEFAULT_PARK_IMAGE]);
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
    if (!newName.trim()) {
      showWarning("Park Name Required", "Please enter a valid park destination name.");
      return;
    }

    setIsSaving(true);
    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const id = slug || `park-${Date.now()}`;

      // Clean image gallery
      const validGallery = newImagesList.map((img) => img.trim()).filter(Boolean);
      const coverPhoto = newImage.trim() || validGallery[0] || DEFAULT_PARK_IMAGE;
      if (validGallery.length === 0) validGallery.push(coverPhoto);

      const newParkDoc: ParkDestinationDoc = {
        id,
        slug,
        name: newName.trim(),
        tagline: newTagline.trim() || "Breathtaking Wildlife Sanctuary",
        image: coverPhoto,
        gallery: validGallery,
        primarySpecies: newPrimarySpecies.split(",").map((s) => s.trim()).filter(Boolean),
        bestSeason: newBestSeason.trim() || "Year-round",
        keyFact: newKeyFact.trim() || "Protected biodiversity hotspot",
        distanceFromColombo: newDistance.trim() || "Approx 250 km from Colombo",
      };

      setParksList((prev) => [newParkDoc, ...prev]);
      await saveParkInFirestore(newParkDoc);
      showSuccess("National Park Created!", `"${newParkDoc.name}" added to destinations.`);
      setIsSaving(false);
      setIsAdding(false);

      // Reset Form
      setNewName("");
      setNewTagline("");
      setNewImage(DEFAULT_PARK_IMAGE);
      setNewImagesList([DEFAULT_PARK_IMAGE]);
    } catch (err) {
      showError("Park Creation Failed", "Could not save National Park details.");
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPark) return;

    setIsSaving(true);
    try {
      const validGallery = (editingPark.gallery || [editingPark.image]).map((img) => img.trim()).filter(Boolean);
      const coverPhoto = editingPark.image.trim() || validGallery[0] || DEFAULT_PARK_IMAGE;
      if (validGallery.length === 0) validGallery.push(coverPhoto);

      const updatedParkDoc: ParkDestinationDoc = {
        ...editingPark,
        image: coverPhoto,
        gallery: validGallery,
      };

      setParksList((prev) => prev.map((p) => (p.id === updatedParkDoc.id ? updatedParkDoc : p)));
      await saveParkInFirestore(updatedParkDoc);
      showSuccess("Park Details Saved", `"${updatedParkDoc.name}" updated successfully.`);
      setIsSaving(false);
      setEditingPark(null);
    } catch (err) {
      showError("Park Update Failed", "Unable to update destination details.");
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPark) return;

    setIsDeleting(true);
    setStatusBanner(null);

    try {
      const targetPark = deletingPark;
      const res = await deleteParkFromFirestore(targetPark.id);

      if (res.success) {
        setParksList((prev) => prev.filter((p) => p.id !== targetPark.id));
        const successMsg = `Safari National Park "${targetPark.name}" was deleted successfully!`;
        showSuccess("Deletion Successful", successMsg);
        setStatusBanner({ type: "success", message: successMsg });
        if (editingPark?.id === targetPark.id) setEditingPark(null);
        setDeletingPark(null);
      } else {
        const errorMsg = res.error
          ? `Failed to delete "${targetPark.name}": ${res.error}`
          : `Failed to delete safari park "${targetPark.name}". Please verify Firestore database permissions.`;
        showError("Deletion Failed", errorMsg);
        setStatusBanner({ type: "error", message: errorMsg });
      }
    } catch (err: any) {
      console.error("Failed to delete park:", err);
      const errorMsg = `An unexpected error occurred while deleting "${deletingPark.name}".`;
      showError("Deletion Failed", errorMsg);
      setStatusBanner({ type: "error", message: errorMsg });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Inline Status Banner */}
      {statusBanner && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg transition-all ${
            statusBanner.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
              : "bg-red-950/90 border-red-500/50 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusBanner.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusBanner.message}</span>
          </div>
          <button
            onClick={() => setStatusBanner(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trees className="w-5 h-5 text-amber-400" />
            <span>Safari National Parks & Sanctuaries</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage Sri Lanka wildlife destinations, species sightings, upload multiple gallery photos, and add new national parks.</p>
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
            onClick={() => {
              setNewImage(DEFAULT_PARK_IMAGE);
              setNewImagesList([DEFAULT_PARK_IMAGE]);
              setIsAdding(true);
            }}
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
              {filteredParks.map((park) => {
                const parkGallery = park.gallery && park.gallery.length > 0 ? park.gallery : [park.image];
                return (
                  <tr
                    key={park.id}
                    onClick={() => router.push(`/parks/${park.slug || park.id}?admin=true`)}
                    title="Click row to open park single page with Admin Info"
                    className="hover:bg-slate-800/70 transition-colors group cursor-pointer"
                  >
                    {/* Name & Cover Image + Gallery count badge */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3.5">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                          <img
                            src={park.image}
                            alt={park.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {parkGallery.length > 1 && (
                            <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-amber-300 text-[8px] font-extrabold text-center py-0.5 border-t border-amber-500/30">
                              {parkGallery.length} Photos
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                            <span>{park.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPark({
                              ...park,
                              gallery: park.gallery && park.gallery.length > 0 ? park.gallery : [park.image],
                            });
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingPark(park);
                          }}
                          title={`Delete ${park.name}`}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/60 hover:border-red-500 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Park Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-2xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
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

                {/* Multiple Images Upload & Management Section */}
                <div className="sm:col-span-2 space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-amber-400 uppercase font-extrabold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Multiple Park Photo Gallery</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewImagesList([...newImagesList, ""])}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Image URL</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Enter direct URLs to national park landscape, wildlife, and gate photos. Click the star to set as main cover photo.
                  </p>

                  <div className="space-y-2">
                    {newImagesList.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-4 text-right">{idx + 1}.</span>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const updated = [...newImagesList];
                            updated[idx] = e.target.value;
                            setNewImagesList(updated);
                            if (idx === 0 && !newImage) setNewImage(e.target.value);
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none text-xs"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                        <button
                          type="button"
                          title="Set as Main Cover Image"
                          onClick={() => setNewImage(url)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            newImage === url
                              ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                              : "bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-400"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        {newImagesList.length > 1 && (
                          <button
                            type="button"
                            title="Remove Photo"
                            onClick={() => {
                              const updated = newImagesList.filter((_, i) => i !== idx);
                              setNewImagesList(updated);
                              if (newImage === url && updated.length > 0) {
                                setNewImage(updated[0]);
                              }
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Live Thumbnail Preview Strip */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Live Photo Previews</span>
                    <div className="flex flex-wrap gap-2">
                      {newImagesList.map((url, i) => (
                        <div
                          key={i}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border ${
                            newImage === url ? "border-amber-400 ring-2 ring-amber-400" : "border-slate-700"
                          }`}
                        >
                          <img
                            src={url || DEFAULT_PARK_IMAGE}
                            alt={`Preview ${i}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PARK_IMAGE;
                            }}
                          />
                          {newImage === url && (
                            <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 text-[8px] font-black text-center uppercase py-0.5">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
          <div className="bg-slate-900 border border-emerald-700/50 max-w-2xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
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

                {/* Multiple Images Management Section in Edit Modal */}
                <div className="sm:col-span-2 space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-amber-400 uppercase font-extrabold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Multiple Park Photo Gallery ({editingPark.gallery?.length || 1} Photos)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentGallery = editingPark.gallery || [editingPark.image];
                        setEditingPark({ ...editingPark, gallery: [...currentGallery, ""] });
                      }}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Image URL</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingPark.gallery || [editingPark.image]).map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-4 text-right">{idx + 1}.</span>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const updated = [...(editingPark.gallery || [editingPark.image])];
                            updated[idx] = e.target.value;
                            setEditingPark({
                              ...editingPark,
                              gallery: updated,
                              image: idx === 0 ? e.target.value : editingPark.image,
                            });
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none text-xs"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                        <button
                          type="button"
                          title="Set as Main Cover Image"
                          onClick={() => setEditingPark({ ...editingPark, image: url })}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            editingPark.image === url
                              ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                              : "bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-400"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        {(editingPark.gallery || [editingPark.image]).length > 1 && (
                          <button
                            type="button"
                            title="Remove Photo"
                            onClick={() => {
                              const updated = (editingPark.gallery || [editingPark.image]).filter((_, i) => i !== idx);
                              const newCover = editingPark.image === url ? updated[0] || DEFAULT_PARK_IMAGE : editingPark.image;
                              setEditingPark({
                                ...editingPark,
                                gallery: updated,
                                image: newCover,
                              });
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Live Thumbnail Preview Strip */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Live Photo Previews</span>
                    <div className="flex flex-wrap gap-2">
                      {(editingPark.gallery || [editingPark.image]).map((url, i) => (
                        <div
                          key={i}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border ${
                            editingPark.image === url ? "border-amber-400 ring-2 ring-amber-400" : "border-slate-700"
                          }`}
                        >
                          <img
                            src={url || DEFAULT_PARK_IMAGE}
                            alt={`Preview ${i}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PARK_IMAGE;
                            }}
                          />
                          {editingPark.image === url && (
                            <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 text-[8px] font-black text-center uppercase py-0.5">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const target = editingPark;
                    setEditingPark(null);
                    setDeletingPark(target);
                  }}
                  className="px-3.5 py-2 bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/80 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Park</span>
                </button>

                <div className="flex items-center space-x-2">
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPark && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/60 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Delete National Park?</h3>
                <p className="text-xs text-slate-400">This action will remove the park from public destinations.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs">
              <p className="font-bold text-white mb-1">{deletingPark.name}</p>
              <p className="text-slate-400 line-clamp-1">{deletingPark.tagline}</p>
            </div>

            <p className="text-[11px] text-red-300 font-medium bg-red-950/40 p-2.5 rounded-lg border border-red-900/40">
              ⚠️ Warning: Deleting this safari park will permanently unpublish it from the catalog.
            </p>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingPark(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

