'use client';

import React, { useState, useEffect } from 'react';
import { JEEP_FLEET, JeepVehicle } from '../data/packages';
import { getFleetFromFirestore } from '../lib/firestore-service';
import { JeepVehicleDoc } from '../lib/types/firestore';
import {
  Shield,
  Zap,
  Eye,
  BatteryCharging,
  CheckCircle,
  Car,
  ArrowRight,
  X,
  Info,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

interface FleetShowcaseProps {
  onOpenBooking?: () => void;
}

interface VehicleCardProps {
  vehicle: JeepVehicle | JeepVehicleDoc;
  onOpenBooking?: () => void;
  onOpenSpecModal: (vehicle: JeepVehicle | JeepVehicleDoc) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';

const FleetVehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onOpenBooking, onOpenSpecModal }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const vehicleImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [vehicle.image || FALLBACK_IMAGE];

  const currentPhoto = vehicleImages[activeImageIndex] || vehicleImages[0] || FALLBACK_IMAGE;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

  return (
    <div className="group flex flex-col justify-between bg-[#08101d] border border-slate-800 rounded-none overflow-hidden shadow-xl hover:border-amber-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5">
      {/* Top Image Showcase Box */}
      <div className="space-y-2 p-3 sm:p-4 pb-0">
        <div className="relative h-64 sm:h-72 w-full rounded-none overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={currentPhoto}
            alt={`${vehicle.name} - Photo ${activeImageIndex + 1}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.93] contrast-[1.03] group-hover:brightness-105"
          />
          {/* Subtle Dark Gradients & Ring */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <div className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 backdrop-blur-sm pointer-events-auto">
              <ShieldCheck className="w-3 h-3 text-slate-950" />
              <span>DWC Certified</span>
            </div>

            {vehicleImages.length > 1 && (
              <div className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-extrabold border border-amber-500/40 flex items-center gap-1 pointer-events-auto shadow-lg">
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span>{activeImageIndex + 1}/{vehicleImages.length}</span>
              </div>
            )}
          </div>

          {/* Image Navigation Arrows */}
          {vehicleImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                aria-label="Previous Photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-slate-700 flex items-center justify-center transition-all shadow-md cursor-pointer z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                aria-label="Next Photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-slate-700 flex items-center justify-center transition-all shadow-md cursor-pointer z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider block">
              {vehicle.model}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        {vehicleImages.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {vehicleImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-10 rounded-none overflow-hidden shrink-0 border transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/50 opacity-100 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between space-y-5 flex-1">
        {/* Title, Tagline & Capacity Pill */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-serif tracking-tight uppercase line-clamp-1">
                {vehicle.name}
              </h3>
              <p className="text-xs text-amber-400/90 font-medium italic mt-0.5">
                "{vehicle.tagline}"
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-bold">
            <Car className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Capacity: {vehicle.capacity}</span>
          </div>

          {/* Key Features Bullet List */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            {vehicle.features?.slice(0, 4).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specs Grid & CTA Actions */}
        <div className="space-y-4 pt-2">
          {/* Technical Specs 2x2 Mini Grid */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[9px] uppercase font-extrabold text-slate-400 mb-0.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Suspension</span>
              </div>
              <div className="text-[11px] font-bold text-white line-clamp-1">{vehicle.specs?.suspension}</div>
            </div>

            <div className="bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[9px] uppercase font-extrabold text-slate-400 mb-0.5 flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400 shrink-0" />
                <span>View Angle</span>
              </div>
              <div className="text-[11px] font-bold text-white line-clamp-1">{vehicle.specs?.viewingAngle}</div>
            </div>

            <div className="bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[9px] uppercase font-extrabold text-slate-400 mb-0.5 flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Charging</span>
              </div>
              <div className="text-[11px] font-bold text-white line-clamp-1">{vehicle.specs?.charging}</div>
            </div>

            <div className="bg-slate-950 p-2.5 border border-slate-800">
              <div className="text-[9px] uppercase font-extrabold text-slate-400 mb-0.5 flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Amenities</span>
              </div>
              <div className="text-[11px] font-bold text-white line-clamp-1">{vehicle.specs?.amenities}</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpenSpecModal(vehicle)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Specs</span>
            </button>

            {onOpenBooking && (
              <button
                type="button"
                onClick={onOpenBooking}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Book This Jeep</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({ onOpenBooking }) => {
  const [fleetList, setFleetList] = useState<(JeepVehicle | JeepVehicleDoc)[]>(JEEP_FLEET);
  const [modalVehicle, setModalVehicle] = useState<JeepVehicle | JeepVehicleDoc | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const firestoreFleet = await getFleetFromFirestore();
        if (firestoreFleet && firestoreFleet.length > 0) {
          setFleetList(firestoreFleet);
        }
      } catch (err) {
        console.error("Error fetching fleet in FleetShowcase:", err);
      }
    };
    fetchFleet();
  }, []);

  const handleOpenSpecModal = (vehicle: JeepVehicle | JeepVehicleDoc) => {
    setModalVehicle(vehicle);
    setModalImageIndex(0);
  };

  const modalImages = modalVehicle
    ? modalVehicle.images && modalVehicle.images.length > 0
      ? modalVehicle.images
      : [modalVehicle.image || FALLBACK_IMAGE]
    : [];

  const currentModalPhoto = modalImages[modalImageIndex] || modalImages[0] || FALLBACK_IMAGE;

  return (
    <section id="fleet" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050b14] border-t border-b border-emerald-900/40 relative overflow-hidden font-sans">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-emerald-900/50 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-widest text-emerald-300">
            <Car className="w-3.5 h-3.5" />
            <span>CUSTOM OVERLAND 4X4 FLEET</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-serif uppercase tracking-tight">
            Meet Your Expedition Fleet
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            Engineered exclusively for Sri Lanka’s rugged national park terrain with stadium seating, zero-vibration camera mounts, and 360° unobstructed views.
          </p>
        </div>

        {/* Columnar Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {fleetList.map((vehicle) => (
            <FleetVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onOpenBooking={onOpenBooking}
              onOpenSpecModal={handleOpenSpecModal}
            />
          ))}
        </div>

        {/* Passenger Safety Guarantee Footer Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#08101d] border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase font-serif tracking-wider">
                Certified Passenger Safety & Wilderness First-Aid Standards
              </h4>
              <p className="text-xs text-slate-400">
                Heavy-Duty Steel Roll Cages • 3-Point Individual Off-Road Seatbelts • Emergency Medical & First-Aid Kit • Live Satellite GPS Tracker
              </p>
            </div>
          </div>
          {onOpenBooking && (
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all shrink-0 cursor-pointer"
            >
              Book Expedition Safari
            </button>
          )}
        </div>
      </div>

      {/* Full Technical Specifications Modal */}
      {modalVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#08101d] border border-amber-500/40 max-w-2xl w-full rounded-none p-6 sm:p-8 space-y-6 shadow-2xl relative text-white my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  {modalVehicle.model}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                  {modalVehicle.name} Technical Specs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalVehicle(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="space-y-2">
              <div className="relative h-64 rounded-none overflow-hidden bg-slate-950 border border-slate-800">
                <img src={currentModalPhoto} alt={modalVehicle.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300 border border-white/10">
                  Capacity: {modalVehicle.capacity}
                </div>
              </div>
              {modalImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {modalImages.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setModalImageIndex(i)}
                      className={`w-16 h-12 border overflow-hidden shrink-0 transition-all ${
                        modalImageIndex === i ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={imgUrl} alt={`Modal thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Specs Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Off-Road Engineering Breakdown</span>
              </h4>

              <div className="bg-slate-950 border border-slate-800 divide-y divide-slate-800 text-xs">
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400 font-medium">Chassis & Engine</span>
                  <span className="font-bold text-white text-right">{modalVehicle.model}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400 font-medium">Suspension System</span>
                  <span className="font-bold text-emerald-300 text-right">{modalVehicle.specs?.suspension}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400 font-medium">Seating Configuration</span>
                  <span className="font-bold text-amber-300 text-right">{modalVehicle.specs?.seating}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400 font-medium">Field of View</span>
                  <span className="font-bold text-white text-right">{modalVehicle.specs?.viewingAngle}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400 font-medium">Power & Connectivity</span>
                  <span className="font-bold text-white text-right">{modalVehicle.specs?.charging}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-slate-400 font-medium">On-Board Equipment</span>
                  <span className="font-bold text-white text-right">{modalVehicle.specs?.amenities}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalVehicle(null)}
                className="px-5 py-2.5 bg-slate-900 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              {onOpenBooking && (
                <button
                  type="button"
                  onClick={() => {
                    setModalVehicle(null);
                    onOpenBooking();
                  }}
                  className="px-6 py-2.5 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>Reserve This Jeep</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
