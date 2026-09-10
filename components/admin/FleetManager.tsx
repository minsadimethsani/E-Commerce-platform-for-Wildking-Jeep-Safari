"use client";

import React, { useState } from "react";
import { JeepVehicleDoc } from "@/lib/types/firestore";
import { saveVehicleInFirestore } from "@/lib/firestore-service";
import { Truck, Plus, Edit3, X, Check, Search, ShieldCheck, Trash2, Image as ImageIcon, Star } from "lucide-react";

interface FleetManagerProps {
  fleet: JeepVehicleDoc[];
}

const DEFAULT_VEHICLE_IMAGE = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";

export default function FleetManager({ fleet }: FleetManagerProps) {
  const [fleetList, setFleetList] = useState<JeepVehicleDoc[]>(fleet);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<JeepVehicleDoc | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for adding new vehicle
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newCapacity, setNewCapacity] = useState("Up to 6 Passengers");
  const [newImage, setNewImage] = useState(DEFAULT_VEHICLE_IMAGE);
  const [newImagesList, setNewImagesList] = useState<string[]>([DEFAULT_VEHICLE_IMAGE]);
  const [newFeatures, setNewFeatures] = useState("360° Unobstructed Viewing, Stadium High-Rise Seating, Dual USB Fast Charging, Chilled Refrigerator");
  const [newSuspension, setNewSuspension] = useState("Heavy-Duty Off-Road Springs & Gas Shocks");
  const [newSeating, setNewSeating] = useState("Elevated 3-Tier Stadium Layout");
  const [newViewingAngle, setNewViewingAngle] = useState("360° Open Panorama Frame");
  const [newCharging, setNewCharging] = useState("USB-A & USB-C Ports at Every Seat");
  const [newAmenities, setNewAmenities] = useState("On-board Fridge, Dust Goggles, Spotting Scope Mount");

  const filteredFleet = fleetList.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSaving(true);
    const id = `vehicle-${Date.now()}`;

    // Clean image array
    const validImages = newImagesList.map((img) => img.trim()).filter(Boolean);
    const coverPhoto = newImage.trim() || validImages[0] || DEFAULT_VEHICLE_IMAGE;
    if (validImages.length === 0) validImages.push(coverPhoto);

    const newVehicleDoc: JeepVehicleDoc = {
      id,
      name: newName.trim(),
      tagline: newTagline.trim() || "Heavy-Duty 4x4 Safari Land Cruiser",
      model: newModel.trim() || "Toyota Land Cruiser HZJ79 4.2L Diesel",
      image: coverPhoto,
      images: validImages,
      capacity: newCapacity.trim() || "6 Passengers",
      features: newFeatures.split(",").map((f) => f.trim()).filter(Boolean),
      specs: {
        suspension: newSuspension.trim() || "Off-Road Gas Shocks",
        seating: newSeating.trim() || "3-Tier Stadium Seating",
        viewingAngle: newViewingAngle.trim() || "360 Degree Open View",
        charging: newCharging.trim() || "Dual USB Ports",
        amenities: newAmenities.trim() || "On-board Cooler Box & Binoculars",
      },
    };

    setFleetList((prev) => [newVehicleDoc, ...prev]);
    await saveVehicleInFirestore(newVehicleDoc);
    setIsSaving(false);
    setIsAdding(false);

    // Reset Form
    setNewName("");
    setNewTagline("");
    setNewModel("");
    setNewImage(DEFAULT_VEHICLE_IMAGE);
    setNewImagesList([DEFAULT_VEHICLE_IMAGE]);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    setIsSaving(true);
    const validImages = (editingVehicle.images || [editingVehicle.image]).map((i) => i.trim()).filter(Boolean);
    const coverPhoto = editingVehicle.image.trim() || validImages[0] || DEFAULT_VEHICLE_IMAGE;
    if (validImages.length === 0) validImages.push(coverPhoto);

    const updatedVehicle: JeepVehicleDoc = {
      ...editingVehicle,
      image: coverPhoto,
      images: validImages,
    };

    setFleetList((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)));
    await saveVehicleInFirestore(updatedVehicle);
    setIsSaving(false);
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Wildking 4x4 Expedition Fleet</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage heavy-duty Land Cruisers, upload multiple vehicle images, and update fleet specs.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={() => {
              setNewImage(DEFAULT_VEHICLE_IMAGE);
              setNewImagesList([DEFAULT_VEHICLE_IMAGE]);
              setIsAdding(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredFleet.map((vehicle) => {
          const allVehicleImages = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image];
          return (
            <div
              key={vehicle.id}
              className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full bg-slate-950">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow">
                  {vehicle.capacity}
                </span>

                {/* Photo Gallery Count Badge */}
                <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1 shadow">
                  <ImageIcon className="w-3 h-3 text-amber-400" />
                  <span>{allVehicleImages.length} Photo{allVehicleImages.length > 1 ? "s" : ""}</span>
                </span>
              </div>

              {/* Gallery Strip Preview */}
              {allVehicleImages.length > 1 && (
                <div className="bg-slate-950/90 px-3 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
                  {allVehicleImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className={`relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border ${
                        imgUrl === vehicle.image ? "border-amber-400 ring-1 ring-amber-400" : "border-slate-800 opacity-70"
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 space-y-3 flex-grow">
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight group-hover:text-amber-400 transition-colors">
                    {vehicle.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">{vehicle.tagline}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Model: {vehicle.model}</p>
                </div>

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

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full uppercase">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Certified Ready</span>
                </span>

                <button
                  onClick={() => setEditingVehicle({
                    ...vehicle,
                    images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image]
                  })}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Vehicle Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-2xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New 4x4 Expedition Vehicle</span>
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Overland Land Cruiser HZJ79 VIP Edition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Model / Chassis Spec</label>
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 4.2L Inline-6 Diesel 4x4"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Guest Capacity</label>
                  <input
                    type="text"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Up to 6 Passengers"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Heavy-Duty Overland Rig with Stadium Seating & Camera Mounts"
                  />
                </div>

                {/* Multiple Images Upload & Management Section */}
                <div className="sm:col-span-2 space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-amber-400 uppercase font-extrabold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Multiple Vehicle Photo Gallery</span>
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
                    Enter direct URLs to vehicle photos (exterior 4x4, stadium interior seating, open canopy roof view). Click the star to set as main cover photo.
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

                  {/* Thumbnail Preview Strip */}
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
                            src={url || DEFAULT_VEHICLE_IMAGE}
                            alt={`Preview ${i}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_VEHICLE_IMAGE;
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
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="360° Viewing, Stadium Seating, USB Charging, Chilled Refrigerator"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Suspension Spec</label>
                  <input
                    type="text"
                    value={newSuspension}
                    onChange={(e) => setNewSuspension(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Seating Spec</label>
                  <input
                    type="text"
                    value={newSeating}
                    onChange={(e) => setNewSeating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Viewing Angle</label>
                  <input
                    type="text"
                    value={newViewingAngle}
                    onChange={(e) => setNewViewingAngle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Charging Ports</label>
                  <input
                    type="text"
                    value={newCharging}
                    onChange={(e) => setNewCharging(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
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
                      <span>Save Vehicle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/50 max-w-2xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-slate-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit Vehicle: {editingVehicle.name}</span>
              </h3>
              <button
                onClick={() => setEditingVehicle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.name}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Model Spec</label>
                  <input
                    type="text"
                    value={editingVehicle.model}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Capacity</label>
                  <input
                    type="text"
                    value={editingVehicle.capacity}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingVehicle.tagline}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                {/* Multiple Images Management Section in Edit Modal */}
                <div className="sm:col-span-2 space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-amber-400 uppercase font-extrabold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Multiple Vehicle Photo Gallery ({editingVehicle.images?.length || 1} Photos)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentImgs = editingVehicle.images || [editingVehicle.image];
                        setEditingVehicle({ ...editingVehicle, images: [...currentImgs, ""] });
                      }}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Image URL</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingVehicle.images || [editingVehicle.image]).map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-4 text-right">{idx + 1}.</span>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const updated = [...(editingVehicle.images || [editingVehicle.image])];
                            updated[idx] = e.target.value;
                            setEditingVehicle({
                              ...editingVehicle,
                              images: updated,
                              image: idx === 0 ? e.target.value : editingVehicle.image,
                            });
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none text-xs"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                        <button
                          type="button"
                          title="Set as Main Cover Image"
                          onClick={() => setEditingVehicle({ ...editingVehicle, image: url })}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            editingVehicle.image === url
                              ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                              : "bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-400"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        {(editingVehicle.images || [editingVehicle.image]).length > 1 && (
                          <button
                            type="button"
                            title="Remove Photo"
                            onClick={() => {
                              const updated = (editingVehicle.images || [editingVehicle.image]).filter((_, i) => i !== idx);
                              const newCover = editingVehicle.image === url ? updated[0] || DEFAULT_VEHICLE_IMAGE : editingVehicle.image;
                              setEditingVehicle({
                                ...editingVehicle,
                                images: updated,
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

                  {/* Thumbnail Preview Strip */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Live Photo Previews</span>
                    <div className="flex flex-wrap gap-2">
                      {(editingVehicle.images || [editingVehicle.image]).map((url, i) => (
                        <div
                          key={i}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border ${
                            editingVehicle.image === url ? "border-amber-400 ring-2 ring-amber-400" : "border-slate-700"
                          }`}
                        >
                          <img
                            src={url || DEFAULT_VEHICLE_IMAGE}
                            alt={`Preview ${i}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_VEHICLE_IMAGE;
                            }}
                          />
                          {editingVehicle.image === url && (
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
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={editingVehicle.features?.join(", ")}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
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

