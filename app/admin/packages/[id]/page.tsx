"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { validatePackageForm } from "@/lib/validation";
import { getPackagesFromFirestore, savePackageInFirestore } from "@/lib/firestore-service";
import { SAFARI_PACKAGES } from "@/data/packages";
import { SafariPackageDoc, ParkType, TimeSlotType } from "@/lib/types/firestore";
import {
  ArrowLeft,
  Save,
  Compass,
  MapPin,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  ImageIcon,
} from "lucide-react";

const PARK_NAME_MAP: Record<ParkType, string> = {
  yala: "Yala National Park",
  udawalawe: "Udawalawe National Park",
  wilpattu: "Wilpattu National Park",
  minneriya: "Minneriya National Park",
};

interface SinglePackagePageProps {
  params: Promise<{ id: string }>;
}

export default function SingleAdminPackagePage({ params }: SinglePackagePageProps) {
  const resolvedParams = use(params);
  const packageId = resolvedParams.id;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Package Form Fields State
  const [title, setTitle] = useState("");
  const [park, setPark] = useState<ParkType>("yala");
  const [parkName, setParkName] = useState("Yala National Park");
  const [tagline, setTagline] = useState("");
  const [duration, setDuration] = useState("Half-Day (5 Hours)");
  const [timeSlot, setTimeSlot] = useState<TimeSlotType>("Dawn Patrol (5:30 AM)");
  const [priceUsd, setPriceUsd] = useState<number>(180);
  const [priceEur, setPriceEur] = useState<number>(165);
  const [priceLkr, setPriceLkr] = useState<number>(54000);
  const [maxGuests, setMaxGuests] = useState<number>(6);
  const [sightingsRate, setSightingsRate] = useState("95% Sighting Rate");
  const [badge, setBadge] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [inclusionsText, setInclusionsText] = useState("");
  const [rating, setRating] = useState(5.0);
  const [reviewsCount, setReviewsCount] = useState(1);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }

    const loadPackage = async () => {
      setIsLoading(true);
      try {
        const firestorePkgs = await getPackagesFromFirestore();
        let found = firestorePkgs.find((p) => p.id === packageId);

        if (!found) {
          found = (SAFARI_PACKAGES as SafariPackageDoc[]).find((p) => p.id === packageId);
        }

        if (found) {
          setTitle(found.title || "");
          setPark(found.park || "yala");
          setParkName(found.parkName || PARK_NAME_MAP[found.park] || "National Park");
          setTagline(found.tagline || "");
          setDuration(found.duration || "Half-Day (5 Hours)");
          setTimeSlot(found.timeSlot || "Dawn Patrol (5:30 AM)");
          setPriceUsd(found.priceUsd || 0);
          setPriceEur(found.priceEur || 0);
          setPriceLkr(found.priceLkr || 0);
          setMaxGuests(found.maxGuests || 6);
          setSightingsRate(found.sightingsRate || "95% Sighting Rate");
          setBadge(found.badge || "");
          setImage(found.image || "");
          setDescription(found.description || "");
          setHighlightsText((found.highlights || []).join(", "));
          setInclusionsText((found.inclusions || []).join(", "));
          setRating(found.rating || 5.0);
          setReviewsCount(found.reviewsCount || 1);
        } else {
          setError(`Safari Package with ID "${packageId}" was not found.`);
        }
      } catch (err: any) {
        console.error("Error loading package details:", err);
        setError("Failed to load package details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPackage();
  }, [packageId, router]);

  const handleParkChange = (selectedPark: ParkType) => {
    setPark(selectedPark);
    setParkName(PARK_NAME_MAP[selectedPark] || "National Park");
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setError(null);

    const valRes = validatePackageForm({
      title,
      parkName: PARK_NAME_MAP[park] || parkName,
      tagline,
      priceLkr: Number(priceLkr),
      description,
      maxGuests: Number(maxGuests),
    });

    if (!valRes.isValid) {
      const firstError = Object.values(valRes.errors)[0];
      alert(`Validation Error: ${firstError}`);
      return;
    }

    setIsSaving(true);

    const updatedDoc: SafariPackageDoc = {
      id: packageId,
      title: title.trim(),
      park,
      parkName: PARK_NAME_MAP[park] || parkName,
      tagline: tagline.trim(),
      duration: duration.trim(),
      timeSlot,
      priceUsd: Number(priceUsd),
      priceEur: Number(priceEur),
      priceLkr: Number(priceLkr),
      rating,
      reviewsCount,
      sightingsRate: sightingsRate.trim(),
      badge: badge.trim() || undefined,
      image: image.trim(),
      description: description.trim(),
      highlights: highlightsText.split(",").map((s) => s.trim()).filter(Boolean),
      inclusions: inclusionsText.split(",").map((s) => s.trim()).filter(Boolean),
      maxGuests: Number(maxGuests),
    };

    try {
      await savePackageInFirestore(updatedDoc);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert("Failed to save changes: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-300 text-sm font-semibold">Loading Package Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Package Not Found</h2>
          <p className="text-xs text-slate-300">{error}</p>
          <button
            onClick={() => router.push("/admin?tab=packages")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
          >
            ← Return to Packages Manager
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 space-y-6 font-sans">
      {/* Top Header Navigation & Action Bar */}
      <div className="bg-slate-900/90 border border-emerald-800/40 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/admin?tab=packages")}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all flex items-center justify-center cursor-pointer border border-slate-700"
            title="Back to Packages list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                Single Package Editor
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Active & Live
              </span>
            </div>
            <h1 className="text-xl font-black text-white">{title || "Untitled Package"}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => window.open(`/tours`, "_blank")}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview on Site</span>
          </button>

          <button
            onClick={handleSavePackage}
            disabled={isSaving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Package updated successfully! Changes are live in Firestore and on the website.</span>
        </div>
      )}

      {/* Main Grid: Left Form (2/3) & Right Preview Card (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Edit Details */}
        <form onSubmit={handleSavePackage} className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Expedition Information */}
          <div className="bg-slate-900/90 border border-emerald-800/40 p-6 rounded-2xl space-y-4 shadow-lg">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>1. Basic Expedition Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Signature Leopard Tracking & Bush Breakfast"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target National Park
                  </label>
                  <select
                    value={park}
                    onChange={(e) => handleParkChange(e.target.value as ParkType)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="yala">Yala National Park</option>
                    <option value="udawalawe">Udawalawe National Park</option>
                    <option value="wilpattu">Wilpattu National Park</option>
                    <option value="minneriya">Minneriya National Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as TimeSlotType)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Dawn Patrol (5:30 AM)">Dawn Patrol (5:30 AM)</option>
                    <option value="Dusk Safari (2:30 PM)">Dusk Safari (2:30 PM)</option>
                    <option value="Full-Day VIP (5:30 AM - 6:00 PM)">Full-Day VIP (5:30 AM - 6:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Max Guest Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Rates & Badges */}
          <div className="bg-slate-900/90 border border-emerald-800/40 p-6 rounded-2xl space-y-4 shadow-lg">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              2. Rates & Promotional Highlights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Price (USD $)
                </label>
                <input
                  type="number"
                  required
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-amber-400 font-extrabold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Price (EUR €)
                </label>
                <input
                  type="number"
                  required
                  value={priceEur}
                  onChange={(e) => setPriceEur(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-amber-400 font-extrabold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Price (LKR Rs)
                </label>
                <input
                  type="number"
                  required
                  value={priceLkr}
                  onChange={(e) => setPriceLkr(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-amber-400 font-extrabold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Badge Highlight
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Signature VIP or Most Popular"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sightings Guarantee Rate
                </label>
                <input
                  type="text"
                  value={sightingsRate}
                  onChange={(e) => setSightingsRate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-emerald-400 font-semibold text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Descriptions */}
          <div className="bg-slate-900/90 border border-emerald-800/40 p-6 rounded-2xl space-y-4 shadow-lg">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>3. Media & Description</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Expedition Highlights (comma separated)
                </label>
                <textarea
                  rows={2}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Elevated seating 4x4, Expert Leopard Tracker, Cold Drinks"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Included Permits & Services (comma separated)
                </label>
                <textarea
                  rows={2}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Hotel Pick & Drop, National Park Entrance Tickets, Binoculars"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Sidebar: Live Card Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl space-y-4 sticky top-6 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Live Website Card Preview</span>
            </h3>

            {/* Preview Card */}
            <div className="bg-[#0a150f] border border-emerald-800/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="relative h-44 w-full bg-slate-950">
                <img
                  src={image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000"}
                  alt={title}
                  className="w-full h-full object-cover opacity-85"
                />
                {badge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-950/90 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {parkName}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <h4 className="font-extrabold text-white text-base leading-tight">
                  {title || "Expedition Title"}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {description || "Expedition description preview..."}
                </p>

                <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-400">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> {duration}
                  </span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-teal-300 flex items-center gap-1">
                    <Users className="w-3 h-3 text-teal-400" /> Max {maxGuests} Guests
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between mt-2">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">From</p>
                    <p className="text-base font-black text-amber-400">${priceUsd} USD</p>
                  </div>
                  <div className="text-right text-[10px] font-semibold text-slate-400">
                    <p>€{priceEur} EUR</p>
                    <p className="text-emerald-400 font-bold">{sightingsRate}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center italic">
              Changes reflect live for customers immediately upon clicking "Save Changes".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
